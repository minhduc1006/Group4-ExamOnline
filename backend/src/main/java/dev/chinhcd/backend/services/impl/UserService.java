package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.dtos.request.*;
import dev.chinhcd.backend.dtos.response.PaginateUserResponse;
import dev.chinhcd.backend.dtos.response.RegisterResponse;
import dev.chinhcd.backend.dtos.response.UserResponse;
import dev.chinhcd.backend.enums.AccountType;
import dev.chinhcd.backend.enums.ErrorCode;
import dev.chinhcd.backend.enums.Role;
import dev.chinhcd.backend.exception.ServiceException;
import dev.chinhcd.backend.models.Articles;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.repository.IUserRepository;
import dev.chinhcd.backend.services.IEmailService;
import dev.chinhcd.backend.services.IJwtService;
import dev.chinhcd.backend.services.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements IUserService {
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IEmailService emailService;
    private final IJwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Override
    public RegisterResponse createRegisterUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) throw new ServiceException(ErrorCode.USER_EXISTED);
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        user.setAccountType(AccountType.FREE_COURSE);
        user.setIsDoingExam(false);

        user = userRepository.save(user);
        return new RegisterResponse(user.getId(), user.getUsername());
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::mapResponse).collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserResponseById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        return mapResponse(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public UserResponse getMe() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        var user = userRepository.findByUsername(name)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        return mapResponse(user);
    }

    @Override
    public UserResponse updateUser(UpdateUserRequest request) {
        var user = userRepository.findById(request.id()).orElseThrow(
                () -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        Integer grade = Integer.parseInt(request.grade());
        user.setName(request.name());
        user.setGender(request.gender());
        user.setGrade(grade);
        user.setProvince(request.province());
        user.setDistrict(request.district());
        user.setWard(request.ward());
        user.setEducationLevel(request.educationLevel());
        user.setBirthDate(request.birthDate());
        User updatedUser = userRepository.save(user);
        return mapResponse(updatedUser);
    }

    @Override
    public Boolean isNewUser(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        return user.getName() == null || user.getName().isBlank();
    }

    @Override
    public Boolean requestAddMail(VerifyEmailRequest request) {
        User user = userRepository.findById(request.id())
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        User userHasEmail = userRepository.findByEmail(request.email()).orElse(null);
        if (userHasEmail != null) {
            return false;
        }
        String token = jwtService.generateAccessToken(user);
        emailService.sendVerificationEmail(request.email(), "Yêu cầu thêm email", "thêm email", token, "/email-service/add-email", request.id());
        return true;
    }

    @Override
    public Boolean addMail(AddEmailRequest request) {
        String username = jwtService.extractUserName(request.token());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        if (!jwtService.isValidAcessToken(request.token(), user)) {
            throw new ServiceException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        user.setEmail(request.email());
        userRepository.save(user);
        return true;
    }

    @Override
    public Boolean requestDeleteMail(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        String token = jwtService.generateAccessToken(user);
        emailService.sendVerificationEmail(user.getEmail(), "Yêu cầu xóa email", "xóa email", token, "/email-service/delete-email", id);
        return true;
    }

    @Override
    public Boolean deleteMail(String token) {
        String username = jwtService.extractUserName(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        if (!jwtService.isValidAcessToken(token, user)) {
            throw new ServiceException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        user.setEmail(null);
        userRepository.save(user);
        return true;
    }

    @Override
    public Boolean changePassword(ChangePasswordRequest request) {
        var user = userRepository.findById(request.id())
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return true;
    }

    @Override
    public Boolean requestForgotPassword(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return false;
        }
        if (user.get().getEmail() == null || user.get().getEmail().isBlank()) {
            return false;
        }
        String token = jwtService.generateAccessToken(user.get());
        try {
            emailService.sendVerificationEmail(user.get().getEmail(), "Yêu cầu quên mật khẩu", "quên mật khẩu", token, "/email-service/forgot", user.get().getId());
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @Override
    public Boolean resetPassword(ResetPasswordRequest request) {
        String username = jwtService.extractUserName(request.token());
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);
        return true;
    }

    @Override
    public List<UserResponse> getManager(Role type) {
        List<User> users = userRepository.getUsersByRole(type);
        return users.stream().map(this::mapResponse).collect(Collectors.toList());
    }

    @Override
    public Boolean deleteUser(Long id) {
        refreshTokenService.deleteByUserId(id);
        userRepository.deleteById(id);
        return true;
    }

    @Override
    public Boolean addManager(AddManagerRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new ServiceException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return false;
        }
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .accountType(AccountType.FREE_COURSE)
                .isDoingExam(false)
                .build();
        userRepository.save(user);
        return true;
    }

    @Override
    public Boolean adminChangePassUser(ChangePasswordRequest request) {
        var user = userRepository.findById(request.id())
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return true;
    }

    @Override
    public Boolean changeAccountType(ChangeAccountTypeRequest request) {
        var user = userRepository.findById(request.id())
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        user.setAccountType(request.accountType());
        userRepository.save(user);
        return true;
    }

    @Override
    public PaginateUserResponse getPaginatedUsers(int page, int pageSize, String username, String email) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        if (username.isBlank()) {
            username = null;
        }
        if (email.isBlank()) {
            email = null;
        }
        Page<User> usersPage = userRepository.getUsersByRole(Role.USER, pageable, username, email);

        List<UserResponse> users = usersPage.getContent().stream().map(this::mapResponse).collect(Collectors.toList());
        return new PaginateUserResponse(users,
                usersPage.getTotalPages(),
                usersPage.getTotalElements(),
                usersPage.getNumber() + 1,
                pageSize);
    }

    public UserResponse mapResponse(User user) {
        return UserResponse.builder()
                .birthDate(user.getBirthDate())
                .educationLevel(user.getEducationLevel())
                .email(user.getEmail())
                .gender(user.getGender())
                .grade(user.getGrade())
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .role(user.getRole().name())
                .province(user.getProvince())
                .district(user.getDistrict())
                .ward(user.getWard())
                .accountType(user.getAccountType() != null ? user.getAccountType().name() : "")
                .isDoingExam(false)
                .build();
    }
}

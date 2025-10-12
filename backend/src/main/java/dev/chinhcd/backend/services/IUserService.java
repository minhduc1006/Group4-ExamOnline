package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.request.*;
import dev.chinhcd.backend.dtos.response.AchievementResponse;
import dev.chinhcd.backend.dtos.response.PaginateUserResponse;
import dev.chinhcd.backend.dtos.response.RegisterResponse;
import dev.chinhcd.backend.dtos.response.UserResponse;
import dev.chinhcd.backend.enums.Role;
import dev.chinhcd.backend.models.User;

import java.util.List;

public interface IUserService {
    RegisterResponse createRegisterUser(RegisterRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserResponseById(Long id);

    User getUserById(Long id);

    User getUserByUsername(String username);

    UserResponse getMe();

    User getCurrentUser();

    UserResponse updateUser(UpdateUserRequest request);

    Boolean isNewUser(String username);

    Boolean requestAddMail(VerifyEmailRequest request);

    Boolean addMail(AddEmailRequest request);

    Boolean requestDeleteMail(Long id);

    Boolean deleteMail(String token);

    Boolean changePassword(ChangePasswordRequest request);

    Boolean requestForgotPassword(String username);

    Boolean resetPassword(ResetPasswordRequest request);

    List<UserResponse> getManager(Role type);

    Boolean deleteUser(Long id);

    Boolean addManager(AddManagerRequest request);

    Boolean adminChangePassUser(ChangePasswordRequest request);

    Boolean changeAccountType(ChangeAccountTypeRequest request);

    PaginateUserResponse getPaginatedUsers(int page, int pageSize, String username, String email, String accountType, String sort);

    void saveUser(User user);

//    AchievementResponse getAchievement();

    void unlockUser(Long id);

    void lockUser(Long id);

    void checkPackageExpired(User user);
}

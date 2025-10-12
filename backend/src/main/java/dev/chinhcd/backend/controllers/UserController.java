package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.dtos.request.*;
import dev.chinhcd.backend.dtos.response.AchievementResponse;
import dev.chinhcd.backend.dtos.response.PaginateUserResponse;
import dev.chinhcd.backend.dtos.response.UserResponse;
import dev.chinhcd.backend.enums.Role;
import dev.chinhcd.backend.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final IUserService userService;

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserResponseById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        return ResponseEntity.ok(userService.getMe());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STUDENT')")
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(request));
    }

    @GetMapping("/is-new-user")
    public ResponseEntity<Boolean> isNewUser(@RequestParam String username) {
        return ResponseEntity.ok(userService.isNewUser(username));
    }

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/request-add-email")
    public ResponseEntity<Boolean> requestAddMail(@RequestBody VerifyEmailRequest request) {
        return ResponseEntity.ok(userService.requestAddMail(request));
    }
    
    @PutMapping("/add-email")
    public ResponseEntity<Boolean> addMail(@RequestBody AddEmailRequest request) {
        return ResponseEntity.ok(userService.addMail(request));
    }

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/request-delete-email")
    public ResponseEntity<Boolean> requestDeleteMail(@RequestBody RequestDeleteEmailRequest request) {
        return ResponseEntity.ok(userService.requestDeleteMail(request.id()));
    }

    @PutMapping("/delete-email")
    public ResponseEntity<Boolean> deleteMail(@RequestBody VerifyRequest request) {
        return ResponseEntity.ok(userService.deleteMail(request.token()));
    }

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PutMapping("/change-password")
    public ResponseEntity<Boolean> changePassword(@RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(userService.changePassword(request));
    }

    @PostMapping("/request-forgot-password")
    public ResponseEntity<Boolean> requestForgotPassword(@RequestBody RequestForgotPasswordRequest request) {
        return ResponseEntity.ok(userService.requestForgotPassword(request.username()));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STUDENT')")
    @PutMapping("/reset-password")
    public ResponseEntity<Boolean> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(userService.resetPassword(request));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/get-manager")
    public ResponseEntity<List<UserResponse>> getManager(@RequestParam Role type) {
        return ResponseEntity.ok(userService.getManager(type));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PostMapping("/add-manager")
    public ResponseEntity<Boolean> addManager(@RequestBody AddManagerRequest request) {
        return ResponseEntity.ok(userService.addManager(request));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PostMapping("/admin-change-pass")
    public ResponseEntity<Boolean> adminChangePass(@RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(userService.adminChangePassUser(request));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/change-account-type")
    public ResponseEntity<Boolean> changeAccountType(@RequestBody ChangeAccountTypeRequest request) {
        return ResponseEntity.ok(userService.changeAccountType(request));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/get-user-page")
    public ResponseEntity<PaginateUserResponse> getPaginatedUsers(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "pageSize", defaultValue = "20") int pageSize,
            @RequestParam String username, @RequestParam String email,
            @RequestParam(name = "accountType", defaultValue = "") String accountType,
            @RequestParam String sort) {
        return ResponseEntity.ok(userService.getPaginatedUsers(page, pageSize, username, email, accountType, sort));
    }

//    @PreAuthorize("hasAnyAuthority('STUDENT')")
//    @GetMapping("/get-achievements")
//    public ResponseEntity<AchievementResponse> getAchievements() {
//        return ResponseEntity.ok().body(userService.getAchievement());
//    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/unlock/{id}")
    public ResponseEntity<?> unlockUser(@PathVariable Long id) {
        userService.unlockUser(id);
        return ResponseEntity.ok().body("Done");
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/lock/{id}")
    public ResponseEntity<?> lockUser(@PathVariable Long id) {
        userService.lockUser(id);
        return ResponseEntity.ok().body("Done");
    }

}

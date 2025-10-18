package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.dtos.request.*;
import dev.chinhcd.backend.dtos.response.PaginateUserResponse;
import dev.chinhcd.backend.dtos.response.UserResponse;
import dev.chinhcd.backend.dtos.response.longnt.PaginateArticlesResponse;
import dev.chinhcd.backend.enums.Role;
import dev.chinhcd.backend.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final IUserService userService;

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

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(request));
    }

    @GetMapping("/is-new-user")
    public ResponseEntity<Boolean> isNewUser(@RequestParam String username) {
        return ResponseEntity.ok(userService.isNewUser(username));
    }

    @PostMapping("/request-add-email")
    public ResponseEntity<Boolean> requestAddMail(@RequestBody VerifyEmailRequest request) {
        return ResponseEntity.ok(userService.requestAddMail(request));
    }

    @PutMapping("/add-email")
    public ResponseEntity<Boolean> addMail(@RequestBody AddEmailRequest request) {
        return ResponseEntity.ok(userService.addMail(request));
    }

    @PostMapping("/request-delete-email")
    public ResponseEntity<Boolean> requestDeleteMail(@RequestBody RequestDeleteEmailRequest request) {
        return ResponseEntity.ok(userService.requestDeleteMail(request.id()));
    }

    @PutMapping("/delete-email")
    public ResponseEntity<Boolean> deleteMail(@RequestBody VerifyRequest request) {
        return ResponseEntity.ok(userService.deleteMail(request.token()));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Boolean> changePassword(@RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(userService.changePassword(request));
    }

    @PostMapping("/request-forgot-password")
    public ResponseEntity<Boolean> requestForgotPassword(@RequestBody RequestForgotPasswordRequest request) {
        return ResponseEntity.ok(userService.requestForgotPassword(request.username()));
    }

    @PutMapping("/reset-password")
    public ResponseEntity<Boolean> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(userService.resetPassword(request));
    }

    @GetMapping("/get-manager")
    public ResponseEntity<List<UserResponse>> getManager(@RequestParam Role type) {
        return ResponseEntity.ok(userService.getManager(type));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @PostMapping("/add-manager")
    public ResponseEntity<Boolean> addManager(@RequestBody AddManagerRequest request) {
        return ResponseEntity.ok(userService.addManager(request));
    }

    @PostMapping("/admin-change-pass")
    public ResponseEntity<Boolean> adminChangePass(@RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(userService.adminChangePassUser(request));
    }

    @PutMapping("/change-account-type")
    public ResponseEntity<Boolean> changeAccountType(@RequestBody ChangeAccountTypeRequest request) {
        return ResponseEntity.ok(userService.changeAccountType(request));
    }

    @GetMapping("/get-user-page")
    public ResponseEntity<PaginateUserResponse> getPaginatedUsers(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "pageSize", defaultValue = "20") int pageSize,
            @RequestParam String username, @RequestParam String email) {
        return ResponseEntity.ok(userService.getPaginatedUsers(page, pageSize, username, email));
    }

}

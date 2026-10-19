package com.mediflow.controller;

import static org.aspectj.weaver.tools.cache.SimpleCacheFactory.enabled;

import com.mediflow.dto.admin.CreateReceptionistRequest;
import com.mediflow.dto.admin.UpdateUserEnabledRequest;
import com.mediflow.dto.admin.UserAdminResponse;
import com.mediflow.entity.User;
import com.mediflow.security.AuthorizationService;
import com.mediflow.service.AdminUserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

  private final AdminUserService adminUserService;
  private final AuthorizationService authorizationService;
  private final PasswordEncoder passwordEncoder;

  public AdminUserController(AdminUserService adminUserService,
      AuthorizationService authorizationService,
      PasswordEncoder passwordEncoder
  ) {
    this.adminUserService = adminUserService;
    this.authorizationService = authorizationService;
    this.passwordEncoder = passwordEncoder;
  }


  @GetMapping("/users")
  public List<UserAdminResponse> getUsers() {

    return adminUserService.getAllUsers();
  }


  @PostMapping("/receptionists")
  @ResponseStatus(HttpStatus.CREATED)
  public UserAdminResponse createReceptionist(
      @Valid @RequestBody CreateReceptionistRequest request
  ) {

    return adminUserService.createReceptionist(request);
  }


  @PatchMapping("/users/{id}/enabled")
  public UserAdminResponse updateEnabled(
      @PathVariable Long id,
      @RequestBody UpdateUserEnabledRequest request
  ) {

    User currentUser = authorizationService.getCurrentUser();

    if (currentUser != null && currentUser.getUserId().equals(id) && !enabled) {
      throw new IllegalArgumentException("You cannot disable your own account");
    }
    return adminUserService.updateEnabled(id, request.enabled());
  }
}
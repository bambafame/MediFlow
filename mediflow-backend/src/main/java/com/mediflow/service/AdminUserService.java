package com.mediflow.service;

import com.mediflow.dto.admin.CreateReceptionistRequest;
import com.mediflow.dto.admin.UserAdminResponse;
import com.mediflow.entity.Receptionist;
import com.mediflow.entity.Role;
import com.mediflow.entity.User;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.UserRepository;

import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminUserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public AdminUserService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder
  ) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }


  @Transactional(readOnly = true)
  public List<UserAdminResponse> getAllUsers() {

    return userRepository
        .findAll(Sort.by(Sort.Direction.ASC, "username"))
        .stream()
        .map(this::toResponse)
        .toList();
  }


  public UserAdminResponse createReceptionist(CreateReceptionistRequest request) {

    if (userRepository.existsByUsername(request.username())) {
      throw new IllegalArgumentException("Username already exists");
    }

    if (userRepository.existsByEmail(request.email())) {
      throw new IllegalArgumentException("Email already exists");
    }

    Receptionist receptionist = new Receptionist();

    receptionist.setUsername(request.username());

    receptionist.setPasswordHash(passwordEncoder.encode(request.password()));

    receptionist.setEmail(request.email());

    receptionist.setPhoneNumber(request.phoneNumber());

    receptionist.setRole(Role.RECEPTIONIST);

    receptionist.setEnabled(true);

    Receptionist saved = userRepository.save(receptionist);

    return toResponse(saved);
  }


  public UserAdminResponse updateEnabled(Long userId, boolean enabled) {

    User user = userRepository
            .findById(userId)
            .orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: " + userId)
            );

    user.setEnabled(enabled);

    User saved = userRepository.save(user);

    return toResponse(saved);
  }


  private UserAdminResponse toResponse(User user) {

    return new UserAdminResponse(
        user.getUserId(),
        user.getUsername(),
        user.getEmail(),
        user.getPhoneNumber(),
        user.getRole(),
        user.isEnabled()
    );
  }
}
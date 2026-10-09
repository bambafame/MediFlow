package com.mediflow.service;

import com.mediflow.entity.User;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User save(User user) {

    if (userRepository.existsByUsername(user.getUsername())) {
      throw new IllegalArgumentException("Username already exists");
    }

    if (userRepository.existsByEmail(user.getEmail())) {
      throw new IllegalArgumentException("Email already exists");
    }

    return userRepository.save(user);
  }

  @Transactional(readOnly = true)
  public User getById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() ->
            new ResourceNotFoundException(
                "User not found with id: " + id
            ));
  }

  @Transactional(readOnly = true)
  public List<User> getAll() {
    return userRepository.findAll();
  }

  @Transactional(readOnly = true)
  public User getByUsername(String username) {
    return userRepository.findByUsername(username)
        .orElseThrow(() ->
            new ResourceNotFoundException(
                "User not found with username: " + username
            ));
  }

  public void delete(Long id) {
    User user = getById(id);
    userRepository.delete(user);
  }
}
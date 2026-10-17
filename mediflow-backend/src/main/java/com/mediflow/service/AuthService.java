package com.mediflow.service;

import com.mediflow.dto.LoginRequest;
import com.mediflow.dto.LoginResponse;

import com.mediflow.entity.User;

import com.mediflow.repository.UserRepository;

import com.mediflow.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.stereotype.Service;


@Service
public class AuthService {

  private final AuthenticationManager authenticationManager;

  private final UserRepository userRepository;

  private final JwtService jwtService;


  public AuthService(
      AuthenticationManager authenticationManager,
      UserRepository userRepository,
      JwtService jwtService
  ) {

    this.authenticationManager = authenticationManager;

    this.userRepository = userRepository;

    this.jwtService = jwtService;
  }


  public LoginResponse login(LoginRequest request) {

    Authentication authentication = authenticationManager
        .authenticate(
            new UsernamePasswordAuthenticationToken(
                request.username(),
                request.password()
            )
        );


    UserDetails userDetails = (UserDetails) authentication.getPrincipal();


    User user = userRepository.findByUsername(request.username()).orElseThrow();


    String token = jwtService.generateToken(userDetails);

    return new LoginResponse(
        token,
        "Bearer",
        jwtService.getExpirationMs(),
        user.getUserId(),
        user.getUsername(),
        user.getRole().name()
    );
  }
}
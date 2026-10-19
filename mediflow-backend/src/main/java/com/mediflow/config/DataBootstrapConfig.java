package com.mediflow.config;

import com.mediflow.entity.Administrator;
import com.mediflow.entity.Receptionist;
import com.mediflow.entity.Role;
import com.mediflow.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataBootstrapConfig {

  @Bean
  CommandLineRunner bootstrapUsers(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,

      @Value("${app.bootstrap.admin.username:admin}")
      String adminUsername,

      @Value("${app.bootstrap.admin.password:Admin@12345}")
      String adminPassword,

      @Value("${app.bootstrap.admin.email:admin@mediflow.com}")
      String adminEmail,

      @Value("${app.bootstrap.receptionist.username:receptionist}")
      String receptionistUsername,

      @Value("${app.bootstrap.receptionist.password:Reception@12345}")
      String receptionistPassword,

      @Value("${app.bootstrap.receptionist.email:receptionist@mediflow.com}")
      String receptionistEmail
  ) {

    return args -> {

      createAdminIfMissing(
          userRepository,
          passwordEncoder,
          adminUsername,
          adminPassword,
          adminEmail
      );

      createReceptionistIfMissing(
          userRepository,
          passwordEncoder,
          receptionistUsername,
          receptionistPassword,
          receptionistEmail
      );
    };
  }


  private void createAdminIfMissing(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      String username,
      String password,
      String email
  ) {

    if (userRepository.findByUsername(username).isPresent()) {
      return;
    }

    Administrator admin = new Administrator();

    admin.setUsername(username);

    admin.setPasswordHash(passwordEncoder.encode(password));

    admin.setEmail(email);

    admin.setRole(Role.ADMIN);

    admin.setEnabled(true);

    userRepository.save(admin);

    System.out.println("Bootstrap admin created: " + username);
  }


  private void createReceptionistIfMissing(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      String username,
      String password,
      String email
  ) {

    if (userRepository.findByUsername(username).isPresent()) {
      return;
    }

    Receptionist receptionist = new Receptionist();

    receptionist.setUsername(username);

    receptionist.setPasswordHash(passwordEncoder.encode(password));

    receptionist.setEmail(email);

    receptionist.setRole(Role.RECEPTIONIST);

    receptionist.setEnabled(true);

    userRepository.save(receptionist);

    System.out.println("Bootstrap receptionist created: " + username);
  }
}
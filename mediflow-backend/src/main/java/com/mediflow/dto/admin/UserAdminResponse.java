package com.mediflow.dto.admin;

import com.mediflow.entity.Role;

public record UserAdminResponse(
    Long userId,
    String username,
    String email,
    String phoneNumber,
    Role role,
    boolean enabled
) {
}
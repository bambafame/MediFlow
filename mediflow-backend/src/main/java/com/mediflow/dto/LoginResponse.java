package com.mediflow.dto;

public record LoginResponse(

    String token,

    String tokenType,

    long expiresIn,

    Long userId,

    String username,

    String role

) {
}
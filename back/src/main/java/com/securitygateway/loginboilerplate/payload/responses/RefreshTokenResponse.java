package com.securitygateway.loginboilerplate.payload.responses;

import com.securitygateway.loginboilerplate.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshTokenResponse {
    private String accessToken;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
}

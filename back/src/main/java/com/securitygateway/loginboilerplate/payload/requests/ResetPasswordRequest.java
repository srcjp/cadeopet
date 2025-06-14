package com.securitygateway.loginboilerplate.payload.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordRequest {
    @Email(message = "Enter a valid email")
    @NotBlank(message = "Email can't be blank")
    private String email;
    @NotBlank(message = "Password can't be blank")
    @Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", message = "Password must contain at least 8 characters, one uppercase, one lowercase and one number")
    private String password;
    @NotBlank(message = "Confirm Password and password do not match")
    private String confirmPassword;
}

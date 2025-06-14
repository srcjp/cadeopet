package com.securitygateway.loginboilerplate.payload.requests;

import com.securitygateway.loginboilerplate.model.Gender;
import com.securitygateway.loginboilerplate.model.Role;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    @NotBlank(message = "First name can't be blank")
    private String firstName;
    @NotBlank(message = "Last name can't be blank")
    private String lastName;
    @NotBlank(message = "Email can't be blank")
    @Email(message = "Invalid email entered")
    private String email;
    @NotBlank(message = "Password can't be blank")
    @Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", message = "Password must contain at least 8 characters, one uppercase, one lowercase and one number")
    private String password;
    @NotNull(message ="Please choose your gender")
    private Gender gender;
    private String phoneNumber;
    private Role role;
}

package com.securitygateway.loginboilerplate.payload.responses;

import com.securitygateway.loginboilerplate.model.Gender;
import com.securitygateway.loginboilerplate.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Gender gender;
    private Role role;
    private String profilePicture;
    private Boolean isOfficiallyEnabled;
}

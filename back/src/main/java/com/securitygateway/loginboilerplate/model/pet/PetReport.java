package com.securitygateway.loginboilerplate.model.pet;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.securitygateway.loginboilerplate.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "pet_reports")
public class PetReport {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pet_report_seq")
    @SequenceGenerator(name = "pet_report_seq", sequenceName = "pet_report_sequence", allocationSize = 1)
    private Long id;

    private String status; // LOST or FOUND
    private String breed;
    private String size;
    private String color;
    private String observation;
    private String phone;
    private Double latitude;
    private Double longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "pet_report_images", joinColumns = @JoinColumn(name = "pet_report_id"))
    @Column(name = "image_path")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Column(nullable = false, columnDefinition = "boolean default false")
    @Builder.Default
    private Boolean deleted = false;
}


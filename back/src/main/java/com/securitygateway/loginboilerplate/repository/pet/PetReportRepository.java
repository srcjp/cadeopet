package com.securitygateway.loginboilerplate.repository.pet;

import com.securitygateway.loginboilerplate.model.pet.PetReport;
import com.securitygateway.loginboilerplate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetReportRepository extends JpaRepository<PetReport, Long> {
    List<PetReport> findByUser(User user);

    List<PetReport> findByDeletedFalse();

    List<PetReport> findByUserAndDeletedFalse(User user);
}

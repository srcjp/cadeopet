package com.securitygateway.loginboilerplate.controller.pet;

import com.securitygateway.loginboilerplate.model.pet.PetReport;
import com.securitygateway.loginboilerplate.model.User;
import com.securitygateway.loginboilerplate.security.CurrentUser;
import com.securitygateway.loginboilerplate.service.pet.PetReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/pets")
@RequiredArgsConstructor
public class PetReportController {

    private final PetReportService service;

    @InitBinder
    public void initBinder(WebDataBinder binder){
        binder.setDisallowedFields("images");
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PetReport create(@ModelAttribute PetReport report,
                            @RequestPart(value = "images", required = false) MultipartFile[] images,
                            @CurrentUser User user) throws IOException {
        return service.saveReport(report, images, user);
    }

    @PutMapping(value="/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PetReport update(@PathVariable Long id,
                            @ModelAttribute PetReport report,
                            @RequestPart(value="images", required = false) MultipartFile[] images,
                            @CurrentUser User user) throws IOException {
        return service.updateReport(id, report, images, user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @CurrentUser User user){
        service.softDelete(id, user);
    }

    @GetMapping("/{id}")
    public PetReport get(@PathVariable Long id){
        return service.findById(id);
    }

    @GetMapping
    public List<PetReport> list(){
        return service.listAll();
    }

    @GetMapping("/my")
    public List<PetReport> myReports(@CurrentUser User user){
        return service.listByUser(user);
    }
}

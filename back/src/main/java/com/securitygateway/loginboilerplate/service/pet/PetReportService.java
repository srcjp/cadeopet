package com.securitygateway.loginboilerplate.service.pet;

import com.securitygateway.loginboilerplate.model.pet.PetReport;
import com.securitygateway.loginboilerplate.repository.pet.PetReportRepository;
import com.securitygateway.loginboilerplate.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PetReportService {
    private final PetReportRepository repository;
    private final ImageResizeService imageService;

    public PetReport saveReport(PetReport report, MultipartFile[] files, User user) throws IOException {
        List<String> paths = new ArrayList<>();
        if(files != null){
            int count = Math.min(files.length,3);
            for(int i=0;i<count;i++){
                paths.add(imageService.resizeAndSave(files[i]));
            }
        }
        report.setImages(paths);
        report.setUser(user);
        report.setDeleted(false);
        return repository.save(report);
    }

    @Transactional(readOnly = true)
    public List<PetReport> listAll(){
        return repository.findByDeletedFalse();
    }

    @Transactional(readOnly = true)
    public List<PetReport> listByUser(User user){
        return repository.findByUser(user);
    }

    @Transactional(readOnly = true)
    public PetReport findById(Long id){
        return repository.findById(id).orElseThrow();
    }

    public PetReport updateReport(Long id, PetReport data, MultipartFile[] files, User user) throws IOException {
        PetReport existing = repository.findById(id).orElseThrow();
        if(!existing.getUser().getId().equals(user.getId())) return existing;

        existing.setStatus(data.getStatus());
        existing.setBreed(data.getBreed());
        existing.setSize(data.getSize());
        existing.setColor(data.getColor());
        existing.setObservation(data.getObservation());
        existing.setPhone(data.getPhone());
        existing.setName(data.getName());
        existing.setDate(data.getDate());
        existing.setLatitude(data.getLatitude());
        existing.setLongitude(data.getLongitude());

        if(files != null && files.length > 0){
            List<String> paths = new ArrayList<>();
            int count = Math.min(files.length,3);
            for(int i=0;i<count;i++){
                paths.add(imageService.resizeAndSave(files[i]));
            }
            existing.setImages(paths);
        }

        return repository.save(existing);
    }

    public void softDelete(Long id, User user){
        PetReport existing = repository.findById(id).orElseThrow();
        if(!existing.getUser().getId().equals(user.getId())) return;
        existing.setDeleted(true);
        repository.save(existing);
    }
}

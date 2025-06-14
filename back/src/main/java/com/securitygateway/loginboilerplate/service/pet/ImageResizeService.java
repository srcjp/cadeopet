package com.securitygateway.loginboilerplate.service.pet;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageResizeService {

    private final Path storagePath = Paths.get("uploads");

    public ImageResizeService() throws IOException {
        Files.createDirectories(storagePath);
    }

    public String resizeAndSave(MultipartFile file) throws IOException {
        String extension = getExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + "." + extension;
        Path filePath = storagePath.resolve(fileName);
        File dest = filePath.toFile();
        Thumbnails.of(file.getInputStream())
                .size(800, 800)
                .outputFormat(extension)
                .outputQuality(0.8)
                .toFile(dest);
        return filePath.toString();
    }

    private String getExtension(String name){
        if(name == null) return "jpg";
        int idx = name.lastIndexOf('.');
        return idx > 0 ? name.substring(idx+1) : "jpg";
    }
}

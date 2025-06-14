package com.securitygateway.loginboilerplate.controller.file;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@RestController
public class FileController {

    @GetMapping("/file/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename){
        File file = new File("uploads" + File.separator + filename);
        if(!file.exists()){
            return ResponseEntity.notFound().build();
        }
        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}


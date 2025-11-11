package dev.chinhcd.backend.services.longnt;

import org.springframework.web.multipart.MultipartFile;

public interface ICloudinaryService {
    String uploadImage(MultipartFile file);
}

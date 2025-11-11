package dev.chinhcd.backend.services.impl.longnt;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import dev.chinhcd.backend.services.longnt.ICloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService implements ICloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            Map<String, Object> uploadOptions = ObjectUtils.asMap(
                    "secure", true,
                    "sign_url", true,
                    "expires_at", System.currentTimeMillis() / 1000 + 3600
            );

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);

            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Upload image failed: " + e.getMessage(), e);
        }
    }
}

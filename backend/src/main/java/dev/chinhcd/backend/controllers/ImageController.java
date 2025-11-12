//package dev.chinhcd.backend.controllers;
//
//import dev.chinhcd.backend.services.longnt.ICloudinaryService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/images")
//@RequiredArgsConstructor
//public class ImageController {
//
//    private final ICloudinaryService cloudinaryService;
//
//    @PostMapping("/upload")
//    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
//        String imageUrl = cloudinaryService.uploadImage(file);
//        Map<String, String> response = new HashMap<>();
//        response.put("imageUrl", imageUrl);
//        return ResponseEntity.ok(response);
//    }
//}

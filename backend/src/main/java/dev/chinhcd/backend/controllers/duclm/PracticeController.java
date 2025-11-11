package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.dtos.response.duclm.PracticeDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.QuestionDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.SmallPracticeDetailResponse;
import dev.chinhcd.backend.models.duclm.*;
import dev.chinhcd.backend.repository.duclm.*;
import dev.chinhcd.backend.services.duclm.IPracticeService;
import dev.chinhcd.backend.services.duclm.impl.UserPracticeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Date;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@RestController
@RequestMapping("/practice")
@RequiredArgsConstructor
public class PracticeController {

    private final IPracticeService practiceService;
    private final IPracticeRepository practiceRepository;
    private final ISmallPracticeQuestionRepository smallPracticeQuestionRepository;
    private final ISmallPracticeRepository smallPracticeRepository;
    private final IQuestionRepository questionRepository;
    private final IAnswerRepository answerRepository;
    private static final String BASE_FOLDER_PATH = "C:\\Users\\Chinh\\OneDrive\\Desktop\\practices\\";
    private final UserPracticeService userPracticeService;

    @GetMapping("/max-level")
    public ResponseEntity<Integer> getMaxLevel() {
        return ResponseEntity.ok(practiceService.getMaxLevel());
    }
    @GetMapping("/get-all")
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "7") int pageSize) {

        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Practice> practicePage = practiceRepository.findAll(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("practices", practicePage.getContent());
        response.put("totalPages", practicePage.getTotalPages());

        return ResponseEntity.ok(response);
    }


    private ResponseEntity<String> validateExcelFile(MultipartFile file) {
        Workbook workbook = null;
        try {
            workbook = WorkbookFactory.create(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0);

            if (sheet.getPhysicalNumberOfRows() <= 1) {
                return ResponseEntity.badRequest().body("File Excel không có dữ liệu hợp lệ");
            }

            // Duyệt từng dòng để kiểm tra định dạng dữ liệu
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                // Kiểm tra cột ngày (nếu có)
                Cell dateCell = row.getCell(0);
                if (dateCell != null && dateCell.getCellType() != CellType.NUMERIC) {
                    return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ: Cột ngày phải là định dạng ngày tháng ở hàng " + (i + 1));
                }

                // Kiểm tra cột câu hỏi không được rỗng
                if (getStringCellValue(row.getCell(2)).isEmpty()) {
                    return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ: Câu hỏi không được để trống ở hàng " + (i + 1));
                }

                // Kiểm tra các đáp án
                for (int j = 3; j <= 6; j++) {
                    if (getStringCellValue(row.getCell(j)).isEmpty()) {
                        return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ: Đáp án không được để trống ở hàng " + (i + 1));
                    }
                }

                // Kiểm tra câu trả lời đúng
                if (getStringCellValue(row.getCell(7)).isEmpty()) {
                    return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ: Đáp án đúng không được để trống ở hàng " + (i + 1));
                }
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi đọc file Excel: " + e.getMessage());
        } finally {
            if (workbook != null) {
                try {
                    workbook.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return ResponseEntity.ok("File Excel hợp lệ");
    }

    @PostMapping("/upload-practice")
    @Transactional
    public ResponseEntity<String> uploadPractice(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "audioZip", required = false) MultipartFile audioZip,
            @RequestParam("practiceDate") String practiceDate,
            @RequestParam("grade") int grade,
            @RequestParam("practiceLevel") int practiceLevel,
            @RequestParam("status") String status) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Tệp rỗng");
        }

        // Kiểm tra định dạng ngày
        Date practiceDateValue;
        try {
            practiceDateValue = Date.valueOf(practiceDate);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid date format");
        }

        // Kiểm tra xem Practice đã tồn tại chưa
        if (practiceRepository.findByPracticeLevelAndGradeAndStatus(practiceLevel, grade, "on").isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Dữ liệu đã tồn tại trong hệ thống");
        }

        // Kiểm tra file Excel
        ResponseEntity<String> validationResponse = validateExcelFile(file);
        if (!validationResponse.getStatusCode().equals(HttpStatus.OK)) {
            return validationResponse;
        }

        try {
            // Nếu file hợp lệ, tạo thực thể Practice
            Practice practice = new Practice();
            practice.setPracticeDate(practiceDateValue);
            practice.setGrade(grade);
            practice.setPracticeLevel(practiceLevel);
            practice.setStatus(status);
            practiceRepository.save(practice); // Chỉ lưu khi file hợp lệ

            // Tạo thư mục lưu trữ
            String folderPath = BASE_FOLDER_PATH + practice.getPracticeId();

            Path targetDir = Paths.get(folderPath);
            Files.createDirectories(targetDir);

            // Lưu file Excel
            Path excelFilePath = targetDir.resolve("practice_" + practice.getPracticeId() + ".xlsx");
            Files.copy(file.getInputStream(), excelFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Nếu có file ZIP, lưu và giải nén
            if (audioZip != null && !audioZip.isEmpty()) {
                Path zipFilePath = targetDir.resolve("audio_" + practice.getPracticeId() + ".zip");
                Files.copy(audioZip.getInputStream(), zipFilePath, StandardCopyOption.REPLACE_EXISTING);
                unzipFile(zipFilePath.toString(), folderPath);
            }

            // Xử lý file Excel (đọc từ workbook đã mở trước đó)
            try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);
                Map<String, SmallPractice> smallPracticeMap = new HashMap<>();

                for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) continue;

                    String testName = getStringCellValue(row.getCell(1));
                    SmallPractice smallPractice = smallPracticeMap.computeIfAbsent(testName, k -> {
                        SmallPractice sp = new SmallPractice();
                        sp.setTestName(k);
                        sp.setTestDate(row.getCell(0) != null ? row.getCell(0).getDateCellValue() : null);
                        sp.setPractice(practice);
                        return smallPracticeRepository.save(sp);
                    });

                    Question question = new Question();
                    question.setQuestionText(getStringCellValue(row.getCell(2)));
                    question.setChoice1(getStringCellValue(row.getCell(3)));
                    question.setChoice2(getStringCellValue(row.getCell(4)));
                    question.setChoice3(getStringCellValue(row.getCell(5)));
                    question.setChoice4(getStringCellValue(row.getCell(6)));

                    String audioFileName = getStringCellValue(row.getCell(8));
                    if (audioFileName != null && !audioFileName.isEmpty()) {
                        Path audioFilePath = Paths.get(folderPath, audioFileName);
                        question.setAudioFile(Files.exists(audioFilePath) ? Files.readAllBytes(audioFilePath) : null);
                    }

                    questionRepository.save(question);

                    SmallPracticeQuestion spq = new SmallPracticeQuestion();
                    spq.setSmallPractice(smallPractice);
                    spq.setQuestion(question);
                    smallPracticeQuestionRepository.save(spq);

                    Answer answer = new Answer();
                    answer.setCorrectAnswer(getStringCellValue(row.getCell(7)));
                    answer.setQuestion(question);
                    answerRepository.save(answer);
                }
            }

            return ResponseEntity.ok("Dữ liệu đã được lưu");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lưu dữ liệu: " + e.getMessage());
        }
    }


    private String getStringCellValue(Cell cell) {
        if (cell == null) {
            return ""; // Trả về chuỗi rỗng nếu ô là null
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return ""; // Trả về chuỗi rỗng cho các loại ô khác
        }
    }

    @DeleteMapping("/delete/{practiceId}")
    @Transactional
    public ResponseEntity<String> deletePractice(@PathVariable Long practiceId) {
        try {
            Optional<Practice> practiceOptional = practiceRepository.findById(practiceId);
            List<UserPractice> userPractices = userPracticeService.getByPractice(practiceOptional.get());

            if (practiceOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bài thực hành!");
            }
            if(userPractices.isEmpty()){
            Practice practice = practiceOptional.get();

            List<Question> questionsToDelete = questionRepository.findByPracticeId(practiceId);
            if (!questionsToDelete.isEmpty()) {
                questionRepository.deleteAll(questionsToDelete);
            }

            List<SmallPractice> smallPractices = smallPracticeRepository.findByPractice(practice);
            smallPracticeRepository.deleteAll(smallPractices);

            practiceRepository.delete(practice);

            return ResponseEntity.ok("Xóa thành công bài thực hành và tất cả dữ liệu liên quan!");
            }
            else{
                Practice practice = practiceOptional.get();
                practice.setStatus("off");
                practiceRepository.save(practice);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Đã tắt bài thực hành!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa bài thực hành: " + e.getMessage());
        }
    }

    @PutMapping("/update/{practiceId}")
    @Transactional
    public ResponseEntity<String> updatePractice(
            @PathVariable Long practiceId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "audioZip", required = false) MultipartFile audioZip,
            @RequestParam("practiceDate") String practiceDate,
            @RequestParam("grade") int grade,
            @RequestParam("practiceLevel") int practiceLevel,
            @RequestParam("status") String status) {

        try {
            Optional<Practice> practiceOptional = practiceRepository.findById(practiceId);
            if (practiceOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bài thực hành!");
            }
                ResponseEntity<String> validationResponse = validateExcelFile(file);
                if (!validationResponse.getStatusCode().equals(HttpStatus.OK)) {
                    return validationResponse;
                }

                Practice practice = practiceOptional.get();
                practice.setPracticeDate(Date.valueOf(practiceDate));
                practice.setGrade(grade);
                practice.setPracticeLevel(practiceLevel);
                practice.setStatus(status);
                practiceRepository.save(practice);

                String folderPath = BASE_FOLDER_PATH + practice.getPracticeId();

                Path targetDir = Paths.get(folderPath);
                if (!Files.exists(targetDir)) {
                    Files.createDirectories(targetDir);
                }

                // Lưu file Excel
                Path excelFilePath = targetDir.resolve("exam_" + practice.getPracticeId() + ".xlsx");
                Files.copy(file.getInputStream(), excelFilePath, StandardCopyOption.REPLACE_EXISTING);

                // Nếu có file ZIP, lưu và giải nén
                if (audioZip != null && !audioZip.isEmpty()) {
                    Path zipFilePath = targetDir.resolve("audio_" + practice.getPracticeId() + ".zip");
                    Files.copy(audioZip.getInputStream(), zipFilePath, StandardCopyOption.REPLACE_EXISTING);
                    unzipFile(zipFilePath.toString(), folderPath);
                }

                // Xóa câu hỏi cũ nhưng giữ lại SmallPractice
                List<Question> questionsToDelete = questionRepository.findByPracticeId(practiceId);
                questionRepository.deleteAll(questionsToDelete);

                // Tạo danh sách SmallPractice có sẵn
                Map<String, SmallPractice> smallPracticeMap = new HashMap<>();
                List<SmallPractice> existingSmallPractices = smallPracticeRepository.findByPractice(practice);
                for (SmallPractice sp : existingSmallPractices) {
                    smallPracticeMap.put(sp.getTestName(), sp);
                }

                // Xử lý file Excel
                try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
                    Sheet sheet = workbook.getSheetAt(0);

                    for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                        Row row = sheet.getRow(i);
                        if (row == null) continue;

                        String testName = getStringCellValue(row.getCell(1));
                        SmallPractice smallPractice = smallPracticeMap.get(testName);

                        if (smallPractice == null) { // Nếu chưa có, tạo mới
                            smallPractice = new SmallPractice();
                            smallPractice.setTestName(testName);
                            smallPractice.setTestDate(row.getCell(0).getDateCellValue());
                            smallPractice.setPractice(practice);
                            smallPracticeRepository.save(smallPractice);
                            smallPracticeMap.put(testName, smallPractice);
                        }

                        // Tạo câu hỏi mới
                        Question question = new Question();
                        question.setQuestionText(getStringCellValue(row.getCell(2)));
                        question.setChoice1(getStringCellValue(row.getCell(3)));
                        question.setChoice2(getStringCellValue(row.getCell(4)));
                        question.setChoice3(getStringCellValue(row.getCell(5)));
                        question.setChoice4(getStringCellValue(row.getCell(6)));
                        String audioFileName = getStringCellValue(row.getCell(8));
                        if (audioFileName != null && !audioFileName.isEmpty()) {
                            Path audioFilePath = Paths.get(folderPath, audioFileName);
                            question.setAudioFile(Files.exists(audioFilePath) ? Files.readAllBytes(audioFilePath) : null);
                        }
                        questionRepository.save(question);

                        // Liên kết Question với SmallPractice
                        SmallPracticeQuestion smallPracticeQuestion = new SmallPracticeQuestion();
                        smallPracticeQuestion.setSmallPractice(smallPractice);
                        smallPracticeQuestion.setQuestion(question);
                        smallPracticeQuestionRepository.save(smallPracticeQuestion);

                        // Tạo Answer mới
                        Answer answer = new Answer();
                        answer.setCorrectAnswer(getStringCellValue(row.getCell(7)));
                        answer.setQuestion(question);
                        answerRepository.save(answer);
                    }
                }

                return ResponseEntity.ok("Cập nhật thành công!");



        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật bài thực hành: " + e.getMessage());
        }
    }


    @GetMapping("/get-detail/{id}")
    public ResponseEntity<?> getPracticeDetail(@PathVariable Long id) {
        Practice practice = practiceRepository.findById(id).orElse(null);
        if (practice == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Practice không tồn tại");
        }

        List<SmallPractice> smallPractices = smallPracticeRepository.findByPractice(practice);
        List<SmallPracticeDetailResponse> practiceDetails = new ArrayList<>();

        for (SmallPractice smallPractice : smallPractices) {
            List<SmallPracticeQuestion> smallPracticeQuestions = smallPracticeQuestionRepository.findBySmallPractice(smallPractice);
            List<QuestionDetailResponse> questionDetails = new ArrayList<>();

            for (SmallPracticeQuestion smallPracticeQuestion : smallPracticeQuestions) {
                Question question = smallPracticeQuestion.getQuestion();
                if (question != null) {
                    Answer answer = answerRepository.findByQuestion(question);
                    QuestionDetailResponse questionDetail = new QuestionDetailResponse(question, answer);
                    questionDetails.add(questionDetail);
                }
            }

            SmallPracticeDetailResponse practiceDetail = new SmallPracticeDetailResponse(smallPractice.getTestName(), questionDetails);
            practiceDetails.add(practiceDetail);
        }

        PracticeDetailResponse response = new PracticeDetailResponse(practice, practiceDetails);
        return ResponseEntity.ok(response);
    }

    private void unzipFile(String zipFilePath, String destDir) throws IOException {
        File dir = new File(destDir);
        if (!dir.exists()) dir.mkdirs();

        try (ZipInputStream zipIn = new ZipInputStream(new FileInputStream(zipFilePath))) {
            ZipEntry entry;
            while ((entry = zipIn.getNextEntry()) != null) {
                Path filePath = Paths.get(destDir, entry.getName());
                if (!entry.isDirectory()) {
                    Files.copy(zipIn, filePath, StandardCopyOption.REPLACE_EXISTING);
                } else {
                    Files.createDirectories(filePath);
                }
                zipIn.closeEntry();
            }
        }
    }

    @GetMapping("/download-excel/{practiceId}")
    public ResponseEntity<Resource> downloadExcel(@PathVariable Long practiceId) {
        try {
            // Lấy bài thực hành từ database để xác định đường dẫn
            Practice practice = practiceRepository.findById(practiceId).orElse(null);
            if (practice == null) {
                return ResponseEntity.notFound().build();
            }

            // Đường dẫn đến file Excel
            String folderPath = BASE_FOLDER_PATH + practiceId;

            Path filePath = Paths.get(folderPath, "practice_" + practiceId + ".xlsx");

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // API để tải file audio cho bài thực hành
    @GetMapping("/download-audio/{practiceId}")
    public ResponseEntity<Resource> downloadAudio(@PathVariable Long practiceId) {
        try {
            // Lấy bài thực hành từ database để xác định đường dẫn
            Practice practice = practiceRepository.findById(practiceId).orElse(null);
            if (practice == null) {
                return ResponseEntity.notFound().build();
            }

            // Đường dẫn đến file audio
            String folderPath = BASE_FOLDER_PATH + practiceId; // Đường dẫn thư mục

            Path filePath = Paths.get(folderPath, "audio_" + practiceId + ".zip"); // Hoặc .rar

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

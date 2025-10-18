package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.dtos.response.duclm.PracticeDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.QuestionDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.SmallPracticeDetailResponse;
import dev.chinhcd.backend.models.duclm.*;
import dev.chinhcd.backend.repository.duclm.*;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;

// Các import khác
import dev.chinhcd.backend.services.duclm.IPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.util.*;
import java.util.stream.Collectors;

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
    private final IUserPracticeRepository userPracticeRepository;
    private final ITestResultRepository testResultRepository;

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

    @PostMapping("/upload-practice")
    public ResponseEntity<String> uploadPractice(
            @RequestParam("file") MultipartFile file,
            @RequestParam("practiceDate") String practiceDate,
            @RequestParam("grade") int grade,
            @RequestParam("practiceLevel") int practiceLevel) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Tệp rỗng");
        }

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên

            // Tạo và lưu Practice
            Practice practice = new Practice();
            practice.setPracticeDate(Date.valueOf(practiceDate));
            practice.setGrade(grade);
            practice.setPracticeLevel(practiceLevel);
            if(practiceRepository.findByPracticeLevelAndGrade(practiceLevel, grade).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Dữ liệu đã tồn tại trong hệ thống");
            }
            practiceRepository.save(practice); // Lưu Practice để lấy ID

            // Duyệt từng hàng để tạo SmallPractice, Question và Answer
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) { // Bắt đầu từ hàng thứ hai
                Row row = sheet.getRow(i);
                if (row == null) continue;

                // Tạo SmallPractice từ Test Name và Test Date
                SmallPractice smallPractice = new SmallPractice();
                smallPractice.setTestName(getStringCellValue(row.getCell(1))); // Test Name
                smallPractice.setTestDate(row.getCell(0).getDateCellValue()); // Test Date
                smallPractice.setPractice(practice); // Liên kết với Practice
                smallPracticeRepository.save(smallPractice); // Lưu SmallPractice để lấy ID

                // Tạo Question từ các ô
                Question question = new Question();
                question.setQuestionText(getStringCellValue(row.getCell(2))); // Câu hỏi
                question.setChoice1(getStringCellValue(row.getCell(3))); // Choice1
                question.setChoice2(getStringCellValue(row.getCell(4))); // Choice2
                question.setChoice3(getStringCellValue(row.getCell(5))); // Choice3
                question.setChoice4(getStringCellValue(row.getCell(6))); // Choice4
                questionRepository.save(question); // Lưu Question để lấy ID

                // Tạo SmallPracticeQuestion để liên kết SmallPractice và Question
                SmallPracticeQuestion smallPracticeQuestion = new SmallPracticeQuestion();
                smallPracticeQuestion.setSmallPractice(smallPractice); // Liên kết với SmallPractice
                smallPracticeQuestion.setQuestion(question); // Liên kết với Question
                smallPracticeQuestionRepository.save(smallPracticeQuestion); // Lưu SmallPracticeQuestion

                // Tạo Answer cho câu hỏi
                Answer answer = new Answer();
                answer.setCorrectAnswer(getStringCellValue(row.getCell(7))); // Lấy câu trả lời đúng từ ô
                answer.setQuestion(question); // Liên kết với Question
                answerRepository.save(answer); // Lưu Answer
            }

            return ResponseEntity.ok("Dữ liệu đã được lưu");
        } catch (Exception e) {
            e.printStackTrace(); // In ra chi tiết lỗi
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xử lý tệp: " + e.getMessage());
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
            if (practiceOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bài thực hành!");
            }

            Practice practice = practiceOptional.get();

            List<Question> questionsToDelete = questionRepository.findByPracticeId(practiceId);
            if (!questionsToDelete.isEmpty()) {
                questionRepository.deleteAll(questionsToDelete);
            }

            List<SmallPractice> smallPractices = smallPracticeRepository.findByPractice(practice);
            smallPracticeRepository.deleteAll(smallPractices);

            practiceRepository.delete(practice);

            return ResponseEntity.ok("Xóa thành công bài thực hành và tất cả dữ liệu liên quan!");
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
            @RequestParam("practiceDate") String practiceDate,
            @RequestParam("grade") int grade,
            @RequestParam("practiceLevel") int practiceLevel) {

        try {
            Optional<Practice> practiceOptional = practiceRepository.findById(practiceId);
            if (practiceOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bài thực hành!");
            }

            Practice practice = practiceOptional.get();
            practice.setPracticeDate(Date.valueOf(practiceDate));
            practice.setGrade(grade);
            practice.setPracticeLevel(practiceLevel);
            practiceRepository.save(practice); // Cập nhật Practice

            List<Question> questionsToDelete = questionRepository.findByPracticeId(practiceId);
            if (!questionsToDelete.isEmpty()) {
                questionRepository.deleteAll(questionsToDelete);
            }
            List<SmallPractice> smallPractices = smallPracticeRepository.findByPractice(practice);
            smallPracticeRepository.deleteAll(smallPractices);

            // Đọc file Excel
            try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);

                for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) continue;

                    // Tạo SmallPractice mới
                    SmallPractice smallPractice = new SmallPractice();
                    smallPractice.setTestName(getStringCellValue(row.getCell(1)));
                    smallPractice.setTestDate(row.getCell(0).getDateCellValue());
                    smallPractice.setPractice(practice);
                    smallPracticeRepository.save(smallPractice);

                    // Tạo Question mới
                    Question question = new Question();
                    question.setQuestionText(getStringCellValue(row.getCell(2)));
                    question.setChoice1(getStringCellValue(row.getCell(3)));
                    question.setChoice2(getStringCellValue(row.getCell(4)));
                    question.setChoice3(getStringCellValue(row.getCell(5)));
                    question.setChoice4(getStringCellValue(row.getCell(6)));
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



}
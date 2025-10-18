package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.dtos.response.duclm.ExamDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.QuestionDetailResponse;
import dev.chinhcd.backend.models.duclm.*;
import dev.chinhcd.backend.repository.duclm.*;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/exam")
@RequiredArgsConstructor
public class ExamController {

    private final IExamRepository examRepository;
    private final IQuestionRepository questionRepository;
    private final IAnswerRepository answerRepository;
    private final IExamQuestionRepository examQuestionRepository;

    @GetMapping("/next")
    public ResponseEntity<?> getNextExam() {
        Exam nextExam = examRepository.findNextExam();
        if (nextExam == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No upcoming exams");
        }
        return ResponseEntity.ok(nextExam);
    }
    @GetMapping("/get-all")
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "7") int pageSize) {

        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Exam> examPage = examRepository.findAll(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("exams", examPage.getContent());
        response.put("totalPages", examPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-exam")
    public ResponseEntity<String> uploadExam(
            @RequestParam("file") MultipartFile file,
            @RequestParam("examName") String examName,
            @RequestParam("examStart") String examStart,
            @RequestParam("examEnd") String examEnd,
            @RequestParam("grade") int grade,
            @RequestParam("status") String status) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Tệp rỗng");
        }

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên

            // Kiểm tra xem kỳ thi đã tồn tại chưa
            if (examRepository.findByExamNameAndGrade(examName, grade).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Kỳ thi đã tồn tại trong hệ thống");
            }

            // Tạo và lưu Exam
            Exam exam = new Exam();
            exam.setExamName(examName);
            exam.setExamStart(LocalDateTime.parse(examStart));
            exam.setExamEnd(LocalDateTime.parse(examEnd));
            exam.setGrade(grade);
            exam.setStatus(status);
            examRepository.save(exam);

            // Duyệt file Excel để tạo Questions và Answers
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) { // Bắt đầu từ hàng thứ hai
                Row row = sheet.getRow(i);
                if (row == null) continue;

                // Tạo Question
                Question question = new Question();
                question.setQuestionText(getStringCellValue(row.getCell(0))); // Câu hỏi
                question.setChoice1(getStringCellValue(row.getCell(1))); // Lựa chọn 1
                question.setChoice2(getStringCellValue(row.getCell(2))); // Lựa chọn 2
                question.setChoice3(getStringCellValue(row.getCell(3))); // Lựa chọn 3
                question.setChoice4(getStringCellValue(row.getCell(4))); // Lựa chọn 4
                questionRepository.save(question);

                // Liên kết với Exam
                ExamQuestion examQuestion = new ExamQuestion();
                examQuestion.setExam(exam);
                examQuestion.setQuestion(question);
                examQuestionRepository.save(examQuestion);

                // Tạo Answer
                Answer answer = new Answer();
                answer.setCorrectAnswer(getStringCellValue(row.getCell(5))); // Đáp án đúng
                answer.setQuestion(question);
                answerRepository.save(answer);
            }

            return ResponseEntity.ok("Dữ liệu kỳ thi đã được lưu");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xử lý tệp: " + e.getMessage());
        }
    }

    @PutMapping("/update/{examId}")
    @Transactional
    public ResponseEntity<String> updateExam(
            @PathVariable Long examId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("examName") String examName,
            @RequestParam("examStart") String examStart,
            @RequestParam("examEnd") String examEnd,
            @RequestParam("grade") int grade,
            @RequestParam("status") String status) {

        try {
            Optional<Exam> examOptional = examRepository.findById(Math.toIntExact(examId));
            if (examOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy kỳ thi!");
            }

            Exam exam = examOptional.get();
            exam.setExamName(examName);
            exam.setExamStart(LocalDateTime.parse(examStart));
            exam.setExamEnd(LocalDateTime.parse(examEnd));
            exam.setGrade(grade);
            exam.setStatus(status);
            examRepository.save(exam);

            // Xóa dữ liệu cũ
            List<Question> questionsToDelete = questionRepository.findByExamId(examId);
            if (!questionsToDelete.isEmpty()) {
                // In ra thông tin của các câu hỏi trước khi xóa
                questionRepository.deleteAll(questionsToDelete);
            }

            // Đọc file Excel để cập nhật dữ liệu mới
            try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);

                for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) continue;

                    // Tạo Question mới
                    Question question = new Question();
                    question.setQuestionText(getStringCellValue(row.getCell(0)));
                    question.setChoice1(getStringCellValue(row.getCell(1)));
                    question.setChoice2(getStringCellValue(row.getCell(2)));
                    question.setChoice3(getStringCellValue(row.getCell(3)));
                    question.setChoice4(getStringCellValue(row.getCell(4)));
                    questionRepository.save(question);

                    // Liên kết Question với Exam
                    ExamQuestion examQuestion = new ExamQuestion();
                    examQuestion.setExam(exam);
                    examQuestion.setQuestion(question);
                    examQuestionRepository.save(examQuestion);

                    // Tạo Answer mới
                    Answer answer = new Answer();
                    answer.setCorrectAnswer(getStringCellValue(row.getCell(5)));
                    answer.setQuestion(question);
                    answerRepository.save(answer);
                }
            }

            return ResponseEntity.ok("Cập nhật kỳ thi thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật kỳ thi: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{examId}")
    @Transactional
    public ResponseEntity<String> deleteExam(@PathVariable Long examId) {
        try {
            Optional<Exam> examOptional = examRepository.findById(Math.toIntExact(examId));
            if (examOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy kỳ thi!");
            }

            Exam exam = examOptional.get();

            // Xóa tất cả câu hỏi liên quan đến kỳ thi
            // Tìm tất cả câu hỏi liên quan đến kỳ thi
            List<Question> questionsToDelete = questionRepository.findByExamId(examId);
            if (!questionsToDelete.isEmpty()) {
                // In ra thông tin của các câu hỏi trước khi xóa
                questionRepository.deleteAll(questionsToDelete);
            }

            examRepository.delete(exam);

            return ResponseEntity.ok("Xóa kỳ thi và tất cả dữ liệu liên quan thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa kỳ thi: " + e.getMessage());
        }
    }

    private String getStringCellValue(Cell cell) {
        return cell != null ? cell.toString().trim() : "";
    }

    @GetMapping("/get-detail/{id}")
    public ResponseEntity<?> getExamDetail(@PathVariable Long id) {
        Exam exam = examRepository.findById(Math.toIntExact(id)).orElse(null);
        if (exam == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kỳ thi không tồn tại");
        }

        List<ExamQuestion> examQuestions = examQuestionRepository.findByExam(exam);
        List<QuestionDetailResponse> questionDetails = new ArrayList<>();

        for (ExamQuestion examQuestion : examQuestions) {
            Question question = examQuestion.getQuestion();
            if (question != null) {
                Answer answer = answerRepository.findByQuestion(question);
                QuestionDetailResponse questionDetail = new QuestionDetailResponse(question, answer);
                questionDetails.add(questionDetail);
            }
        }

        // Chuyển đổi LocalDateTime sang String
        String examStart = exam.getExamStart().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String examEnd = exam.getExamEnd().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        // Tạo đối tượng ExamDetailResponse
        ExamDetailResponse response = new ExamDetailResponse(
                exam.getExamId(),
                exam.getExamName(),
                examStart,
                examEnd,
                exam.getGrade(),
                exam.getStatus(),
                questionDetails
        );

        return ResponseEntity.ok(response);
    }
}

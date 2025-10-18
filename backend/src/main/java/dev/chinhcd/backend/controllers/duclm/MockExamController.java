package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.dtos.response.duclm.ExamDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.MockExamDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.QuestionDetailResponse;
import dev.chinhcd.backend.models.duclm.*;
import dev.chinhcd.backend.repository.duclm.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/mock-exam")
@RequiredArgsConstructor
public class MockExamController {

    private final IMockExamRepository mockExamRepository;
    private final IQuestionRepository questionRepository;
    private final IAnswerRepository answerRepository;
    private final IMockExamQuestionRepository examQuestionRepository;

    @GetMapping("/get-all")
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "7") int pageSize) {

        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<MockExam> mockExamPage = mockExamRepository.findAll(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("mockExams", mockExamPage.getContent());
        response.put("totalPages", mockExamPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-mock-exam")
    public ResponseEntity<String> uploadMockExam(
            @RequestParam("file") MultipartFile file,
            @RequestParam("examName") String examName,
            @RequestParam("examDate") String examDate,
            @RequestParam("type") String type,
            @RequestParam("grade") String grade) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Get the first sheet

            // Check if the mock exam already exists
            if (mockExamRepository.findByExamNameAndGrade(examName, grade).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Mock exam already exists in the system");
            }

            // Create and save MockExam
            MockExam mockExam = new MockExam();
            mockExam.setExamName(examName);
            mockExam.setExamDate(new SimpleDateFormat("yyyy-MM-dd").parse(examDate));
            mockExam.setType(type);
            mockExam.setGrade(grade);
            mockExamRepository.save(mockExam);

            // Iterate through the Excel file to create Questions and Answers
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                // Create Question
                Question question = new Question();
                question.setQuestionText(getStringCellValue(row.getCell(0))); // Question text
                question.setChoice1(getStringCellValue(row.getCell(1))); // Choice 1
                question.setChoice2(getStringCellValue(row.getCell(2))); // Choice 2
                question.setChoice3(getStringCellValue(row.getCell(3))); // Choice 3
                question.setChoice4(getStringCellValue(row.getCell(4))); // Choice 4
                questionRepository.save(question);

                // Link with MockExam
                MockExamQuestion examQuestion = new MockExamQuestion();
                examQuestion.setMockExam(mockExam);
                examQuestion.setQuestion(question);
                examQuestionRepository.save(examQuestion);

                // Create Answer
                Answer answer = new Answer();
                answer.setCorrectAnswer(getStringCellValue(row.getCell(5))); // Correct answer
                answer.setQuestion(question);
                answerRepository.save(answer);
            }

            return ResponseEntity.ok("Mock exam data has been saved");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }

    @PutMapping("/update/{mockExamId}")
    @Transactional
    public ResponseEntity<String> updateMockExam(
            @PathVariable Long mockExamId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("examName") String examName,
            @RequestParam("examDate") String examDate,
            @RequestParam("type") String type,
            @RequestParam("grade") String grade) {

        try {
            Optional<MockExam> mockExamOptional = mockExamRepository.findById(Math.toIntExact(mockExamId));
            if (mockExamOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mock exam not found!");
            }

            MockExam mockExam = mockExamOptional.get();
            mockExam.setExamName(examName);
            mockExam.setExamDate(new SimpleDateFormat("yyyy-MM-dd").parse(examDate));
            mockExam.setType(type);
            mockExam.setGrade(grade);
            mockExamRepository.save(mockExam);

            // Delete old data
            List<Question> questionsToDelete = questionRepository.findByMockExamId(mockExamId);
            if (!questionsToDelete.isEmpty()) {
                questionRepository.deleteAll(questionsToDelete);
            }

            // Read Excel file to update new data
            try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);

                for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) continue;

                    // Create new Question
                    Question question = new Question();
                    question.setQuestionText(getStringCellValue(row.getCell(0)));
                    question.setChoice1(getStringCellValue(row.getCell(1)));
                    question.setChoice2(getStringCellValue(row.getCell(2)));
                    question.setChoice3(getStringCellValue(row.getCell(3)));
                    question.setChoice4(getStringCellValue(row.getCell(4)));
                    questionRepository.save(question);

                    // Link Question with MockExam
                    MockExamQuestion examQuestion = new MockExamQuestion();
                    examQuestion.setMockExam(mockExam);
                    examQuestion.setQuestion(question);
                    examQuestionRepository.save(examQuestion);

                    // Create new Answer
                    Answer answer = new Answer();
                    answer.setCorrectAnswer(getStringCellValue(row.getCell(5)));
                    answer.setQuestion(question);
                    answerRepository.save(answer);
                }
            }

            return ResponseEntity.ok("Mock exam updated successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating mock exam: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{mockExamId}")
    @Transactional
    public ResponseEntity<String> deleteMockExam(@PathVariable Long mockExamId) {
        try {
            Optional<MockExam> mockExamOptional = mockExamRepository.findById(Math.toIntExact(mockExamId));
            if (mockExamOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mock exam not found!");
            }

            MockExam mockExam = mockExamOptional.get();

            // Delete all questions related to the mock exam
            List<Question> questionsToDelete = questionRepository.findByMockExamId(mockExamId);
            if (!questionsToDelete.isEmpty()) {
                questionRepository.deleteAll(questionsToDelete);
            }

            mockExamRepository.delete(mockExam);

            return ResponseEntity.ok("Mock exam and all related data deleted successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting mock exam: " + e.getMessage());
        }
    }

    private String getStringCellValue(Cell cell) {
        return cell != null ? cell.toString().trim() : "";
    }

    @GetMapping("/get-detail/{id}")
    public ResponseEntity<?> getMockExamDetail(@PathVariable Long id) {
        MockExam mockExam = mockExamRepository.findById(Math.toIntExact(id)).orElse(null);
        if (mockExam == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mock exam does not exist");
        }

        List<MockExamQuestion> examQuestions = examQuestionRepository.findByMockExam(mockExam);
        List<QuestionDetailResponse> questionDetails = new ArrayList<>();

        for (MockExamQuestion examQuestion : examQuestions) {
            Question question = examQuestion.getQuestion();
            if (question != null) {
                Answer answer = answerRepository.findByQuestion(question);
                QuestionDetailResponse questionDetail = new QuestionDetailResponse(question, answer);
                questionDetails.add(questionDetail);
            }
        }

        // Format the exam date
        String examDate = new SimpleDateFormat("yyyy-MM-dd").format(mockExam.getExamDate());
        int grade = Integer.parseInt(mockExam.getGrade());

        // Create a MockExamDetailResponse object
        MockExamDetailResponse response = new MockExamDetailResponse(
                mockExam.getMockExamId(),
                mockExam.getExamName(),
                examDate,
                grade,
                mockExam.getType(),
                questionDetails
        );

        return ResponseEntity.ok(response);
    }
}
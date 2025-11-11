package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Exam;
import dev.chinhcd.backend.models.duclm.UserExam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserExamRepository extends JpaRepository<UserExam, Integer> {
    Optional<UserExam> findTopByUserIdAndExamNameOrderByUserExamIdDesc(Long userId, String examName);

    @Query("SELECT ue FROM UserExam ue WHERE ue.examName = :examName ORDER BY ue.score DESC, ue.totalTime ASC LIMIT :limit")
    List<UserExam> findTopUsersByExamName(@Param("examName") String examName, @Param("limit") int limit);

    Optional<UserExam> findByUserExamId(Long userExamId);

    @Query("SELECT ue FROM UserExam ue " +
            "JOIN ue.user u " +
            "JOIN ue.exam e " +
            "WHERE (:examName IS NULL OR e.examName LIKE %:examName%) " +
            "AND (:grade IS NULL OR u.grade = :grade) " +
            "AND (:province IS NULL OR u.province LIKE %:province%) " +
            "ORDER BY ue.score DESC")
    Page<UserExam> searchResults(@Param("examName") String examName,
                                 @Param("grade") Integer grade,
                                 @Param("province") String province,
                                 Pageable pageable);


//    List<UserExam> findUserExamByExam_ExamNameAndAndExam_GradeAndUser_ProvinceOrderByScoreDesc(String examName, String examGrade, String userProvince);

    @Query("select ue from UserExam ue where ue.user.id=:userId and ue.exam.examId=:examId")
    List<UserExam> findUserExamByUserIdAndExamId(Long userId, Long examId);

    @Query(value = "SELECT ranked.*\n" +
            "FROM (\n" +
            "         SELECT um.user_exam_id, um.user_id, um.score, um.total_time, me.exam_name, me.grade, um.exam_id,\n" +
            "                ROW_NUMBER() OVER (\n" +
            "                    PARTITION BY me.exam_name\n" +
            "                    ORDER BY um.score DESC, um.total_time ASC\n" +
            "                    ) AS rnk\n" +
            "         FROM user_exam um\n" +
            "                  JOIN exam me ON um.exam_id = me.exam_id\n" +
            "         WHERE me.grade =:grade AND um.user_id =:userId\n" +
            "     ) ranked\n" +
            "WHERE rnk = 1", nativeQuery = true)
    List<UserExam> findArchieves(@Param("grade") int grade,@Param("userId") Long userId);

    @Query(value = """
                SELECT SUM(DATEDIFF(SECOND, CAST('00:00:00' AS TIME), ue.total_time))
                FROM user_exam ue
                JOIN exam e ON ue.exam_id = e.exam_id
                WHERE ue.user_id = :userId AND e.grade = :grade;
            """, nativeQuery = true)
    Long getTotalExamTime(@Param("userId") Long userId, @Param("grade") int grade);

    List<Exam> findAllByExam(Exam exam);
}

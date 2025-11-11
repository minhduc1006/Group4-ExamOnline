package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.UserMockExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserMockExamRepository extends JpaRepository<UserMockExam, Long> {
    UserMockExam findTopByUser_IdOrderByUserMockExamIdDesc(Long userId);

    List<UserMockExam> findByUser_Id(Long userId);

    @Query("select ue from UserMockExam ue " +
            "JOIN MockExam m on m.mockExamId = ue.mockExam.mockExamId " +
            "where FUNCTION('MONTH', m.examDate)=:month and ue.user.id=:userId")
    List<UserMockExam> findByMonthAndUserId(Integer month, Long userId);

    Optional<UserMockExam> findByUserMockExamId(Long userMockExamId);

    @Query(value = "SELECT ranked.*\n" +
            "FROM (\n" +
            "         SELECT um.user_mock_exam_id, um.user_id, um.score, um.total_time, me.exam_name, me.grade, um.mock_exam_id,\n" +
            "                ROW_NUMBER() OVER (\n" +
            "                    PARTITION BY me.exam_name\n" +
            "                    ORDER BY um.score DESC, um.total_time ASC\n" +
            "                    ) AS rnk\n" +
            "         FROM user_mock_exam um\n" +
            "                  JOIN mock_exam me ON um.mock_exam_id = me.mock_exam_id\n" +
            "         WHERE me.grade =:grade AND um.user_id =:userId\n\n" +
            "     ) ranked\n" +
            "WHERE rnk = 1;", nativeQuery = true)
    List<UserMockExam> findArchieves(@Param("grade") int grade, @Param("userId") Long userId);

    @Query(value = """
                SELECT SUM(DATEDIFF(SECOND, CAST('00:00:00' AS TIME), ue.total_time))
                FROM user_mock_exam ue
                JOIN mock_exam e ON ue.mock_exam_id = e.mock_exam_id
                WHERE ue.user_id = :userId AND e.grade = :grade;
            """, nativeQuery = true)
    Long getTotalExamTime(@Param("userId") Long userId, @Param("grade") int grade);

}

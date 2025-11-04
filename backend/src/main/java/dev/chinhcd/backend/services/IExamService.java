package dev.chinhcd.backend.services;

public interface IExamService {


    void answerQuestion(Integer questionId, Long uexamId, String answer);
}

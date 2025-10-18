"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionCard from "./QuestionCard";

// Kiểu dữ liệu của câu hỏi
interface Question {
  questionId: number;
  questionText: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
}

// Props của component
interface QuizGameProps {
  smallPracticeId: number;
}

const QuizGame: React.FC<QuizGameProps> = ({ smallPracticeId }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`/api/small-practice/${smallPracticeId}/questions`).then((response) => {
      setQuestions(response.data);
    });
  }, [smallPracticeId]);

  const handleAnswer = (isCorrect: boolean) => {
    setStatus(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setStatus(null);
      setCurrentIndex((prev) => prev + 1);
    }, 2000);
  };

  if (!questions.length) return <p>Loading...</p>;
  if (currentIndex >= questions.length) return <p>Game Over!</p>;

  return (
    <div className="flex flex-col items-center">
      <QuestionCard question={questions[currentIndex]} onAnswer={handleAnswer} />
      {status === "correct" && (
        <img src="https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif" alt="Correct" />
      )}
      {status === "wrong" && (
        <img src="https://media.giphy.com/media/hPPx8yk3Bmqys/giphy.gif" alt="Wrong" />
      )}
    </div>
  );
};

export default QuizGame;

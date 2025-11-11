"use client";

import React, { useState } from "react";
import axios from "axios";

// Định nghĩa kiểu dữ liệu cho câu hỏi
interface Question {
  questionId: number;
  questionText: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
}

// Props cho component
interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = async (choice: string) => {
    setSelected(choice);

    try {
      const response = await axios.post("/api/check-answer", {
        questionId: question.questionId,
        answer: choice,
      });

      if (response.data.correct) {
        setIsCorrect(true);
        onAnswer(true);
      } else {
        setIsCorrect(false);
        onAnswer(false);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold">{question.questionText}</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {[question.choice1, question.choice2, question.choice3, question.choice4].map(
          (choice, index) => (
            <button
              key={index}
              className={`p-2 rounded-lg ${
                selected === choice ? (isCorrect ? "bg-green-500" : "bg-red-500") : "bg-gray-300"
              }`}
              onClick={() => handleAnswer(choice)}
            >
              {choice}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default QuestionCard;

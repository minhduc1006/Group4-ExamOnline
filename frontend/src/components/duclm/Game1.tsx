"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Scoreboard from "./Scoreboard";

interface Question {
    questionId: number;
    questionText: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
    audioFile?: string | null;
}

interface Game1Props {
    questions: Question[]; // Nhận danh sách câu hỏi từ API
    initialScore: number; // Nhận điểm từ bên ngoài
    onComplete: (timeTaken: number, finalScore: number) => void; // Callback để gửi thời gian + điểm khi kết thúc
}

const Game1: React.FC<Game1Props> = ({ questions, initialScore, onComplete }) => {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(initialScore);
    const [timeLeft, setTimeLeft] = useState(1800); // Mặc định 30 phút
    const [quizState, setQuizState] = useState<"start" | "quiz" | "finished">("start");
    const [dinosaurMessage, setDinosaurMessage] = useState("");
    const [hasAnswered, setHasAnswered] = useState(false);
    const [dinosaurImage, setDinosaurImage] = useState("/test/dinosaur.svg");

    useEffect(() => {
        if (quizState === "quiz" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [quizState, timeLeft]);

    useEffect(() => {
        if (quizState === "finished") {
            onComplete(1800 - timeLeft, score); // Gửi thời gian hoàn thành + điểm ra ngoài
        }
    }, [quizState]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const handleAnswer = (index: number) => {
        if (hasAnswered) return;
        setHasAnswered(true);

        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswerIndex = [currentQuestion.choice1, currentQuestion.choice2, currentQuestion.choice3, currentQuestion.choice4].indexOf("Cat"); // Cần sửa chỗ này để lấy đúng đáp án từ API

        if (index === correctAnswerIndex) {
            setScore(score + 1);
            setDinosaurMessage("Great job!");
            setDinosaurImage("/test/correct.svg");
        } else {
            setDinosaurMessage("Oh no! Wrong answer!");
            setDinosaurImage("/test/wrong.svg");
        }

        setTimeout(() => {
            setDinosaurMessage(""); 
            setDinosaurImage("/test/dinosaur.svg");

            if (currentQuestionIndex + 1 < questions.length) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setHasAnswered(false);
            } else {
                setQuizState("finished");
                setDinosaurMessage("You have completed the quiz! Click OK to return.");
            }
        }, 1000);
    };

    return (
        <div className="bg-cover bg-center h-screen flex items-center justify-center relative text-white" style={{ backgroundImage: "url(/test/background.svg)" }}>
            {quizState !== "start" && (
                <img src={dinosaurImage} alt="Dinosaur" className="absolute left-8 bottom-0 w-[450px]" />
            )}

            {dinosaurMessage && (
                <div className="absolute left-[160px] bottom-[320px] bg-white text-black border border-black rounded-lg p-4 shadow-lg text-center max-w-[280px] font-bold">
                    <p className="m-0">{dinosaurMessage}</p>
                    <div className="absolute left-[50%] bottom-[-18px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-black"></div>
                    <div className="absolute left-[50%] bottom-[-14px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-white"></div>
                </div>
            )}

            {quizState === "quiz" && (
                <div className="absolute top-4 right-4">
                    <Scoreboard score={score} time={formatTime(timeLeft)} />
                </div>
            )}

            <div className="bg-black bg-opacity-50 rounded-lg p-10 shadow-lg text-center max-w-lg w-full">
                {quizState === "start" && (
                    <div>
                        <h2 className="text-2xl">Welcome to the Dinosaur game!</h2>
                        <img src="/test/dinosaur.svg" alt="Dinosaur" className="mx-auto w-[200px] mb-5 mt-3" />
                        <button className={buttonStyle} onClick={() => setQuizState("quiz")}>Start</button>
                    </div>
                )}

                {quizState === "quiz" && (
                    <div>
                        <h2 className="text-2xl mb-4">{questions[currentQuestionIndex].questionText}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[questions[currentQuestionIndex].choice1, questions[currentQuestionIndex].choice2, questions[currentQuestionIndex].choice3, questions[currentQuestionIndex].choice4].map((answer, index) => (
                                <button key={index} className={buttonStyle} onClick={() => handleAnswer(index)}>
                                    {answer}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {quizState === "finished" && (
                    <div>
                        <h2 className="text-2xl">Game Completed!</h2>
                        <p className="text-lg">Your score: {score}/{questions.length}</p>
                        <p className="text-lg">Completion Time: {formatTime(1800 - timeLeft)}</p>
                        <button className={buttonStyle} onClick={() => router.push("/practice")}>OK</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const buttonStyle = "bg-teal-600 text-white rounded-md px-4 py-2 mx-2 cursor-pointer transition duration-300 hover:bg-teal-700";

export default Game1;

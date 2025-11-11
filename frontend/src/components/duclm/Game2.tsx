"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Scoreboard from "./Scoreboard";

const Game2: React.FC = () => {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
    const [quizState, setQuizState] = useState<"start" | "quiz" | "finished">("start");
    const [studentMessage, setStudentMessage] = useState("");
    const [hasAnswered, setHasAnswered] = useState(false);
    const [studentImage, setStudentImage] = useState("/game2/student.png");

    const questions = [
        {
            question: "Question 1?",
            answers: ["Answer A", "Answer B", "Answer C", "Answer D"],
            correct: 1,
        },
        {
            question: "Question 2?",
            answers: ["Answer A", "Answer B", "Answer C", "Answer D"],
            correct: 3,
        },
    ];

    useEffect(() => {
        document.addEventListener("contextmenu", (event) => event.preventDefault());
    
        // Chặn các phím tắt DevTools
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === "F12" || // F12 mở DevTools
                (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "J")) || // Ctrl+Shift+I, Ctrl+Shift+J
                (event.ctrlKey && event.key === "U") || // Ctrl+U (View Page Source)
                event.key === "F5" || // F5 làm mới trang
                (event.ctrlKey && event.key === "r") // Ctrl+R làm mới trang
            ) {
                event.preventDefault();
            }
        };
    
        document.addEventListener("keydown", handleKeyDown);
    
        return () => {
            document.removeEventListener("contextmenu", (event) => event.preventDefault());
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    

    useEffect(() => {
        if (quizState === "quiz" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [quizState, timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const handleAnswer = (index: number) => {
        if (hasAnswered) return;
        setHasAnswered(true);

        if (index === questions[currentQuestionIndex].correct) {
            setScore(score + 1);
            setStudentMessage("Great job!");
            setStudentImage("/game2/correct.png");
        } else {
            setStudentMessage("Oh no! Wrong answer!");
            setStudentImage("/game2/wrong.png");
        }

        setTimeout(() => {
            setStudentMessage(""); // Xóa message
            setStudentImage("/game2/start.png"); // Đổi lại thành student mặc định
            if (currentQuestionIndex + 1 < questions.length) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setHasAnswered(false);
            } else {
                setQuizState("finished");
                setStudentMessage("You have completed the quiz! Click OK to return.");
            }
        }, 1000);
    };

    return (
        <div className="bg-cover bg-center h-screen flex items-center justify-center relative text-white" style={{ backgroundImage: "url(/game2/background.png)" }}>
            {quizState !== "start" && (
                <img src={studentImage} alt="Student" className="absolute left-8 bottom-0 w-[450px]" />
            )}

            {studentMessage && (
                <div className="absolute left-[160px] bottom-[320px] bg-white text-black border border-black rounded-lg p-4 shadow-lg text-center max-w-[280px] font-bold">
                    <p className="m-0">{studentMessage}</p>
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
                        <h2 className="text-2xl">Welcome to the Student game!</h2>
                        <img src="/game2/start.png" alt="Student" className="mx-auto w-[200px] mb-5 mt-3" />
                        <button className={buttonStyle} onClick={() => setQuizState("quiz")}>Start</button>
                    </div>
                )}

                {quizState === "quiz" && (
                    <div>
                        <h2 className="text-2xl mb-4">{questions[currentQuestionIndex].question}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {questions[currentQuestionIndex].answers.map((answer, index) => (
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

const buttonStyle = "bg-orange-500 text-white rounded-md px-4 py-2 mx-2 cursor-pointer transition duration-300 hover:bg-orange-600 shadow-lg";

export default Game2;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
import Scoreboard from "./Scoreboard";
import useCurrentUser from "@/hooks/useCurrentUser";
import { API } from "@/helper/axios"; // Nhập API từ axios

interface Question {
    questionId: number;
    questionText: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
    audioFile?: Uint8Array | null; // Thay đổi kiểu dữ liệu
}

interface TimeRequest {
    smallpracticeID: number;
    userID: number;
    timeTaken: number;
}

interface Game3Props {
    questions: Question[];
    initialScore: number;
    smallpracticeID: number;
    wsUrl: string; // WebSocket URL
}

const Practice3: React.FC<Game3Props> = ({ questions, initialScore, smallpracticeID, wsUrl }) => {
    const user = useCurrentUser();
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(initialScore);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
    const [quizState, setQuizState] = useState<"start" | "quiz" | "finished">("start");
    const [studentMessage, setStudentMessage] = useState("");
    const [hasAnswered, setHasAnswered] = useState(false);
    const [studentImage, setStudentImage] = useState("/game3/student.png");
    const [stompClient, setStompClient] = useState<Client | null>(null);
    // Thêm trạng thái mới để theo dõi câu trả lời đã chọn và kết quả
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const handleStartGame = () => {
        if (stompClient && user.data?.id) {
            stompClient.publish({
                destination: "/app/reset-score",
                body: user.data.id.toString(),
            });
        }
        setScore(0); // Reset điểm
        setQuizState("quiz"); // Chuyển trạng thái
    };

    useEffect(() => {
        const socket = new SockJS(wsUrl);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: (frame) => {
                console.log("✅ WebSocket connected:", frame);
                const userQueue = `/user/queue/practice/total-score`;
                client.subscribe(userQueue, (message) => {
                    const data = message.body.split("*");
                    if (data.length !== 2) return;
                    const updatedScore = parseInt(data[0], 10);
                    const isCorrect = data[1] === "true";
                    console.log(`🔹 Received new score: ${updatedScore}, Correct: ${isCorrect}`);
                    if (!isNaN(updatedScore)) {
                        setScore(updatedScore); // Cập nhật score
                        handleAnswerFeedback(isCorrect); // Gửi kết quả để hiển thị feedback
                    }
                });
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
            console.log("Disconnected from WebSocket");
        };
    }, [wsUrl]);

    useEffect(() => {
        if (quizState === "quiz" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [quizState, timeLeft]);

    const handleAnswer = (answer: string) => {
        if (hasAnswered || !stompClient) return;
        setHasAnswered(true);
        setSelectedAnswer(answer); // Lưu câu trả lời đã chọn

        const currentQuestion = questions[currentQuestionIndex];
        const payload = `${answer}*${currentQuestion.questionId}*${user.data?.id}`;
        
        console.log(`📤 Sending answer: ${payload}`);
        stompClient.publish({ destination: "/app/submit-answer", body: payload });
    };

    const handleAnswerFeedback = (isCorrect: boolean) => {
        setIsCorrectAnswer(isCorrect); // Cập nhật trạng thái đúng/sai
        if (isCorrect) {
            setStudentMessage("Great job!");
            setStudentImage("/game3/correct.png");
        } else {
            setStudentMessage("Oh no! Wrong answer!");
            setStudentImage("/game3/wrong.png");
        }

        setTimeout(() => {
            setStudentMessage(""); // Xóa message
            setStudentImage("/game3/student.png"); // Đổi lại thành student mặc định
            setHasAnswered(false);
            setSelectedAnswer(null); // Reset câu trả lời đã chọn
            setIsCorrectAnswer(null); // Reset trạng thái đúng/sai

            setCurrentQuestionIndex((prevIndex) => {
                if (prevIndex + 1 < questions.length) {
                    return prevIndex + 1; // Tiến tới câu hỏi tiếp theo
                } else {
                    setQuizState("finished");
                    setStudentMessage("You have completed the quiz! Click OK to return.");
                    return prevIndex; // Không thay đổi chỉ số khi đã hoàn thành
                }
            });
        }, 1000);
    };

    const handleAudioPlay = async () => {
        const currentQuestionId = questions[currentQuestionIndex].questionId;
    
        try {
            const response = await API.get(`/question/${currentQuestionId}`, {
                responseType: 'blob', // Đảm bảo nhận dữ liệu dưới dạng blob
            });
    
            const audioBlob = response.data; // Lấy blob từ response
            const url = URL.createObjectURL(audioBlob); // Tạo URL từ blob
    
            const audio = new Audio(url);
            audio.play().catch(error => console.error("Error playing audio:", error));
        } catch (error) {
            console.error("Error loading audio:", error);
        }
    };

    const saveTime = async () => {
    
            if (!user.data?.id) return;
    
            const timeRequest: TimeRequest = {
                smallpracticeID: smallpracticeID,
                userID: user.data?.id,
                timeTaken: 1800 - timeLeft,
            };
    
            console.log(timeRequest);
    
            try {
                await API.post("/save-time", timeRequest);
                console.log("Time saved successfully");
            } catch (error) {
                console.error("Error saving time:", error);
            }
        };

    // Hàm để xác định lớp CSS động cho nút
    const getButtonClass = (answer: string) => {
        if (selectedAnswer === answer && isCorrectAnswer === true) {
            return "bg-green-600 text-white rounded-md px-4 py-2 mx-2 cursor-pointer transition duration-300 hover:bg-green-700 shadow-lg";
        } else if (selectedAnswer === answer && isCorrectAnswer === false) {
            return "bg-red-600 text-white rounded-md px-4 py-2 mx-2 cursor-pointer transition duration-300 hover:bg-red-700 shadow-lg";
        } else {
            return buttonStyle;
        }
    };

    // Phát âm thanh khi câu hỏi thay đổi
    useEffect(() => {
        if (quizState === "quiz") {
            handleAudioPlay(); // Phát âm thanh khi câu hỏi thay đổi
        }
    }, [currentQuestionIndex, quizState]);

    return (
        <div className="bg-cover bg-center h-screen flex items-center justify-center relative text-white" style={{ backgroundImage: "url(/game3/background.png)" }}>
            {/* Icon Listen */}
            <div className="absolute top-4 left-4">
                <button onClick={handleAudioPlay} className="bg-blue-500 rounded-full p-4 shadow-lg hover:shadow-xl transition">
                    <img src="/game3/loa.png" alt="Listen" className="w-10 h-10" />
                </button>
            </div>

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

            <div className="bg-blue-900 bg-opacity-90 rounded-lg p-10 shadow-lg text-center max-w-lg w-full">
                {quizState === "start" && (
                    <div>
                        <h2 className="text-2xl">Welcome to Practice 3!</h2>
                        <img src="/game3/start.png" alt="Student" className="mx-auto w-[200px] mb-5 mt-3" />
                        <button className={buttonStyle} onClick={handleStartGame}>Start</button>
                    </div>
                )}

                {quizState === "quiz" && (
                    <div>
                        <h2 className="text-2xl mb-4">{questions[currentQuestionIndex].questionText}</h2>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {[questions[currentQuestionIndex].choice1, questions[currentQuestionIndex].choice2, questions[currentQuestionIndex].choice3, questions[currentQuestionIndex].choice4].map((answer, index) => (
                                <button key={index} className={getButtonClass(answer)} onClick={() => handleAnswer(answer)}>
                                    {answer}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {quizState === "finished" && (
                    <div>
                        <h2 className="text-2xl">Game Completed!</h2>
                        <p className="text-lg">Your score: {score}/{questions.length * 10}</p>
                        <p className="text-lg">Completion Time: {formatTime(1800 - timeLeft)}</p>
                        <button className={buttonStyle} onClick={() => { saveTime(); router.push("/practice"); }}>OK</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const buttonStyle = "bg-blue-500 text-white rounded-md px-4 py-2 mx-2 cursor-pointer transition duration-300 hover:bg-blue-600 shadow-lg";

export default Practice3;
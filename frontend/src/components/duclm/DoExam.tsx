"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import useCurrentUser from "@/hooks/useCurrentUser";
import { API } from "@/helper/axios";
import RightBoard from "./RightBoardExam";

interface Question {
  questionId: number;
  questionText: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  audioFile?: Uint8Array | null; // Thay đổi kiểu dữ liệu
}

interface ExamProps {
  questions: Question[];
  examID: number;
  wsUrl: string;
  examName: string;
  examType: string;
}

const enterFullScreen = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem
      .requestFullscreen()
      .catch((err) => console.warn("Lỗi fullscreen:", err));
  }
};

const exitFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
};

const DoExam: React.FC<ExamProps> = ({
  questions,
  examID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  examName,
  wsUrl,
  examType,
}) => {
  const user = useCurrentUser();
  const router = useRouter();
  const [userExamId, setUserExamId] = useState(-1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [quizState, setQuizState] = useState<"start" | "quiz" | "finished">(
    "start"
  );
  const [score, setScore] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [studentMessage, setStudentMessage] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const studentImages = [
    "/game4/type1.png",
    "/game4/type2.png",
    "/game4/type3.png",
    "/game4/type4.png",
  ];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [studentImage, setStudentImage] = useState(
    studentImages[getRandomNumber()]
  );

  function getRandomNumber(): number {
    return Math.floor(Math.random() * 4);
  }

  useEffect(() => {
    // 🛑 Chặn ESC + Các phím F1 → F19, Ctrl, Alt
    const blockKeys = (event: KeyboardEvent) => {
      if (quizState === "quiz") {
        if (
          /^F\d{1,2}$/.test(event.key) || // Chặn F1 - F19
          event.key.toLowerCase() === "control" ||
          event.key.toLowerCase() === "alt" ||
          event.key.toLowerCase() === "escape" ||
          (event.ctrlKey && event.key.length === 1) ||
          (event.ctrlKey && event.shiftKey && event.key.length === 1)
        ) {
          event.preventDefault();
          event.stopPropagation();
          console.warn(`Chặn phím: ${event.key}`); // Debug
        }
      }
    };

    // 🛑 Chặn keyup để tránh thoát fullscreen
    const blockKeyUp = (event: KeyboardEvent) => {
      if (quizState === "quiz") {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // 🛑 Chặn thoát fullscreen (bật lại ngay nếu bị thoát)
    const handleFullScreenChange = () => {
      setTimeout(() => {
        if (quizState === "quiz" && !document.fullscreenElement) {
          enterFullScreen();
        }
      }, 10);
    };

    // 🛑 Chặn context menu (chuột phải)
    const blockContextMenu = (event: MouseEvent) => {
      if (quizState === "quiz") {
        event.preventDefault();
      }
    };

    // 🛑 Chặn rời khỏi trang
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (quizState === "quiz") {
        event.preventDefault();
        event.returnValue = ""; // Hiển thị cảnh báo
      }
    };

    // 🛑 Auto-submit khi thoát trang
    const handleUnload = () => {
      if (quizState === "quiz") {
        autoSubmit();
      }
    };

    // 🛑 Khi mất focus (mở app khác), cũng cảnh báo
    const handleBlur = () => {
      if (quizState === "quiz") {
        alert("Bạn đã rời khỏi màn hình! Bài thi sẽ bị nộp.");
        autoSubmit();
      }
    };

    if (quizState === "quiz") {
      enterFullScreen();
      document.addEventListener("fullscreenchange", handleFullScreenChange);
      document.addEventListener("keydown", blockKeys);
      document.addEventListener("keyup", blockKeyUp);
      document.addEventListener("contextmenu", blockContextMenu);
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("unload", handleUnload);
      window.addEventListener("blur", handleBlur);
    } else {
      exitFullScreen();
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("keyup", blockKeyUp);
      document.removeEventListener("contextmenu", blockContextMenu);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      window.removeEventListener("blur", handleBlur);
    };
  }, [quizState]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleStartExam = () => {
    if (stompClient && user.data?.id) {
      stompClient.publish({
        destination: "/app/start-exam",
        body: user.data.id + "-" + examID + "-" + examType,
      });
    }
    setQuizState("quiz"); // Chuyển trạng thái
  };

  useEffect(() => {
    const socket = new SockJS(wsUrl);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: (frame) => {
        console.log("✅ WebSocket connected:", frame);
        const userQueue = `/user/queue/final-result`;
        client.subscribe(userQueue, (message) => {
          const updatedScore = parseInt(message.body, 10);
          console.log(`🔹 Received new score: ${updatedScore}`);
          if (!isNaN(updatedScore)) {
            setScore(updatedScore);
          }
        });
        client.subscribe(`/user/queue/exam-id`, (message) => {
          const uei = parseInt(message.body, 10);
          if (!isNaN(uei)) {
            setUserExamId(uei);
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

    const currentQuestion = questions[currentQuestionIndex];
    const payload = `${currentQuestion.questionId}-${userExamId}-${answer}`;

    console.log(`📤 Sending answer: ${payload}`);
    stompClient.publish({
      destination: `/app/answer/${examType}`,
      body: payload,
    });
    handleAnswerFeedback();
  };

  const autoSubmit = () => {
    setQuizState("finished");
    setStudentMessage("You have completed the quiz! Click OK to return.");
    submit();
  };

  const handleAnswerFeedback = () => {
    setHasAnswered(false);
    setCurrentQuestionIndex((prevIndex) => {
      if (prevIndex + 1 < questions.length) {
        return prevIndex + 1;
      } else {
        setQuizState("finished");
        setStudentMessage("You have completed the quiz! Click OK to return.");
        submit();
        return prevIndex;
      }
    });
  };

  const handleAudioPlay = async () => {
    if (!questions[currentQuestionIndex].audioFile) {
      return;
    }

    const currentQuestionId = questions[currentQuestionIndex].questionId;

    try {
      const response = await API.get(`/question/${currentQuestionId}`, {
        responseType: "blob", // Đảm bảo nhận dữ liệu dưới dạng blob
      });

      const audioBlob = response.data; // Lấy blob từ response
      const url = URL.createObjectURL(audioBlob); // Tạo URL từ blob

      const audio = new Audio(url);
      audio
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  };

  const submit = async () => {
    if (!user.data?.id) return;
    if (hasAnswered || !stompClient) return;

    const timeTaken = 1800 - timeLeft;

    const payload = `${userExamId}-${timeTaken}-${examType}`;

    console.log(`📤 Sending submit: ${payload}`);
    stompClient.publish({
      destination: `/app/final-result`,
      body: payload,
    });
  };

  useEffect(() => {
    if (quizState === "quiz") {
      handleAudioPlay(); // Phát âm thanh khi câu hỏi thay đổi
    }
  }, [currentQuestionIndex, quizState]);

  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center relative text-white"
      style={{ backgroundImage: "url(/game4/background.jpg)" }}
    >
      {/* Icon Listen */}
      {questions[currentQuestionIndex].audioFile && (
        <div className="absolute top-4 left-4">
          <button
            onClick={handleAudioPlay}
            className="bg-blue-500 rounded-full p-4 shadow-lg hover:shadow-xl transition"
          >
            <img src="/game3/loa.png" alt="Listen" className="w-10 h-10" />
          </button>
        </div>
      )}

      {quizState !== "start" && (
        <img
          src={studentImage}
          alt="Student"
          className="absolute left-8 bottom-0 w-[450px]"
        />
      )}

      {quizState === "quiz" && (
        <div className="absolute top-4 right-4">
          <RightBoard time={formatTime(timeLeft)} />
        </div>
      )}

      <div className="bg-blue-900 bg-opacity-90 rounded-lg p-10 shadow-lg text-center max-w-lg w-full">
        {quizState === "start" && (
          <div>
            <h2 className="text-2xl">Welcome to {examType==="exam" ? "Exam" : "Mock Exam"}!</h2>
            <img
              src={studentImage}
              alt="Student"
              className="mx-auto w-[200px] mb-5 mt-3"
            />
            <button className={buttonStyle} onClick={handleStartExam}>
              Start
            </button>
          </div>
        )}

        {quizState === "quiz" && (
          <div>
            <h2 className="text-2xl mb-4">
              {questions[currentQuestionIndex].questionText}
            </h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                questions[currentQuestionIndex].choice1,
                questions[currentQuestionIndex].choice2,
                questions[currentQuestionIndex].choice3,
                questions[currentQuestionIndex].choice4,
              ].map((answer, index) => (
                <button
                  key={index}
                  className={buttonStyle}
                  onClick={() => handleAnswer(answer)}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        )}

        {quizState === "finished" && (
          <div>
            <h2 className="text-2xl">Exam Completed!</h2>
            <p className="text-lg">
              Your score: {score}/{questions.length * 10}
            </p>
            <p className="text-lg">
              Completion Time: {formatTime(1800 - timeLeft)}
            </p>
            <button
              className={buttonStyle}
              onClick={() => {
                submit();
                router.push(examType === "exam" ? `/exam` : `/mockexam`);
              }}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const buttonStyle =
  "bg-blue-500 text-white rounded-md px-4 py-2 mx-2 cursor-pointer transition duration-300 hover:bg-blue-600 shadow-lg";

export default DoExam;

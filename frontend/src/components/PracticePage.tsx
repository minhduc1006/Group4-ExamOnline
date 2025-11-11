"use client";

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Practice1 from "@/components/duclm/Practice1";
import Practice2 from "@/components/duclm/Practice2";
import Practice3 from "@/components/duclm/Practice3";
import { API } from "@/helper/axios";

interface Question {
    questionId: number;
    questionText: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
    audioFile?: Uint8Array | null;
}

const PracticePage: React.FC = () => {
    const { id, name } = useParams();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [initialScore, setInitialScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const wsUrl = "http://localhost:8080/api/v1/ws";

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await API.get(`/small-practice/${id}/questions`, {
                    headers: { "Content-Type": "application/json" },
                });
                if (response.data.length > 0) {
                    setQuestions(response.data);
                }
            } catch (error) {
                console.error("❌ Lỗi khi lấy dữ liệu câu hỏi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizData();
    }, [id]);

    if (loading) return <p className="text-white text-center text-xl">Loading questions...</p>;

    // Chuyển đổi id sang số
    const smallpracticeID = Number(id);
    if (isNaN(smallpracticeID)) {
        return <p className="text-white text-center text-xl">ID không hợp lệ!</p>;
    }

    // Xác định component cần render dựa vào `name`
    const renderPracticeComponent = () => {
        switch (name) {
            case "B%C3%A0i%201":
                return <Practice1 smallpracticeID={smallpracticeID} questions={questions} initialScore={initialScore} wsUrl={wsUrl} />;
            case "B%C3%A0i%202":
                return <Practice2 smallpracticeID={smallpracticeID} questions={questions} initialScore={initialScore} wsUrl={wsUrl} />;
            case "B%C3%A0i%203":
                return <Practice3 smallpracticeID={smallpracticeID} questions={questions} initialScore={initialScore} wsUrl={wsUrl} />;
            default:
                return <p className="text-white text-center text-xl">Bài luyện tập không tồn tại!</p>;
        }
    };

    return <div>{renderPracticeComponent()}</div>;
};

export default PracticePage;
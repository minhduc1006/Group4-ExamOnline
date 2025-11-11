"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { API } from "@/helper/axios";
import DoExam from "@/components/duclm/DoExam";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";

interface Question {
  questionId: number;
  questionText: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  audioFile?: Uint8Array | null;
}

const ExamPage = () => {
  const { id, type } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const wsUrl = "http://localhost:8080/api/v1/ws";
  const params = useSearchParams();
  const name = params.get("name") || "";
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAllowDoExam = async () => {
      try {
        const response = await API.get(`/${type}/allow-do-exam`, {
          headers: { "Content-Type": "application/json" },
          params: {
            examId: id,
          },
        });
        if (response.data === false) {
          throw new Error();
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        router.push("/");
        toast({
          title: "Bạn chưa đủ điều kiện tham gia kỳ thi",
          className: "text-white bg-yellow-500",
        });
      }
    };

    checkAllowDoExam();
  }, []);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await API.get(`/${type}/get-question`, {
          headers: { "Content-Type": "application/json" },
          params: {
            examId: id,
          },
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
  }, [id, type, name]);

  if (loading)
    return (
      <p className="text-white text-center text-xl">Loading questions...</p>
    );

  const examID = Number(id);
  if (isNaN(examID)) {
    return <p className="text-white text-center text-xl">ID không hợp lệ!</p>;
  }
  const examName = String(name);
  const examType = String(type);

  return (
    <div>
      <DoExam
        examType={examType}
        examID={examID}
        examName={examName}
        questions={questions}
        wsUrl={wsUrl}
      />
    </div>
  );
};

export default ExamPage;

"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Question {
    questionId: number;
    questionText: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
}

interface Answer {
    correctAnswer: string;
}

interface QuestionDetail {
    question: Question;
    answer: Answer;
}

interface Exam {
    examId: number;
    examName: string;
    examStart: string;
    examEnd: string;
    grade: string; 
    status: string; 
    questions: QuestionDetail[];
}

interface ExamDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    exam: Exam;
}

const ExamDetailModal: React.FC<ExamDetailModalProps> = ({
    isOpen,
    onClose,
    exam,
}) => {
    if (!exam) return null; // Không hiển thị modal nếu không có kỳ thi

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg" style={{ width: '80%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
                <DialogTitle className="text-center">Chi tiết kỳ thi</DialogTitle>
                <div className="p-4">
                    <p><strong>Tên kỳ thi:</strong> {exam.examName}</p>
                    <p><strong>Thời gian bắt đầu:</strong> {new Date(exam.examStart).toLocaleString("en-GB")}</p>
                    <p><strong>Thời gian kết thúc:</strong> {new Date(exam.examEnd).toLocaleString("en-GB")}</p>
                    <p><strong>Khối:</strong> {exam.grade}</p>
                    <p><strong>Trạng thái:</strong> {exam.status === "on" ? "Đang hoạt động" : "Ngừng hoạt động"}</p>

                    <h3 className="mt-4 font-semibold">Danh sách câu hỏi:</h3>
                    <table className="mt-2 w-full border-collapse border">
                        <thead>
                            <tr>
                                <th className="border p-2">Câu hỏi</th>
                                <th className="border p-2">Lựa chọn 1</th>
                                <th className="border p-2">Lựa chọn 2</th>
                                <th className="border p-2">Lựa chọn 3</th>
                                <th className="border p-2">Lựa chọn 4</th>
                                <th className="border p-2">Câu trả lời đúng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exam.questions.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{item.question.questionText}</td>
                                    <td className="border p-2">{item.question.choice1}</td>
                                    <td className="border p-2">{item.question.choice2}</td>
                                    <td className="border p-2">{item.question.choice3}</td>
                                    <td className="border p-2">{item.question.choice4}</td>
                                    <td className="border p-2">{item.answer.correctAnswer}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <DialogFooter>
                    <DialogClose className="ml-2" asChild>
                        <Button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-black text-black rounded-md hover:bg-gray-100"
                        >
                            Đóng
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ExamDetailModal;
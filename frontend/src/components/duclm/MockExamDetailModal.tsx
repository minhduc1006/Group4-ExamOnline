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

interface MockExam {
    mockExamId: number;
    examName: string;
    examDate: string;
    grade: string;
    type: string; 
    questions: QuestionDetail[]; // Đảm bảo đây là một mảng
}

interface MockExamDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    mockExam: MockExam | null; // Chấp nhận null
}

const MockExamDetailModal: React.FC<MockExamDetailModalProps> = ({
    isOpen,
    onClose,
    mockExam,
}) => {
    if (!mockExam) return null; // Không hiển thị modal nếu không có kỳ thi

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg" style={{ width: '80%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
                <DialogTitle className="text-center">Chi tiết kỳ thi giả lập</DialogTitle>
                <div className="p-4">
                    <p><strong>Tên kỳ thi:</strong> {mockExam.examName}</p>
                    <p><strong>Ngày thi:</strong> {new Date(mockExam.examDate).toLocaleDateString("en-GB")}</p>
                    <p><strong>Khối:</strong> {mockExam.grade}</p>
                    <p><strong>Loại kỳ thi:</strong> {mockExam.type}</p>

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
                            {Array.isArray(mockExam.questions) && mockExam.questions.length > 0 ? (
                                mockExam.questions.map((item) => (
                                    <tr key={item.question.questionId}>
                                        <td className="border p-2">{item.question.questionText}</td>
                                        <td className="border p-2">{item.question.choice1}</td>
                                        <td className="border p-2">{item.question.choice2}</td>
                                        <td className="border p-2">{item.question.choice3}</td>
                                        <td className="border p-2">{item.question.choice4}</td>
                                        <td className="border p-2">{item.answer.correctAnswer}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="border p-2 text-center">Không có câu hỏi nào.</td>
                                </tr>
                            )}
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

export default MockExamDetailModal;
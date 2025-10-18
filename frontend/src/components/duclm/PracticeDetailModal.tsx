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

interface Answer {
    correctAnswer: string;
}

interface QuestionDetail {
    question: {
        questionText: string;
        choice1: string;
        choice2: string;
        choice3: string;
        choice4: string;
    };
    answer: Answer | null; // Chỉ một câu trả lời
}

interface PracticeDetail {
    testName: string;
    questions: QuestionDetail[];
}

interface PracticeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    grade: number;
    practiceLevel: number;
    practiceDate: string;
    practiceDetails: PracticeDetail[];
}

const PracticeDetailModal: React.FC<PracticeDetailModalProps> = ({
    isOpen,
    onClose,
    grade,
    practiceLevel,
    practiceDate,
    practiceDetails,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg" style={{ width: '80%', maxWidth: '800px' }}>
                <DialogTitle className="text-center">Chi tiết bài tự luyện</DialogTitle>
                <div className="p-4">
                    <p><strong>Khối:</strong> {grade}</p>
                    <p><strong>Vòng tự luyện:</strong> {practiceLevel}</p>
                    <p><strong>Ngày:</strong> {new Date(practiceDate).toLocaleDateString("en-GB")}</p>
                    
                    <h3 className="mt-4 font-semibold">Chi tiết các bài thực hành:</h3>
                    {practiceDetails.map((detail, index) => (
                        <div key={index} className="mt-4">
                            <h4 className="font-semibold">{detail.testName}</h4>
                            <table className="mt-2 w-full border-collapse border">
                                <thead>
                                    <tr>
                                        <th className="border p-2">Câu hỏi</th>
                                        <th className="border p-2">Choice 1</th>
                                        <th className="border p-2">Choice 2</th>
                                        <th className="border p-2">Choice 3</th>
                                        <th className="border p-2">Choice 4</th>
                                        <th className="border p-2">Câu trả lời đúng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detail.questions.map((qDetail, qIndex) => (
                                        <tr key={qIndex}>
                                            <td className="border p-2">{qDetail.question.questionText}</td>
                                            <td className="border p-2">{qDetail.question.choice1}</td>
                                            <td className="border p-2">{qDetail.question.choice2}</td>
                                            <td className="border p-2">{qDetail.question.choice3}</td>
                                            <td className="border p-2">{qDetail.question.choice4}</td>
                                            <td className="border p-2">{qDetail.answer ? qDetail.answer.correctAnswer : "Không có"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
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

export default PracticeDetailModal;
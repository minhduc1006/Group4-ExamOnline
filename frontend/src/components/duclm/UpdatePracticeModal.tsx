"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API } from "@/helper/axios";
import { useToast } from "@/components/ui/use-toast";

interface UpdatePracticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    practice: {
        practiceId: number;
        practiceDate: string;
        grade: number;
        practiceLevel: number;
    };
    refreshList: () => void;
}

const UpdatePracticeModal: React.FC<UpdatePracticeModalProps> = ({
    isOpen,
    onClose,
    practice,
    refreshList,
}) => {
    const { toast } = useToast();
    const [practiceDate, setPracticeDate] = useState(practice.practiceDate);
    const [grade, setGrade] = useState(practice.grade.toString());
    const [practiceLevel, setPracticeLevel] = useState(practice.practiceLevel.toString());
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0] || null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) {
            toast({ title: "Vui lòng chọn tệp Excel!", className: "text-white bg-red-500" });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("practiceDate", practiceDate);
        formData.append("grade", grade);
        formData.append("practiceLevel", practiceLevel);

        try {
            await API.put(`/practice/update/${practice.practiceId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast({
                title: "Cập nhật thành công!",
                description: "Dữ liệu đã được cập nhật.",
                className: "text-white bg-green-500",
            });

            refreshList();
            onClose();
        } catch (error) {
            toast({
                title: "Lỗi!",
                description: "Có lỗi xảy ra khi cập nhật dữ liệu.",
                className: "text-white bg-red-500",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg p-6 max-w-lg">
                <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">
                    Cập nhật bài tự luyện
                </DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Ngày thực hành */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Ngày thực hành</label>
                        <input
                            type="date"
                            value={practiceDate}
                            onChange={(e) => setPracticeDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                        />
                    </div>

                    {/* Khối */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Khối</label>
                        <input
                            type="text"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                        />
                    </div>

                    {/* Vòng tự luyện */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Vòng tự luyện</label>
                        <input
                            type="text"
                            value={practiceLevel}
                            onChange={(e) => setPracticeLevel(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                        />
                    </div>

                    {/* Upload File */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tải lên file Excel</label>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
                        />
                        {file && (
                            <p className="text-sm text-green-600 mt-1">
                                📄 Đã chọn: {file.name}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <DialogFooter className="mt-6 flex justify-end gap-3">
                        <Button
                            type="submit"
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
                        >
                            Cập nhật
                        </Button>
                        <Button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-black text-black rounded-md hover:bg-gray-100"
                        >
                            Đóng
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdatePracticeModal;

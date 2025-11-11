"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API } from "@/helper/axios";
import { useToast } from "@/components/ui/use-toast";

interface UpdateMockExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshList: () => void;
    mockExam: any;
}

const UpdateMockExamModal: React.FC<UpdateMockExamModalProps> = ({ isOpen, onClose, refreshList, mockExam }) => {
    const { toast } = useToast();
    const [examName, setExamName] = useState<string>("");
    const [examDate, setExamDate] = useState<string>("");
    const [grade, setGrade] = useState<number>(0);
    const [type, setType] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);

    useEffect(() => {
        if (mockExam) {
            setExamName(mockExam.examName);
            setExamDate(mockExam.examDate);
            setGrade(mockExam.grade);
            setType(mockExam.type);
        }
    }, [mockExam]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setAudioFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {

            if (!file) {
                toast({ title: "Vui lòng chọn tệp Excel!", className: "text-white bg-red-500" });
                return;
            }
            const formData = new FormData();
            formData.append("examName", examName);
            formData.append("examDate", examDate);
            formData.append("grade", grade.toString());
            formData.append("type", type);
            formData.append("file", file);
            if (audioFile) formData.append("audioZip", audioFile); // Thêm tệp âm thanh vào formData

            const response = await API.put(`/mock-exam/update/${mockExam.mockExamId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                toast({
                    title: "Cập nhật thành công!",
                    description: "Thông tin kỳ thi giả lập đã được cập nhật.",
                    className: "text-white bg-green-500",
                });
                refreshList();
                onClose();
            }
        } catch (error) {
            console.error("Error updating mock exam:", error);
            toast({
                title: "Lỗi!",
                description: "Có lỗi xảy ra khi cập nhật kỳ thi giả lập.",
                className: "text-white bg-red-500",
            });
        }
    };

    const handleDownload = async (type: "excel" | "audio") => {
        if (!mockExam || !mockExam.mockExamId) {
            toast({
                title: "Lỗi!",
                description: "Không tìm thấy ID kỳ thi.",
                className: "text-white bg-red-500",
            });
            return;
        }

        const apiUrl = type === "excel"
            ? `/mock-exam/download-excel/${mockExam.mockExamId}`
            : `/mock-exam/download-audio/${mockExam.mockExamId}`;

        try {
            const response = await API.get(apiUrl, {
                responseType: "blob", // Nhận phản hồi dưới dạng file blob
            });

            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", type === "excel" ? `mockexam_${mockExam.mockExamId}.xlsx` : `audio_${mockExam.mockExamId}.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Error downloading file:", error);
            toast({
                title: "Lỗi!",
                description: `Không thể tải file ${type === "excel" ? "Excel" : "Audio"}.`,
                className: "text-white bg-red-500",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg">
                <DialogTitle>Cập nhật kỳ thi giả lập</DialogTitle>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tên kỳ thi</label>
                        <select
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                            required
                        >
                            <option value="" disabled>Chọn tên kỳ thi</option> {/* Option mặc định không thể chọn */}
                            <option value="Cấp Phường/Xã">Cấp Phường/Xã</option>
                            <option value="Cấp Quận/Huyện">Cấp Quận/Huyện</option>
                            <option value="Cấp Tỉnh/Thành phố">Cấp Tỉnh/Thành phố</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Ngày thi</label>
                        <input
                            type="date"
                            value={examDate}
                            onChange={(e) => setExamDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Khối</label>
                        <select
                            value={grade}
                            onChange={(e) => setGrade(Number(e.target.value))} // Chuyển đổi giá trị sang kiểu number
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                            required
                        >
                           <option value="" disabled>Chọn khối</option>
                            {[...Array(7)].map((_, index) => {
                                const gradeValue = index + 3; // Tạo các giá trị từ 3 đến 9
                                return (
                                    <option key={gradeValue} value={gradeValue}>
                                        {gradeValue}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Loại kỳ thi</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                            required
                        >
                            <option value="" disabled>Chọn loại kỳ thi</option> {/* Option mặc định không thể chọn */}
                            <option value="ward">Ward</option>
                            <option value="district">District</option>
                            <option value="province">Province</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tải lên file</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                        />
                        {file && (
                            <p className="text-sm text-green-600 mt-1">
                                📄 Đã chọn: {file.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tải lên file âm thanh (RAR/ZIP)</label>
                        <input
                            type="file"
                            onChange={handleAudioFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                            accept=".zip,.rar"
                        />
                        {audioFile && (
                            <p className="text-sm text-green-600 mt-1">
                                🎵 Đã chọn: {audioFile.name}
                            </p>
                        )}
                    </div>
                    {/* Nút tải file */}
                    <div className="flex space-x-2">
                        <Button type="button" className="bg-orange-500 hover:bg-blue-600 text-white px-4 py-2" onClick={() => handleDownload("excel")}>
                            📥 Tải Excel
                        </Button>
                        <Button type="button" className="bg-orange-500 hover:bg-purple-600 text-white px-4 py-2" onClick={() => handleDownload("audio")}>
                            🎵 Tải Audio
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 py-2">
                            Cập nhật
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" onClick={onClose} className="border text-black rounded-md px-4 py-2 hover:bg-gray-100">
                                Đóng
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateMockExamModal;
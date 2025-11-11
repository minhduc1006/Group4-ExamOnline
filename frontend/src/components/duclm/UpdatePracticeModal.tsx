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
        status: string;
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
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [status, setStatus] = useState(practice.status); // Thêm state cho status

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0] || null);
    };

    const handleAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAudioFile(event.target.files?.[0] || null);
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
        formData.append("status", status); // Gán giá trị status vào formData

        if (audioFile) {
            formData.append("audioZip", audioFile);
        }

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

    const handleDownload = async (type: "excel" | "audio") => {
        if (!practice || !practice.practiceId) {
            toast({
                title: "Lỗi!",
                description: "Không tìm thấy ID kỳ thi.",
                className: "text-white bg-red-500",
            });
            return;
        }

        const apiUrl = type === "excel"
            ? `/practice/download-excel/${practice.practiceId}`
            : `/practice/download-audio/${practice.practiceId}`;

        try {
            const response = await API.get(apiUrl, {
                responseType: "blob", // Nhận phản hồi dưới dạng file blob
            });

            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", type === "excel" ? `practice_${practice.practiceId}.xlsx` : `audio_${practice.practiceId}.zip`);
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
                    <div className="mb-4">
                        <label className="block mb-1">Khối</label>
                        <select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)} // Chuyển đổi giá trị sang kiểu number
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                            required
                        >
                            <option value="" disabled>Chọn khối</option> {/* Option mặc định không thể chọn */}
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

                    {/* Status */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Trạng thái</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                        >
                            <option value="on">Bật</option>
                            <option value="off">Tắt</option>
                        </select>
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

                    {/* Upload Audio RAR File */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tải lên file âm thanh (tùy chọn)</label>
                        <input
                            type="file"
                            accept=".zip,.rar"
                            onChange={handleAudioFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
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
"use client";

import React, { useState } from "react";
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
import { FaPlus } from "react-icons/fa"; // Import an icon for the modal title

interface AddPracticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshList: () => void; // Hàm cập nhật danh sách bài tự luyện
}

const AddPracticeModal: React.FC<AddPracticeModalProps> = ({ isOpen, onClose, refreshList }) => {
    const { toast } = useToast();
    const [practiceDate, setPracticeDate] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [practiceLevel, setPracticeLevel] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null); // New state for audio file
    const [status, setStatus] = useState<string>("on"); // Thêm state cho status

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0] || null);
    };

    const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            const response = await API.post("/practice/upload-practice", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                toast({
                    title: "Thành công!",
                    description: "Dữ liệu đã được lưu thành công.",
                    className: "text-white bg-green-500",
                });

                refreshList();
                onClose();
            }
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                toast({
                    title: "Dữ liệu đã tồn tại!",
                    description: "Bài tự luyện này đã có trong hệ thống.",
                    className: "text-white bg-orange-500",
                });
            } else {
                toast({
                    title: "Lỗi!",
                    description: "Có lỗi xảy ra khi lưu dữ liệu.",
                    className: "text-white bg-red-500",
                });
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg">
                <DialogTitle className="flex items-center">
                    <FaPlus className="mr-2" /> {/* Add icon here */}
                    Thêm bài tự luyện
                </DialogTitle>
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label className="block mb-1">Ngày</label>
                        <input
                            type="date"
                            value={practiceDate}
                            onChange={(e) => setPracticeDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Khối</label>
                        <select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                            required
                        >
                            <option value="">Chọn khối</option> {/* Option mặc định */}
                            {[...Array(7)].map((_, index) => {
                                const gradeValue = index + 3;
                                return (
                                    <option key={gradeValue} value={gradeValue}>
                                        {gradeValue}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Tự Luyện Vòng</label>
                        <input
                            type="text"
                            value={practiceLevel}
                            onChange={(e) => setPracticeLevel(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                        <label className="block mb-1">Trạng thái</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                        >
                            <option value="on">Bật</option>
                            <option value="off">Tắt</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Tải lên file Excel</label>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                            required
                        />
                        {file && (
                            <p className="text-sm text-green-600 mt-1">
                                📄 Đã chọn: {file.name}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Tải lên file âm thanh (tùy chọn)</label>
                        <input
                            type="file"
                            accept=".zip,.rar"
                            onChange={handleAudioChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-orange-500"
                        />
                        {audioFile && (
                            <p className="text-sm text-green-600 mt-1">
                                🎵 Đã chọn: {audioFile.name}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit"
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md">
                            Thêm bài tự luyện
                        </Button>
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
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddPracticeModal;
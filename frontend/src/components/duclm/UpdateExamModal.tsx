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

interface UpdateExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshList: () => void;
    exam: any;
}

const UpdateExamModal: React.FC<UpdateExamModalProps> = ({ isOpen, onClose, refreshList, exam }) => {
    const { toast } = useToast();
    const [examName, setExamName] = useState<string>("");
    const [examStart, setExamStart] = useState<string>("");
    const [examEnd, setExamEnd] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [status, setStatus] = useState<string>("on"); // Đặt trạng thái mặc định là "on"
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (exam) {
            setExamName(exam.examName);
            setExamStart(exam.examStart);
            setExamEnd(exam.examEnd);
            setGrade(exam.grade);
            setStatus(exam.status); // Đảm bảo trạng thái được lấy từ exam
        }
    }, [exam]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append("examName", examName);
            formData.append("examStart", examStart);
            formData.append("examEnd", examEnd);
            formData.append("grade", grade);
            formData.append("status", status);
            
            if (file) formData.append("file", file);
    
            const response = await API.put(`/exam/update/${exam.examId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            if (response.status === 200) {
                toast({
                    title: "Cập nhật thành công!",
                    description: "Thông tin kỳ thi đã được cập nhật.",
                    className: "text-white bg-green-500",
                });
                refreshList();
                onClose();
            }
        } catch (error) {
            console.error("Error updating exam:", error); // Ghi lại lỗi
            toast({
                title: "Lỗi!",
                description: "Có lỗi xảy ra khi cập nhật kỳ thi.",
                className: "text-white bg-red-500",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg">
                <DialogTitle>Cập nhật kỳ thi</DialogTitle>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tên kỳ thi</label>
                        <input 
                            type="text" 
                            value={examName} 
                            onChange={(e) => setExamName(e.target.value)}
                            className="border rounded p-2 w-full focus:outline-orange-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Ngày bắt đầu</label>
                        <input 
                            type="datetime-local" 
                            value={examStart} 
                            onChange={(e) => setExamStart(e.target.value)}
                            className="border rounded p-2 w-full focus:outline-orange-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Ngày kết thúc</label>
                        <input 
                            type="datetime-local" 
                            value={examEnd} 
                            onChange={(e) => setExamEnd(e.target.value)}
                            className="border rounded p-2 w-full focus:outline-orange-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Khối</label>
                        <input 
                            type="text" 
                            value={grade} 
                            onChange={(e) => setGrade(e.target.value)}
                            className="border rounded p-2 w-full focus:outline-orange-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tải lên file</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="border rounded p-2 w-full focus:outline-orange-500" 
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="mr-2">Trạng thái:</label>
                        <input 
                            type="checkbox" 
                            checked={status === "on"} 
                            onChange={(e) => setStatus(e.target.checked ? "on" : "off")}
                            className="w-5 h-5" 
                        />
                        <span className="ml-2">{status === "on" ? "On" : "Off"}</span>
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

export default UpdateExamModal;
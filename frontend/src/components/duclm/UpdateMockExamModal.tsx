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
    const [status, setStatus] = useState<string>("on");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (mockExam) {
            setExamName(mockExam.examName);
            setExamDate(mockExam.examDate);
            setGrade(mockExam.grade);
            setType(mockExam.type);
            setStatus(mockExam.status);
        }
    }, [mockExam]);

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
            formData.append("examDate", examDate);
            formData.append("grade", grade.toString());
            formData.append("type", type);
            formData.append("status", status);
            
            if (file) formData.append("file", file);
    
            const response = await API.put(`/mock-exam/update/${mockExam.examId}`, formData, {
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg">
                <DialogTitle>Cập nhật kỳ thi giả lập</DialogTitle>
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
                        <label className="block text-gray-700 font-medium mb-1">Ngày thi</label>
                        <input 
                            type="datetime-local" 
                            value={examDate} 
                            onChange={(e) => setExamDate(e.target.value)}
                            className="border rounded p-2 w-full focus:outline-orange-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Khối</label>
                        <input 
                            type="number" 
                            value={grade} 
                            onChange={(e) => setGrade(Number(e.target.value))}
                            className="border rounded p-2 w-full focus:outline-orange-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Loại kỳ thi</label>
                        <input 
                            type="text" 
                            value={type} 
                            onChange={(e) => setType(e.target.value)}
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

export default UpdateMockExamModal;
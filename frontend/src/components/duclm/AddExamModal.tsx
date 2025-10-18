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

interface AddExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshList: () => void;
}

const AddExamModal: React.FC<AddExamModalProps> = ({ isOpen, onClose, refreshList }) => {
    const { toast } = useToast();
    const [examName, setExamName] = useState<string>("");
    const [examStart, setExamStart] = useState<string>("");
    const [examEnd, setExamEnd] = useState<string>("");
    const [grade, setGrade] = useState<string>("");
    const [status, setStatus] = useState<string>("on"); // Đặt trạng thái mặc định là "on"
    const [file, setFile] = useState<File | null>(null);

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
            formData.append("status", status); // Gửi trạng thái dưới dạng chuỗi "on" hoặc "off"
            if (file) formData.append("file", file);

            const response = await API.post("/exam/upload-exam", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                toast({
                    title: "Thành công!",
                    description: "Đã thêm kỳ thi mới.",
                    className: "text-white bg-green-500",
                });

                refreshList();
                onClose();
            }
        } catch (error) {
            toast({
                title: "Lỗi!",
                description: "Không thể thêm kỳ thi.",
                className: "text-white bg-red-500",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg">
                <DialogTitle>Thêm kỳ thi</DialogTitle>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block mb-1">Tên kỳ thi</label>
                        <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)}
                            className="border rounded p-2 w-full" required />
                    </div>
                    <div>
                        <label className="block mb-1">Ngày bắt đầu</label>
                        <input type="datetime-local" value={examStart} onChange={(e) => setExamStart(e.target.value)}
                            className="border rounded p-2 w-full" required />
                    </div>
                    <div>
                        <label className="block mb-1">Ngày kết thúc</label>
                        <input type="datetime-local" value={examEnd} onChange={(e) => setExamEnd(e.target.value)}
                            className="border rounded p-2 w-full" required />
                    </div>
                    <div>
                        <label className="block mb-1">Khối</label>
                        <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)}
                            className="border rounded p-2 w-full" required />
                    </div>
                    <div>
                        <label className="block mb-1">Tải lên file</label>
                        <input type="file" onChange={handleFileChange} className="w-full border rounded p-2" />
                    </div>
                    <div className="flex items-center">
                        <label className="mr-2">Trạng thái:</label>
                        <input type="checkbox" checked={status === "on"} onChange={(e) => setStatus(e.target.checked ? "on" : "off")}
                            className="w-5 h-5" />
                        <span className="ml-2">{status === "on" ? "On" : "Off"}</span>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 py-2">
                            Thêm kỳ thi
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

export default AddExamModal;
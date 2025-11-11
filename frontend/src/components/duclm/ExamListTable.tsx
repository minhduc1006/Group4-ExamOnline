"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ExamDataTable } from "./ExamDataTable";
import { ColumnDef } from "@tanstack/react-table";
import Pagination from "../longnt/articles/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/helper/axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import UpdateExamModal from "./UpdateExamModal";
import AddExamModal from "./AddExamModal";
import ExamDetailModal from "./ExamDetailModal"; // Import modal chi tiết
import { PlusCircle } from "lucide-react";

interface Exam {
    examId: number;
    examName: string;
    examStart: string;
    examEnd: string;
    grade: string; 
    status: string; 
    questions: QuestionDetail[]; // Thêm trường questions
}

interface QuestionDetail {
    question: {
        questionText: string;
        choice1: string;
        choice2: string;
        choice3: string;
        choice4: string;
    };
    answer: {
        correctAnswer: string;
    };
}

const ExamListTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exams, setExams] = useState<Exam[]>([]);
    const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [filterType, setFilterType] = useState<string>("grade");
    const [filterValue, setFilterValue] = useState<string>("");
    const [searchParam, setSearchParam] = useState<string>("");
    const [selectedExam, setSelectedExam] = useState<any | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10;

    const fetchExams = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await API.get(`/exam/get-all?page=${page}&size=${pageSize}`);
            const formattedData = data.exams.map((exam: any) => ({
                examId: exam.examId,
                examName: exam.examName,
                examStart: exam.examStart,
                examEnd: exam.examEnd,
                grade: exam.grade,
                status: exam.status,
                questions: exam.questions || [], // Đảm bảo có trường questions
            }));

            setExams(formattedData);
            setFilteredExams(formattedData);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            toast({
                title: "Lỗi khi lấy dữ liệu kỳ thi!",
                description: "Vui lòng kiểm tra lại kết nối.",
                className: "text-white bg-red-500",
            });
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, toast]);

    useEffect(() => {
        fetchExams();
    }, [page, fetchExams]);

    const handleSearch = () => {
        if (!filterValue.trim()) {
            setFilteredExams(exams);
            return;
        }

        const filtered = exams.filter((exam) => {
            const value = filterType === "grade" ? exam.grade : exam.examName;
            return value.toString().includes(filterValue);
        });

        if (filtered.length === 0) {
            toast({
                title: "Không tìm thấy kết quả!",
                description: "Không có kỳ thi nào phù hợp.",
                className: "text-white bg-yellow-500",
            });
        }

        setFilteredExams(filtered);
    };

    const handleUpdate = (exam: Exam) => {
        setSelectedExam(exam);
        setIsUpdateModalOpen(true);
    };

    const handleDetail = async (exam: Exam) => {
        try {
            const { data } = await API.get(`/exam/get-detail/${exam.examId}`);
            setSelectedExam(data);
            setIsDetailModalOpen(true);
        } catch (error) {
            toast({
                title: "Lỗi khi lấy chi tiết kỳ thi!",
                description: "Không thể lấy thông tin chi tiết, vui lòng thử lại.",
                className: "text-white bg-red-500",
            });
        }
    };

    const handleDelete = async (examId: number) => {
        try {
            await API.delete(`/exam/delete/${examId}`);
            toast({
                title: "Xóa thành công!",
                description: "Kỳ thi đã được xóa.",
                className: "text-white bg-green-500",
            });
            fetchExams(); // Cập nhật lại danh sách kỳ thi
        } catch (error) {
            toast({
                title: "Lỗi khi xóa kỳ thi!",
                description: "Không thể xóa kỳ thi, vui lòng thử lại.",
                className: "text-white bg-red-500",
            });
        }
    };

    const examColumns: ColumnDef<Exam>[] = [
        {
            accessorKey: "examName",
            header: "Tên kỳ thi",
        },
        {
            accessorKey: "grade",
            header: "Khối",
        },
        {
            accessorKey: "examStart",
            header: "Thời gian bắt đầu",
            cell: ({ row }) => new Date(row.original.examStart).toLocaleString("en-GB"),
        },
        {
            accessorKey: "examEnd",
            header: "Thời gian kết thúc",
            cell: ({ row }) => new Date(row.original.examEnd).toLocaleString("en-GB"),
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => (row.original.status === "on" ? "Đang hoạt động" : "Ngừng hoạt động"),
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                        onClick={() => handleDelete(row.original.examId)}
                    >
                        Xóa
                    </Button>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                        onClick={() => handleUpdate(row.original)}
                    >
                        Cập nhật
                    </Button>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                        onClick={() => handleDetail(row.original)}
                    >
                        Xem chi tiết
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="py-10">
            <Button
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                onClick={() => setIsModalOpen(true)}
            >
                <PlusCircle size={20} />
                Thêm kỳ thi
            </Button>
            <div className="my-5 flex justify-between items-center">
                <div className="flex gap-4">
                    <select
                        value={filterType}
                        onChange={(event) => setFilterType(event.target.value)}
                        className="p-2 border border-gray-300 rounded-sm"
                    >
                        <option value="grade">Lọc theo Khối</option>
                        <option value="examName">Lọc theo Tên kỳ thi</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Nhập dữ liệu..."
                        value={filterValue}
                        onChange={(event) => setFilterValue(event.target.value)}
                        className="p-2 max-w-sm border border-gray-300 rounded-sm"
                    />
                    <Button
                        type="button"
                        onClick={handleSearch}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                    >
                        Tìm kiếm
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div>Đang tải...</div>
            ) : (
                <>
                    <ExamDataTable
                        data={filteredExams.length > 0 ? filteredExams : exams}
                        columns={examColumns}
                        searchParam={[searchParam]}
                        fetchData={fetchExams}
                        setSearchParam={setSearchParam}
                    />
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => {
                            if (newPage < 1 || newPage > totalPages) return;
                            const newParams = new URLSearchParams(searchParams.toString());
                            newParams.set("page", newPage.toString());
                            router.push(`?${newParams.toString()}`);
                        }}
                    />
                </>
            )}

            <AddExamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                refreshList={fetchExams}
            />
            <UpdateExamModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                exam={selectedExam}
                refreshList={fetchExams}
            />
            {selectedExam && (
                <ExamDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    exam={selectedExam} // Đảm bảo truyền đúng prop
                />
            )}
        </div>
    );
};

export default ExamListTable;
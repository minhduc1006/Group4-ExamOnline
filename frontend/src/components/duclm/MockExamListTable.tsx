"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MockExamDataTable } from "./MockExamDataTable";
import { ColumnDef } from "@tanstack/react-table";
import Pagination from "../longnt/articles/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/helper/axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import UpdateMockExamModal from "./UpdateMockExamModal";
import AddMockExamModal from "./AddMockExamModal";
import MockExamDetailModal from "./MockExamDetailModal";
import { PlusCircle } from "lucide-react";

interface MockExam {
    mockExamId: number;
    examName: string;
    examDate: string;
    grade: string;
    type: string;
}

const MockExamListTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mockExams, setMockExams] = useState<MockExam[]>([]);
    const [filteredMockExams, setFilteredMockExams] = useState<MockExam[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [filterType, setFilterType] = useState<string>("grade");
    const [filterValue, setFilterValue] = useState<string>("");
    const [selectedMockExam, setSelectedMockExam] = useState<any | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10;

    const fetchMockExams = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await API.get(`/mock-exam/get-all?page=${page}&size=${pageSize}`);
            const formattedData = data.mockExams.map((mockExam: any) => ({
                mockExamId: mockExam.mockExamId,
                examName: mockExam.examName,
                examDate: mockExam.examDate,
                grade: mockExam.grade,
                type: mockExam.type,
            }));

            setMockExams(formattedData);
            setFilteredMockExams(formattedData);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            toast({
                title: "Lỗi khi lấy dữ liệu kỳ thi giả lập!",
                description: "Vui lòng kiểm tra lại kết nối.",
                className: "text-white bg-red-500",
            });
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, toast]);

    useEffect(() => {
        fetchMockExams();
    }, [page, fetchMockExams]);

    const handleSearch = () => {
        if (!filterValue.trim()) {
            setFilteredMockExams(mockExams);
            return;
        }

        const filtered = mockExams.filter((mockExam) => {
            const value = filterType === "grade" ? mockExam.grade : mockExam.examName;
            return value.includes(filterValue);
        });

        if (filtered.length === 0) {
            toast({
                title: "Không tìm thấy kết quả!",
                description: "Không có kỳ thi giả lập nào phù hợp.",
                className: "text-white bg-yellow-500",
            });
        }

        setFilteredMockExams(filtered);
    };

    const handleUpdate = (mockExam: MockExam) => {
        setSelectedMockExam(mockExam);
        setIsUpdateModalOpen(true);
    };

    const handleDetail = async (mockExam: MockExam) => {
        try {
            const { data } = await API.get(`/mock-exam/get-detail/${mockExam.mockExamId}`);
            setSelectedMockExam(data);
            setIsDetailModalOpen(true);
        } catch (error) {
            toast({
                title: "Lỗi khi lấy chi tiết kỳ thi giả lập!",
                description: "Không thể lấy thông tin chi tiết, vui lòng thử lại.",
                className: "text-white bg-red-500",
            });
        }
    };

    const handleDelete = async (mockExamId: number) => {
        try {
            await API.delete(`/mock-exam/delete/${mockExamId}`);
            toast({
                title: "Xóa thành công!",
                description: "Kỳ thi giả lập đã được xóa.",
                className: "text-white bg-green-500",
            });
            fetchMockExams();
        } catch (error) {
            toast({
                title: "Lỗi khi xóa kỳ thi giả lập!",
                description: "Không thể xóa kỳ thi, vui lòng thử lại.",
                className: "text-white bg-red-500",
            });
        }
    };

    const mockExamColumns: ColumnDef<MockExam>[] = [
        {
            accessorKey: "examName",
            header: "Tên kỳ thi thử",
        },
        {
            accessorKey: "grade",
            header: "Khối",
        },
        {
            accessorKey: "examDate",
            header: "Ngày mở",
            cell: ({ row }) => new Date(row.original.examDate).toLocaleDateString("en-GB"),
        },
        {
            accessorKey: "type",
            header: "Loại kỳ thi",
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                        onClick={() => handleDelete(row.original.mockExamId)}
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
                Thêm kỳ thi giả lập
            </Button>
            <div className="my-5 flex justify-between items-center">
                <div className="flex gap-4">
                    <select
                        value={filterType}
                        onChange={(event) => setFilterType(event.target.value)}
                        className="p-2 border border-gray-300 rounded-sm"
                    >
                        <option value="grade">Lọc theo Khối</option>
                        <option value="examName">Lọc theo Tên kỳ thi giả lập</option>
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
                    <MockExamDataTable
                        data={filteredMockExams.length > 0 ? filteredMockExams : mockExams}
                        columns={mockExamColumns}
                        searchParam={[...Array(totalPages).keys()].map(i => (i + 1).toString())} // Example of generating searchParams
                        fetchData={fetchMockExams}
                        setSearchParam={setFilterValue} // Adjust as necessary
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

            <AddMockExamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                refreshList={fetchMockExams}
            />
            <UpdateMockExamModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                mockExam={selectedMockExam}
                refreshList={fetchMockExams}
            />
            {selectedMockExam && (
                <MockExamDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    mockExam={selectedMockExam}
                />
            )}
        </div>
    );
};

export default MockExamListTable;
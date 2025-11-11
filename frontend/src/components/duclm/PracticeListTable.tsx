"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PracticeDataTable } from "./PracticeDataTable";
import { ColumnDef } from "@tanstack/react-table";
import Pagination from "../longnt/articles/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/helper/axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import UpdatePracticeModal from "./UpdatePracticeModal";
import AddPracticeModal from "./AddPracticeModal";
import PracticeDetailModal from "./PracticeDetailModal"; // Import modal chi tiết
import { PlusCircle } from "lucide-react";

interface Practice {
    practiceId: number;
    practiceLevel: number;
    practiceDate: string;
    status: string;
    grade: number;
}

const PracticeListTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [practices, setPractices] = useState<Practice[]>([]);
    const [filteredPractices, setFilteredPractices] = useState<Practice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [filterType, setFilterType] = useState<string>("grade");
    const [filterValue, setFilterValue] = useState<string>("");
    const [searchParam, setSearchParam] = useState<string>("");
    const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [selectedPracticeDetail, setSelectedPracticeDetail] = useState<any>(null);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10;

    const fetchPractices = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await API.get(`/practice/get-all?page=${page}&size=${pageSize}`);
            const formattedData = data.practices.map((practice: any) => ({
                practiceId: practice.practiceId,
                practiceLevel: practice.practiceLevel,
                practiceDate: practice.practiceDate,
                grade: practice.grade,
                status: practice.status,
            }));

            setPractices(formattedData);
            setFilteredPractices(formattedData);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            toast({
                title: "Lỗi khi lấy dữ liệu thực hành!",
                description: "Vui lòng kiểm tra lại kết nối.",
                className: "text-white bg-red-500",
            });
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, toast]);

    useEffect(() => {
        fetchPractices();
    }, [page, fetchPractices]);

    const handleSearch = () => {
        if (!filterValue.trim()) {
            setFilteredPractices(practices);
            return;
        }

        const filtered = practices.filter((practice) => {
            const value = filterType === "grade" ? practice.grade : practice.practiceLevel;
            return value.toString().includes(filterValue);
        });

        if (filtered.length === 0) {
            toast({
                title: "Không tìm thấy kết quả!",
                description: "Không có bài thực hành nào phù hợp.",
                className: "text-white bg-yellow-500",
            });
        }

        setFilteredPractices(filtered);
    };

    const handleDelete = async (practiceId: number) => {
        try {
            await API.delete(`/practice/delete/${practiceId}`);
            toast({
                title: "Xóa thành công!",
                description: "Bài thực hành đã được xóa.",
                className: "text-white bg-green-500",
            });
            fetchPractices();
        } catch (error) {
            toast({
                title: "Lỗi khi xóa bài thực hành!",
                description: "Không thể xóa bài thực hành, vui lòng thử lại.",
                className: "text-white bg-red-500",
            });
        }
    };

    const handleUpdate = (practice: Practice) => {
        setSelectedPractice(practice);
        setIsUpdateModalOpen(true);
    };

    const handleDetail = async (practiceId: number) => {
        try {
            const { data } = await API.get(`/practice/get-detail/${practiceId}`);
            setSelectedPracticeDetail(data); // data phải có cấu trúc phù hợp
            setIsDetailModalOpen(true);
        } catch (error) {
            toast({
                title: "Lỗi khi lấy chi tiết bài thực hành!",
                description: "Vui lòng kiểm tra lại kết nối.",
                className: "text-white bg-red-500",
            });
        }
    };

    const practiceColumns: ColumnDef<Practice>[] = [
        {
            accessorKey: "practiceLevel",
            header: "Vòng tự luyện",
        },
        {
            accessorKey: "grade",
            header: "Khối",
        },
        {
            accessorKey: "practiceDate",
            header: "Ngày",
            cell: ({ row }) => {
                const date = row.original.practiceDate;
                if (!date) return "";
                return new Date(date).toLocaleDateString("en-GB");
            },
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                        onClick={() => handleDelete(row.original.practiceId)}
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
                        onClick={() => handleDetail(row.original.practiceId)}
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
                Thêm bài tự luyện
            </Button>
            <div className="my-5 flex justify-between items-center">
                <div className="flex gap-4">
                    <select
                        value={filterType}
                        onChange={(event) => setFilterType(event.target.value)}
                        className="p-2 border border-gray-300 rounded-sm"
                    >
                        <option value="grade">Lọc theo Khối</option>
                        <option value="practiceLevel">Lọc theo Vòng tự luyện</option>
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
                    <PracticeDataTable
                        data={filteredPractices.length > 0 ? filteredPractices : practices}
                        columns={practiceColumns}
                        searchParam={[searchParam]}
                        fetchData={fetchPractices}
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

            {selectedPractice && (
                <UpdatePracticeModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    practice={selectedPractice}
                    refreshList={() => fetchPractices()}
                />
            )}

            {selectedPracticeDetail && (
                <PracticeDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    grade={selectedPracticeDetail.practice.grade}
                    practiceLevel={selectedPracticeDetail.practice.practiceLevel}
                    practiceDate={selectedPracticeDetail.practice.practiceDate}
                    status={selectedPracticeDetail.practice.status}
                    practiceDetails={selectedPracticeDetail.practiceDetails}
                />
            )}

            <AddPracticeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                refreshList={fetchPractices}
            />
        </div>
    );
};

export default PracticeListTable;
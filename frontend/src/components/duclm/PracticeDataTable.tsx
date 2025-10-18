"use client";

import React, { useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Practice {
    practiceId: number;
    practiceLevel: number;
    practiceDate: string;
    grade: number;
}

interface PracticeDataTableProps<TData extends { practiceId: number }, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchParam: string[];
    fetchData: () => void;
    setSearchParam: (title: string) => void;
}

export function PracticeDataTable<TData extends { practiceId: number }, TValue>({
    columns,
    data,
    searchParam,
    fetchData,
    setSearchParam,
}: PracticeDataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const [filterType, setFilterType] = useState<string>("grade");
    const [filterValue, setFilterValue] = useState<string>("");

    const handleFilterChange = () => {
        setSearchParam(filterValue);
    };

    return (
        <>
            {/* Table Section */}
            <div className="rounded-md border flex w-full">
                <Table className="w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                <TableHead className="text-left">#</TableHead>
                                {headerGroup.headers.map((header) => (
                                    <TableHead className="text-left" key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.original.practiceId}>
                                    <TableCell className="text-left">{row.index + 1}</TableCell>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell className="text-left" key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="text-center">
                                    No practices found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
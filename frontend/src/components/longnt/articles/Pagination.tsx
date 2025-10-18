"use client";
import React, { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageButtons = () => {
    let buttons = [];
    let startPage = Math.max(currentPage - 2, 1); // Display 2 pages before current page
    let endPage = Math.min(currentPage + 2, totalPages); // Display 2 pages after current page

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages); // Show first 5 pages if currentPage is 1, 2, or 3
    }

    if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 4, 1); // Show last 5 pages if near end
    }

    // Adding "Previous" page range
    if (startPage > 1) {
      buttons.push(
        <button
          key="start-ellipsis"
          className="px-3 py-1 border rounded hover:bg-gray-200"
          onClick={() => onPageChange(1)}
        >
          {"<<"}
        </button>
      );
      buttons.push(
        <button
          key="previous"
          className="px-3 py-1 border rounded hover:bg-gray-200"
          onClick={() => onPageChange(currentPage - 1)}
        >
          {"<"}
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 border rounded ${
            currentPage === i ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    // Adding "Next" page range
    if (endPage < totalPages) {
      buttons.push(
        <button
          key="next"
          className="px-3 py-1 border rounded hover:bg-gray-200"
          onClick={() => onPageChange(currentPage + 1)}
        >
          {">"}
        </button>
      );
      buttons.push(
        <button
          key="end-ellipsis"
          className="px-3 py-1 border rounded hover:bg-gray-200"
          onClick={() => onPageChange(totalPages)}
        >
          {">>"}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {renderPageButtons()}
    </div>
  );
};

export default Pagination;

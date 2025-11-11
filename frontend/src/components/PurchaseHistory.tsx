"use client";
import { API } from "@/helper/axios";
import { useEffect, useState } from "react";

interface PurchaseHistoryResponse {
  accountType: string;
  vnp_TxnRef: string;
  vnp_BankTranNo: string;
  vnp_TransactionNo: string;
  completedAt: string; // LocalDateTime được biểu diễn dưới dạng string ISO 8601
  amount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const PurchaseHistory = ({ user }: any) => {
  const [purchaseHistoryList, setPurchaseHistoryList] = useState<
    PurchaseHistoryResponse[]
  >([]);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      const response = await API.get(`/payment/purchase-history`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data) {
        setPurchaseHistoryList(response.data);
      }
    };

    fetchPurchaseHistory();
  }, []);

  return (
    <div className="w-full flex flex-col gap-7 border rounded-sm">
      <div className="overflow-x-auto rounded-lg bg-white">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-center">Thời gian giao dịch</th>
              <th className="px-6 py-3 text-center">Gói mua</th>
              <th className="px-6 py-3 text-center">Tổng tiền</th>
              <th className="px-6 py-3 text-center">Mã giao dịch ngân hàng</th>
              <th className="px-6 py-3 text-center">Mã giao dịch VNPAY</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {purchaseHistoryList.length > 0 ? (
              purchaseHistoryList.map((result) => (
                <tr
                  key={result.vnp_TxnRef}
                  className="bg-white hover:bg-gray-50"
                >
                  <td className="px-6 py-3 text-center">
                    {new Date(result.completedAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {result.accountType}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {result.amount.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-3 text-center">
                    {result.vnp_BankTranNo}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {result.vnp_TransactionNo}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseHistory;

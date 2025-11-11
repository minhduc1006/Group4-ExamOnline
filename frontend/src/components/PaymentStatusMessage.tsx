"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentStatusMessage = () => {
  const param = useSearchParams();
  const success = param.get("vnp_ResponseCode");
  const vnp_TxnRef = param.get("vnp_TxnRef");
  const vnp_BankTranNo = param.get("vnp_BankTranNo");
  const vnp_TransactionNo = param.get("vnp_TransactionNo");
  const completedAt = param.get("vnp_PayDate") || "";
  const [message, setMessage] = useState<string>("");

  const normalizeDateTime = (time: string): string => {
    const year = time.substring(0, 4);
    const month = time.substring(4, 6);
    const day = time.substring(6, 8);
    const hour = time.substring(8, 10);
    const minute = time.substring(10, 12);
    const second = time.substring(12, 14);

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  };

  const updateBill = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/success`,
        {
          completedAt: normalizeDateTime(completedAt),
          vnp_TxnRef: vnp_TxnRef,
          vnp_BankTranNo: vnp_BankTranNo,
          vnp_TransactionNo: vnp_TransactionNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Thanh toán thành công");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setMessage(
        "Lỗi hệ thống, vui lòng liên hệ trực tiếp qua số điện thoại hoặc gửi phiếu yêu cầu để được hỗ trợ sớm nhất"
      );
    }
  };

  useEffect(() => {
    if (success == "00") {
      updateBill();
    } else {
      setMessage("Thanh toán thất bại");
    }
  }, []);

  return <div>{message}</div>;
};

export default PaymentStatusMessage;

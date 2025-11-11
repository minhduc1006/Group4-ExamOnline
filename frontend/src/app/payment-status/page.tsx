import { Metadata } from "next";
import LogoIcon from "@/components/LogoIcon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PaymentStatusMessage from "../../components/PaymentStatusMessage";

export const metadata: Metadata = {
  title: "Payment Status",
};

const PaymentStatus = () => {
  return (
    <div className="flex flex-col items-center px-10 py-10 max-w-3xl w-full rounded-lg dark bg-white lg:p-5 bg-opacity-55 backdrop-blur-lg">
      <div>
        <LogoIcon />
      </div>

      <PaymentStatusMessage />

      <div className="mt-5">
        <Link href={"/"}>
          <Button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-500 hover:scale-105 transition-all duration-300 ease-in-out">
            Trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentStatus;

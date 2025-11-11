import SendFeedbackForm from "@/components/SendFeedbackForm";
import SendSupportRequestForm from "@/components/SendSupportRequestForm";
import Link from "next/link";
import ButtonFeedbackScroll from "@/components/ButtonFeedbackScroll";

const SendSupportRequest = () => {

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center drop-shadow-sm">
        <div className="w-[1050px] mt-10">
          <div className="">
            <div className="text-[20px] text-[#000000] font-medium">
              Gửi phiếu hỗ trợ
            </div>
            <div className="text-sm custom-links text-[#505050]">
              <Link href={"/"}>Trang chủ</Link>
              <Link href={"/support"}>Hỗ trợ</Link>
              <a href={"#"}>Gửi phiếu hỗ trợ</a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen flex justify-center items-center">
        <div className="w-[1150px] flex my-10">
          <div className="w-[70%] flex flex-col gap-10">
            <div className="bg-slate-200 rounded-lg shadow-sm w-full">
              <div className="bg-slate-300 py-3 px-5 rounded-t-lg text-[20px] font-bold">
                Thông Tin Yêu Cầu
              </div>
              <SendSupportRequestForm />
            </div>
            <div
              className="bg-slate-200 rounded-lg shadow-sm w-full"
            >
              <div className="bg-slate-300 py-3 px-5 rounded-t-lg text-[20px] font-bold">
                Gửi Feedback
              </div>
              <SendFeedbackForm />
            </div>
          </div>
          <div className="w-[30%] p-5">
            <div className="text-red-500 italic">
              <span className="font-bold">Lưu ý: </span>Mỗi tài khoản cần hỗ trợ
              chỉ gửi 1 PHIẾU DUY NHẤT để yêu cầu hỗ trợ KHÔNG gửi bằng nhiều
              tài khoản khác nhau để tránh xảy ra nhiều luồng tranh chấp tài
              khoản, dẫn đến việc tài khoản bị xử lý chậm các bạn nhé!
            </div>
            <div className="mt-5">
              <ButtonFeedbackScroll />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendSupportRequest;

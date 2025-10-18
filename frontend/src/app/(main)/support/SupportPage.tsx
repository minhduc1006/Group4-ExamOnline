"use client";
import Link from "next/link";
import { BookOpen, FilePlus, Send, ClipboardList, Inbox } from "lucide-react";
import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";

const SupportPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const sendSupportPage = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
    router.push("/support/send-support-request");
  };

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center drop-shadow-sm">
        <div className="w-[1050px] mt-10">
          <div className="">
            <div className="text-[20px] text-[#000000] font-medium">Hỗ trợ</div>
            <div className="text-sm custom-links text-[#505050]">
              <Link href={"/"}>Trang chủ</Link>
              <a href={"#"}>Hỗ trợ</a>
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative w-full h-[300px] bg-cover bg-center"
        style={{
          backgroundImage: "url(/home/background.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-10 w-full">
          <div className="w-[1050] flex justify-between text-[20px] pt-8 text-white font-bold">
            <div className="flex flex-col items-center justify-start gap-5">
              <BookOpen color="currentColor" size={50} />
              <p>1</p>
              <p>Tra cứu FAQ</p>
            </div>
            <div className="flex flex-col items-center justify-start gap-5">
              <FilePlus color="currentColor" size={50} />
              <p>2</p>
              <p>Tạo phiếu yêu cầu</p>
            </div>
            <div className="flex flex-col items-center justify-start gap-5">
              <Send color="currentColor" size={50} />
              <p>3</p>
              <p>Gửi phiếu</p>
            </div>
            <div className="flex flex-col items-center justify-start gap-5">
              <ClipboardList color="currentColor" size={50} />
              <p>4</p>
              <p>Theo dõi phiếu</p>
            </div>
            <div className="flex flex-col items-center justify-start gap-5">
              <Inbox color="currentColor" size={50} />
              <p>5</p>
              <p>Nhận kết quả</p>
            </div>
          </div>
          <div className="w-[1050] flex justify-end mt-8">
            {!isLoading && isAuthenticated && (
              <Link href={"/support"}>
                <button className="bg-orange-500 shadow-lg rounded-lg p-2 font-bold text-white border border-white hover:bg-white hover:text-black hover:scale-205 transition-all duration-300 ease-in-out">
                  Xem phiếu đã gửi
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="w-[1270px] h-[300px] ">
        <div className="p-5 h-full grid grid-cols-4">
          <div className="  p-4  text-black">
            <div className="h-full w-full bg-[#F5BA3A] shadow-xl rounded-lg p-4">
              <div className="h-[70px] flex items-start text-center justify-center pt-2 text-xl font-bold">
                HỖ TRỢ TÀI KHOẢN
              </div>
              <div className="flex h-[70px] text-center">
                Giải đáp các câu hỏi về thông tin tài khoản, mật khẩu
              </div>
              <div className="flex justify-center">
                <Link href={"/support/account-support"}>
                  <button className="bg-orange-500 shadow-lg rounded-lg p-2 font-bold text-white border border-white hover:bg-white hover:text-black hover:scale-205 transition-all duration-300 ease-in-out">
                    Xem ngay
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="  p-4  text-black">
            <div className="h-full w-full bg-[#F5BA3A] shadow-xl rounded-lg p-4">
              <div className="h-[70px] flex items-start text-center pt-2 text-xl justify-center font-bold">
                HỖ TRỢ MUA GÓI DỊCH VỤ
              </div>
              <div className="flex h-[70px] text-center justify-center">
                Giải đáp câu hỏi về mua gói
              </div>
              <div className="flex justify-center">
                <Link href={"/support"}>
                  <button className="bg-orange-500 shadow-lg rounded-lg p-2 font-bold text-white border border-white hover:bg-white hover:text-black hover:scale-205 transition-all duration-300 ease-in-out">
                    Xem ngay
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="  p-4  text-black">
            <div className="h-full w-full bg-[#F5BA3A] shadow-xl rounded-lg p-4">
              <div className="h-[70px] flex items-start text-center justify-center pt-2 text-xl font-bold">
                HỖ TRỢ HỌC - THI
              </div>
              <div className="flex h-[70px] text-center">
                Giải đáp câu hỏi về chương trình học - thi
              </div>
              <div className="flex justify-center">
                <Link href={"/support"}>
                  <button className="bg-orange-500 shadow-lg rounded-lg p-2 font-bold border border-white text-white hover:bg-white hover:text-black hover:scale-205 transition-all duration-300 ease-in-out">
                    Xem ngay
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="  p-4  text-black">
            <div className="h-full w-full bg-[#F5BA3A] shadow-xl rounded-lg p-4">
              <div className="h-[70px] flex items-start text-center justify-center pt-2 text-xl font-bold">
                GỬI PHIẾU HỖ TRỢ - FEEDBACK
              </div>
              <div className="flex h-[70px] text-center">
                Gửi phiếu hỗ trợ vể vấn đề của bạn hoặc gửi feedback
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => sendSupportPage()}
                  className="bg-orange-500 shadow-lg rounded-lg p-2 border border-white font-bold text-white hover:bg-white hover:text-black hover:scale-205 transition-all duration-300 ease-in-out"
                >
                  Xem ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SupportPage;

import LogoIcon from "./LogoIcon";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="h-[170px] bg-[#F8AD2D] text-center align-middle flex justify-center text-sm text-black shadow-xl">
        <div className="w-[1050px] flex justify-between">
          <div className=" flex flex-col items-center justify-center pb-7">
            <LogoIcon />
            <p className="font-bold">EDU TEST - Học tập trực tuyến</p>
          </div>
          <div className=" flex items-center justify-center h-full">
            <div className="text-left flex flex-col gap-1">
              <p className="font-bold">Tin tức</p>
              <p>Tin từ ban tổ chức</p>
              <p>English Tips</p>
              <p>Lịch thi</p>
            </div>
          </div>
          <div className=" flex items-center justify-center h-full">
            <div className="text-left flex flex-col gap-1">
              <Link href={"/support"} className="font-bold">Hỗ trợ</Link>
              <Link href={"/support/account-support"}>Hỗ trợ tài khoản</Link>
              <p>Hỗ trợ bài thi</p>
              <p>Hỗ trợ thanh toán</p>
            </div>
          </div>
          <div className=" flex items-center justify-center h-full">
            <div className="text-left flex flex-col gap-1">
              <p className="font-bold">Học viên</p>
              <p>Tự luyện</p>
              <p>Kết quả</p>
              <p>Thi thử</p>
            </div>
          </div>
          <div className=" flex items-center justify-center h-full">
            <div className="text-left flex flex-col gap-1">
              <p className="font-bold">Liên hệ</p>
              <p>Số điện thoại: 0123 456 789</p>
              <p>Địa chỉ: 64-66 Nguyễn Trãi, </p>
              <p >Quận 5, thành phố Hồ Chí Minh</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

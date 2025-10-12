import LogoIcon from "./LogoIcon";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="h-[170px] bg-[#F8AD2D] text-center align-middle flex justify-center text-sm text-black shadow-xl">
        <div className="w-[1050px] flex justify-between">
          <div className=" flex flex-col items-center justify-center pb-7">
            <LogoIcon />
            <p className="font-bold">ENGLISH TEST - Học tập trực tuyến</p>
          </div>
          <div className=" flex items-center justify-center h-full">
            <div className="text-left flex flex-col gap-1">
              <p className="font-bold">Tin tức</p>
              <Link href={"/articles"}>Tin từ ban tổ chức</Link>
              <Link href={"/articles?type=tips&page=1"}>English Tips</Link>
              <Link href={"/schedule"}>Lịch thi</Link>
            </div>
          </div>
          <div className=" flex items-center justify-center h-full">
            <div className="text-left flex flex-col gap-1">
              <Link href={"/support"} className="font-bold">Hỗ trợ</Link>
              <Link href={"/support/account-support"}>Hỗ trợ tài khoản</Link>
              <Link href={"/support/exam-support"}>Hỗ trợ học-thi</Link>
              <Link href={"/support/payment-support"}>Hỗ trợ thanh toán</Link>
            </div>
          </div>
          <div className=" flex items-center justify-center h-full">
            <div className="text-left flex flex-col gap-1">
              <p className="font-bold">Học viên</p>
              <Link href={"/practice"}>Tự luyện</Link>
              <Link href={"/get-ranking"}>Xếp hạng</Link>
              <Link href={"/mockexam"}>Thi thử</Link>
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

import Link from "next/link";

const ScheduleHeader = ({}: {}) => {
  return (
    <div className="w-screen flex flex-col items-center">
      <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center">
        <div className="w-[1050px] mt-10">
          <div className="">
            <div className="text-[20px] text-[#000000] font-medium">
              Tin từ Ban Tổ Chức
            </div>
            <div className="text-sm custom-links text-[#505050] mt-1">
              <Link href={"/"}>Trang chủ</Link>
              <Link href={"#"}>Tin tức</Link>
              <Link href={"#"}>Tin từ Ban Tổ Chức</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleHeader;

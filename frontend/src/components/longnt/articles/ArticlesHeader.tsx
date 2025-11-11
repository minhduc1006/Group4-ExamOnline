import Link from "next/link";

const ArticlesHeader = ({ type }: { type: string }) => {
  return (
    <div className="w-screen flex flex-col items-center">
      <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center">
        <div className="w-[1050px] mt-10">
          <div className="">
            {type === "news" && (
              <div className="text-[20px] text-[#000000] font-medium">
                Tin từ Ban Tổ Chức
              </div>
            )}
            {type === "tips" && (
              <div className="text-[20px] text-[#000000] font-medium">
                Mẹo học Tiếng Anh
              </div>
            )}
            <div className="text-sm custom-links text-[#505050]">
              <Link href={"/"}>Trang chủ</Link>
              <Link href={"#"}>Tin tức</Link>
              {type === "news" && (
                <a href={"/articles?type=news&page=1"}>Tin từ Ban Tổ Chức</a>
              )}
              {type === "tips" && (
                <a href={"/articles?type=tips&page=1"}>Mẹo học Tiếng Anh</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesHeader;

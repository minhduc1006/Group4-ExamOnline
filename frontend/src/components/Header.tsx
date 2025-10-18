import LogoIcon from "@/components/LogoIcon";
import Link from "next/link";

const Header = () => {
  return (
    <>
      <div
        className="h-[120px] px-96 flex justify-between shadow-lg border-spacing-1"
        style={{ backgroundColor: "#F8AD2D" }}
      ></div>
      <div className="absolute left-1/2 w-[57.14%] transform -translate-x-1/2 z-[9999]">
        <div className="flex justify-between">
          <LogoIcon/>
          <div className="nav-link-top mt-10 mr-5">
            <Link href={"/"}>Tự luyện</Link>
            <Link href={"/"}>Thi thử</Link>
            <Link href={"/auth/login"}>Đăng nhập</Link>
            <Link href={"/auth/register"}>Đăng ký</Link>
          </div>
        </div>
        <div className="flex justify-center pt-5 nav-link-top top-[120px] h-[70px] bg-slate-50 text-black p-4 shadow-lg z-50 rounded-lg border-spacing-1 border-gray-300">
          <Link href={"/"}>Link 1</Link>
          <Link href={"/"}>Link 2</Link>
        </div>
      </div>
    </>
  );
};

export default Header;

import ProfilePageContent from "@/components/ProfilePageContent";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile",
};

const Profile = () => {
  return (
    <div className="w-screen flex flex-col mb-20 items-center">
      <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center drop-shadow-sm">
        <div className="w-[1050px] mt-10">
          <div className="">
            <div className="text-[20px] text-[#000000] font-medium">Hồ sơ</div>
            <div className="text-sm custom-links text-[#505050]">
              <Link href={"/"}>Trang chủ</Link>
              <a href={"#"}>Hồ sơ</a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1270px]">
        <ProfilePageContent />
      </div>
    </div>
  );
};

export default Profile;

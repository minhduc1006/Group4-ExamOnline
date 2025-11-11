"use client";
import SideBarProfile from "@/components/SideBarProfile";
import UserInformationProfile from "@/components/UserInformationProfile";
import useCurrentUser from "@/hooks/useCurrentUser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PurchaseHistory from "./PurchaseHistory";
import Achievements from "./Achievements";

const ProfilePageContent = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();

  const content = searchParams.get("content") || "UserInfo";

  const setContent = (newContent: string) => {
    const newUrl = `${pathname}?content=${newContent}`;
    router.push(newUrl, { scroll: false });
  };

  const renderContent = () => {
    switch (content) {
      case "UserInfo":
        return <UserInformationProfile user={user} />;
      case "Achievements":
        return <Achievements />;
      case "PurchaseHistory":
        return <PurchaseHistory user={user} />;
      default:
        return <UserInformationProfile user={user} />;
    }
  };

  return (
    <div className="flex w-full mt-14">
      <div className="w-[20%]">
        <SideBarProfile user={user} setContent={setContent} />
      </div>

      <div className="ml-[5%] bg-white w-[75%]">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfilePageContent;

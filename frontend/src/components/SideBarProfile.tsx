import LogoIcon from "./LogoIcon";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SideBarProfile = ({ user, setContent }: any) => {
  return (
    <div className="flex flex-col pb-10 items-center w-full shadow-lg bg-[#F8AD2D] border rounded-lg">
      <div>
        <LogoIcon />
      </div>
      <div className="text-xl font-bold">{user.data?.name}</div>
      <div>Tài khoản: {user.data?.username}</div>
      <div>Khối: {user.data?.grade}</div>

      <div className="mt-10">
        <ToggleGroup className="flex flex-col w-52 items-start" type="single">
          <ToggleGroupItem
            onClick={() => setContent("UserInfo")}
            value="UserInfo"
            aria-label="UserInfo"
            className="group px-2 rounded transition-all duration-200 hover:bg-gray-100"
          >
            Thông tin tài khoản
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() => setContent("Achievements")}
            value="Achievements"
            aria-label="Achievements"
            className="group px-2 rounded transition-all duration-200 hover:bg-gray-100"
          >
            Thành tích
          </ToggleGroupItem>
          <ToggleGroupItem
            onClick={() => setContent("PurchaseHistory")}
            value="Purchase History"
            aria-label="Purchase History"
            className="group px-2 rounded transition-all duration-200 hover:bg-gray-100"
          >
            Lịch sử mua
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default SideBarProfile;

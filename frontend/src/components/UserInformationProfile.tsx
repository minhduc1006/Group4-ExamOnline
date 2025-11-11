import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { REQUEST_ADD_MAIL, REQUEST_DELETE_EMAIL } from "@/helper/urlPath";
import ChangePasswordForm from "./ChangePasswordForm";
import { API } from "@/helper/axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserInformationProfile = ({ user }: any) => {
  const router = useRouter();
  const dateB: string = user.data?.birthDate ? String(user.data.birthDate) : "";
  const dateB2: string = user.data?.expiredDatePackage ? String(user.data.expiredDatePackage) : "";
  let formattedDate = "";
  let formattedDate2 = "";
  const [errorMail, setErrorMail] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notification, setNotification] = useState<string>("");

  if (dateB) {
    const dateSplit = dateB.split("-");
    if (dateSplit.length === 3) {
      formattedDate = `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`;
    }
  }

  if (dateB) {
    const dateSplit = dateB2.split("-");
    if (dateSplit.length === 3) {
      formattedDate2 = `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`;
    }
  }

  const handleDeleteEmail = async () => {
    try {
      setNotification("⏳ Đang xử lý yêu cầu của bạn...");
      setErrorMail("");
      const { data: mailSended } = await API.post(
        `${process.env.NEXT_PUBLIC_API_URL}${REQUEST_DELETE_EMAIL}`,
        {
          id: user.data?.id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (mailSended === false) {
        throw new Error("");
      }
      setErrorMail("");
      setNotification(
        "Yêu cầu đã được gửi đi, vui lòng kiểm tra email của bạn"
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setNotification("");
      setErrorMail("Hệ thống đang bận, vui lòng thử lại sau");
    }
  };

  const handleAddEmail = async () => {
    if (!email) {
      setNotification("");
      setErrorMail("Email không được để trống");
      return;
    }
    try {
      setNotification("⏳ Đang xử lý yêu cầu của bạn...");
      setErrorMail("");
      const { data: mailSended } = await API.post(
        `${process.env.NEXT_PUBLIC_API_URL}${REQUEST_ADD_MAIL}`,
        {
          id: user.data?.id,
          email: email,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (mailSended === false) {
        setNotification("");
        setErrorMail("Email đã được sử dụng, vui lòng chọn email khác");
        return;
      }
      setErrorMail("");
      setNotification(
        "Yêu cầu đã được gửi đi, vui lòng kiểm tra email của bạn"
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMail(
        "Vui lòng kiểm tra lại địa chỉ email của bạn, nếu địa chỉ email đúng có thể hệ thống đang bận, vui lòng thử lại sau"
      );
      setNotification("");
    }
  };

  return (
    <div className="w-full h-full flex flex-col rounded-sm border p-7 gap-7">
      <div className="w-full grid grid-cols-3">
        <div className="flex justify-between px-3">
          <div>Tên: {user.data?.name}</div>
          <Separator orientation="vertical" className="bg-slate-400" />
        </div>
        <div className="flex justify-between px-3">
          <div>Giới tính: {user.data?.gender}</div>
          <Separator orientation="vertical" className="bg-slate-400" />
        </div>
        <div className="px-3">Ngày sinh: {formattedDate}</div>
      </div>
      <Separator className="bg-slate-400" />
      <div className="flex gap-5 items-center">
        <div>
          Email:{" "}
          {user.data?.email ? (
            <span>{user.data.email}</span>
          ) : (
            <span className="text-slate-400 italic">Chưa có email</span>
          )}
        </div>

        {user.data?.email ? (
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                onClick={() => setNotification("")}
                className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Xóa email
              </button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} className="sm:max-w-[425px] z-[999] bg-white">
              <DialogHeader>
                <DialogTitle>Yêu cầu xóa email</DialogTitle>
              </DialogHeader>
              <div className="gap-4 py-4">
                <div>
                  Yêu cầu xóa email sẽ được gửi qua email cá nhân của bạn sau
                  khi bạn bấm nút gửi yêu cầu
                </div>
                <div className="">
                  {(errorMail || notification) && (
                    <Separator className="bg-slate-400 my-4" />
                  )}
                  <div className="text-red-500">{errorMail}</div>
                  {notification}
                </div>
              </div>
              <DialogFooter>
                <button
                  type="button"
                  onClick={() => handleDeleteEmail()}
                  className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Xóa email
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                onClick={() => setNotification("")}
                className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Thêm email
              </button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} className="sm:max-w-[425px] z-[999] bg-white">
              <DialogHeader>
                <DialogTitle>Thêm email</DialogTitle>
              </DialogHeader>
              <div className="gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="Email" className="text-right">
                    Email:
                  </Label>
                  <Input
                    radius="sm"
                    className={`p-2 col-span-3 w-full border ${
                      errorMail ? "border-red-500" : "border-gray-300"
                    } rounded-sm`}
                    id="name"
                    defaultValue=""
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <span className="col-span-1"></span>
                  <div className="col-span-3">
                    <div className="text-red-500">{errorMail}</div>
                    {notification}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <button
                  type="button"
                  onClick={() => handleAddEmail()}
                  className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Thêm email
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Separator className="bg-slate-400" />
      <div className="w-full grid grid-cols-2">
        <div className="flex justify-between">
          <div className="flex flex-col px-3 gap-7">
            <div>Tỉnh/Thành phố: {user.data?.province}</div>
            <div>Quận/Huyện: {user.data?.district}</div>
            <div>Phường/Xã: {user.data?.ward}</div>
          </div>
        </div>
        <div className="flex flex-col px-3 gap-7">
          <div className="px-3">Cấp: {user.data?.educationLevel}</div>
          <div className="px-3">Khối: {user.data?.grade}</div>
        </div>
      </div>

      <Separator className="bg-slate-400" />

      <div className="px-3">Loại tài khoản: {user.data?.accountType}</div>
      {
        user.data?.accountType !== "FREE_COURSE" &&
        <div className="px-3">Ngày hết hạn: {formattedDate2}</div>
      }

      <div className="px-3 mt-5 flex gap-5">
        <button
          type="button"
          onClick={() => {
            router.push("/update-profile");
          }}
          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Sửa thông tin
        </button>
        <ChangePasswordForm user={user}/>
      </div>
    </div>
  );
};

export default UserInformationProfile;

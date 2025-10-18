import LogoIcon from "@/components/LogoIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Profile",
};

const UpdateProfile = () => {
  return (
    <div className="w-screen bg-[url('/login/bglogin2.jpg')] bg-cover bg-left bg-no-repeat justify-items-center">
      <div className="flex flex-col h-screen w-min-[350px] md:w-[60%] items-center justify-center">
        <Card className="px-10 pb-10 w-full rounded-lg dark bg-white bg-opacity-90 backdrop-blur-lg">
          <CardHeader>
            <div className="flex flex-col justify-center items-center">
              <LogoIcon className="w-[150px] h-auto" />
              <CardTitle className="font-bold text-2xl">Cập Nhật Thông Tin</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <UpdateProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateProfile;

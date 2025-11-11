"use client";

import ChangePasswordForgotForm from "@/components/ChangePasswordForgotForm";
import LogoIcon from "@/components/LogoIcon";
import RequestForgotPasswordForm from "@/components/RequestForgotPasswordForm";
import { useSearchParams } from "next/navigation";

const ForgotPage = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  return (
    <div className="flex flex-col items-center px-10 py-10 max-w-3xl w-full rounded-lg dark bg-white lg:p-5 bg-opacity-55 backdrop-blur-lg">
      <div>
        <LogoIcon />
      </div>
      {!token && <RequestForgotPasswordForm />}
      {token && <ChangePasswordForgotForm token={token}/>}
    </div>
  );
};

export default ForgotPage;
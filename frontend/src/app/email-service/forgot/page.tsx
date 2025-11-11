
import ForgotPage from "@/app/email-service/forgot/ForgotPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot Pasword",
  };

const Forgot = () => {

  return (
    <ForgotPage/>
  );
};

export default Forgot;

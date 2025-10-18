import { Metadata } from "next";
import SupportPage from "@/app/(main)/support/SupportPage";

export const metadata: Metadata = {
  title: "Support",
};

const Support = () => {

  return (
    <SupportPage/>
  );
};
export default Support;

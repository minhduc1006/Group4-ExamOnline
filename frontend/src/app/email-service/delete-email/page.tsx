
import DeleteEmailPage from "@/app/email-service/delete-email/DeleteEmailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Email",
};

const AddEmail = () => {

  return (
    <DeleteEmailPage/>
  );
};

export default AddEmail;

import AdminPage from "@/app/manager/account-manager/AdminPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

const Admin = () => {
  return <AdminPage />;
};

export default Admin;

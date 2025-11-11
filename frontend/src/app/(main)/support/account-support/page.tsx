import { Metadata } from "next";
import AccountSupportPage from "../../../../components/AccountSupportPage";

export const metadata: Metadata = {
  title: "Account Support",
};

const AccountSupport = () => {
  return <AccountSupportPage />;
};

export default AccountSupport;

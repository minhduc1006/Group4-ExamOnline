import { Metadata } from "next";
import PaymentSupportPage from "../../../../components/PaymentSupportPage";

export const metadata: Metadata = {
  title: "Payment Support",
};

const AccountSupport = () => {
  return <PaymentSupportPage />;
};

export default AccountSupport;

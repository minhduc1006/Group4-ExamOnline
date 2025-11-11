import { Metadata } from "next";
import SupportTrackingPage from "@/components/longnt/support-tracking/SupportTrackingPage";

export const metadata: Metadata = {
  title: "Support Tracking",
};

const SupportTracking = () => {
  return <SupportTrackingPage />;
};

export default SupportTracking;
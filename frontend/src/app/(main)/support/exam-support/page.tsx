import { Metadata } from "next";
import ExamSupportPage from "@/components/longnt/exam-support/ExamSupportPage";

export const metadata: Metadata = {
  title: "Exam Support",
};

const ExamSupport = () => {
  return <ExamSupportPage />;
};

export default ExamSupport;

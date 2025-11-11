// pages/index.tsx
import MockExam from "@/components/duclm/MockExam";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mock Exam",
};

export default function Home() {
  return (
    <div>
      <MockExam />
    </div>
  );
}

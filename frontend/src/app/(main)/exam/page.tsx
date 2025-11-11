import Exam from "@/components/duclm/Exam";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam",
};

export default function Home() {
  return (
    <div>
      <Exam />
    </div>
  );
}

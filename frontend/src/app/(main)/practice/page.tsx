// pages/index.tsx
import Practice from "@/components/duclm/Practice";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice",
};

export default function Home() {
  return (
    <div>
      <Practice />
    </div>
  );
}

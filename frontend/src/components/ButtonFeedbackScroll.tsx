"use client";

import { useScroll } from "@/app/ScrollProvider";

export default function ButtonFeedbackScroll() {
  const scroll = useScroll();

  return (
    <button
      onClick={() =>
        scroll?.feedbackRef.current?.scrollIntoView({
          behavior: "smooth",
        })
      }
      className="w-40 bg-orange-500 font-bold py-2 px-4 rounded-lg hover:bg-orange-600 text-white hover:scale-105 transition-all duration-300 ease-in-out"
    >
      Gửi Feedback
    </button>
  );
}

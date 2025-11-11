"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useScroll } from "@/app/ScrollProvider";
import { SEND_FEEDBACK } from "@/helper/urlPath";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useToast } from "./ui/use-toast";
import { API } from "@/helper/axios";

const SendFeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState<string>("");
  const scroll = useScroll();
  const [error, setError] = useState<string>("");
  const user = useCurrentUser();
  const { toast } = useToast();

  const onSubmit = async () => {
    setError("");
    if (!rating || !comment) {
      setError(
        "Bạn phải điền đầy đủ thông tin feedback như số sao và đánh giá trước khi gửi"
      );
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await API.post(
        `${process.env.NEXT_PUBLIC_API_URL}${SEND_FEEDBACK}`,
        {
          userId: user.data?.id,
          rating: rating,
          comment: comment,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast({
        title: "Gửi feedback thành công!",
        className: "text-white bg-green-500",
      });
      setRating(0);
      setComment("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Hệ thống đang bận, vui lòng thử lại sau");
    }
  };

  return (
    <div ref={scroll?.feedbackRef} className="p-5 flex flex-col w-full gap-5">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={30}
            className="cursor-pointer transition-transform duration-200 hover:scale-110"
            fill={rating >= star ? "orange" : "none"}
            stroke="orange"
            onClick={() => {
              setRating(star);
            }}
          />
        ))}
      </div>
      <div className="w-full flex flex-col gap-1">
        <label>Đánh giá của bạn về website của chúng tôi?</label>
        <textarea
          placeholder="nhập nội dung..."
          autoComplete="off"
          rows={1}
          value={comment}
          onInput={(e) => {
            const textarea = e.target as HTMLTextAreaElement;
            setComment(textarea.value);
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
          }}
          className={`px-4 py-3 border bg-white border-none text-black rounded-sm w-full overflow-hidden focus:outline-none`}
        ></textarea>
      </div>
      <div className="flex justify-center w-full">
        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
      </div>
      <div className="w-full flex justify-around pt-5">
        <Button
          type="button"
          onClick={() => onSubmit()}
          className="w-40 bg-orange-500 font-bold py-2 px-4 rounded-lg hover:bg-orange-600 text-white hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Gửi Feedback
        </Button>
      </div>
    </div>
  );
};

export default SendFeedbackForm;

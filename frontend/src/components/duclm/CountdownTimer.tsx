"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [examStart, setExamStart] = useState<number | null>(null);
    const [examEnd, setExamEnd] = useState<number | null>(null);
    const [examActive, setExamActive] = useState(false);

    const router = useRouter();

    useEffect(() => {
        async function fetchExamDate() {
            try {
                const response = await axios.get("http://localhost:8080/api/v1/exam/next", {
                    headers: { "Content-Type": "application/json" },
                });

                if (response.data.examStart && response.data.examEnd) {
                    const startTime = new Date(response.data.examStart).getTime();
                    const endTime = new Date(response.data.examEnd).getTime();

                    setExamStart(startTime);
                    setExamEnd(endTime);
                }
            } catch (error) {
                console.error("Error fetching exam data:", error);
            }
        }

        fetchExamDate();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();

            if (examStart && examEnd) {
                const isActive = now >= examStart && now <= examEnd;
                setExamActive(isActive);

                const distance = examStart - now;

                if (distance <= 0) {
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                } else {
                    setTimeLeft({
                        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((distance % (1000 * 60)) / 1000),
                    });
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [examStart, examEnd]);

    return (
        <div className="p-6 h-[380px] bg-gradient-to-b from-[#ffc404] via-[#fccc04] to-[#F9DA8D] rounded-2xl text-white text-center shadow-xl flex flex-col justify-between">
            <h2 className="text-2xl font-bold">Vòng thi chính thức</h2>

            <div className="flex justify-center gap-6">
                {(["days", "hours", "minutes"] as const).map((unit, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="w-16 h-16 flex items-center justify-center border-2 border-white rounded-full text-3xl font-bold bg-[#ffbf47] shadow-md">
                            {timeLeft[unit as keyof typeof timeLeft]}
                        </div>
                        <p className="text-sm mt-1">
                            {unit === "days" ? "Ngày" : unit === "hours" ? "Giờ" : "Phút"}
                        </p>
                    </div>
                ))}

            </div>

            <button
                onClick={() => examActive && router.push("/exam")}
                className={`w-full py-3 rounded-lg text-lg font-bold transition duration-300 
        ${examActive ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-400 text-gray-700 cursor-not-allowed"}
    `}
                disabled={!examActive}
            >
                {examStart && examEnd ? (
                    Date.now() < examStart ? "Vòng Thi Chưa Bắt Đầu" :
                        Date.now() > examEnd ? "Vòng Thi Đã Kết Thúc" :
                            "Vào Thi Ngay"
                ) : "Hiện tại không có vòng thi nào"}
            </button>

        </div>
    );
}

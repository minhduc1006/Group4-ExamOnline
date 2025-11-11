import React from "react";
import useCurrentUser from "@/hooks/useCurrentUser";

interface RightBoardProps {
  time: string;
}

const RightBoard: React.FC<RightBoardProps> = ({ time }) => {
  const user = useCurrentUser();

  return (
    <div 
      className="relative w-60 p-6 text-gray-900 text-center rounded-xl shadow-lg"
      style={{
        background: "linear-gradient(to bottom, rgba(255, 165, 0, 1), rgba(255, 165, 0, 0.7))",
      }}
    >

      {/* Thời gian */}
      <div className="mt-3 flex items-center justify-center bg-orange-400 text-white p-2 rounded-lg shadow-sm text-md font-medium">
        <span className="mr-2">⏰</span> {time}
      </div>

      {/* Tên User */}
      <div className="mt-3 font-semibold text-md bg-white text-gray-800 p-2 rounded-lg shadow-sm">
        {user.data?.name}
      </div>

      {/* ID User */}
      <div className="bg-gray-300 h-7 w-full rounded-md mt-2 shadow-inner"></div>

      {/* Level */}
      <div className="mt-3 text-sm font-semibold uppercase tracking-wide">Level 1</div>

      {/* Thanh trạng thái Level */}
      <div className="flex justify-center gap-2 mt-2">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="w-5 h-5 bg-white rounded-md shadow-md opacity-90" 
          ></div>
        ))}
      </div>
    </div>
  );
};

export default RightBoard;

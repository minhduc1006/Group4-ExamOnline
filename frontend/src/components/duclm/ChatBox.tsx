"use client";
import { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMessage = { role: "assistant", content: data.reply };

    setMessages([...messages, userMessage, botMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn việc xuống dòng
      sendMessage();
    }
  };

  return (
    <div
      className="w-full h-full rounded-xl shadow-lg p-4 border-t-4 border-yellow-500"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="bg-yellow-500 bg-opacity-90 text-white text-lg font-semibold rounded-t-md p-2">
        Trợ lý EduTest AI
      </div>

      {/* Chat messages */}
      <div className="h-[250px] overflow-y-auto p-3 space-y-3 border rounded-md bg-white bg-opacity-80">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.role === "user"
                ? "text-right text-blue-600"
                : "text-left text-green-600"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-1 border p-2 rounded-l-md focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Bắt sự kiện phím Enter
          placeholder="Nhập tin nhắn..."
        />
        <button
          className="bg-yellow-500 text-white font-semibold px-4 rounded-r-md hover:bg-yellow-600 transition-all duration-300"
          onClick={sendMessage}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

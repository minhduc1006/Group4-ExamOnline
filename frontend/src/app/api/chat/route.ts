import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: "Bạn là trợ lý AI." }, { role: "user", content: message }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "OpenAI API Error" }, { status: response.status });
    }

    return NextResponse.json({ reply: data.choices[0]?.message?.content || "Không có phản hồi." });
  } catch (error) {
    return NextResponse.json({ error: "Server Error: " + NextResponse.rewrite}, { status: 500 });
  }
}

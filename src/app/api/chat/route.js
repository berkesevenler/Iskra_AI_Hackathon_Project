import { NextResponse } from "next/server";
import { generateConversation } from "@/lib/openai";

// ============================================
// 💬 Chat API Route - POST /api/chat
// ============================================
// Send messages array, get AI response back
// Body: { messages: [{role: "user", content: "..."}], systemPrompt?: "..." }

export async function POST(request) {
  try {
    const { messages, systemPrompt } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const defaultSystemPrompt =
      systemPrompt ||
      "You are a helpful AI assistant. Be concise and friendly.";

    const response = await generateConversation(defaultSystemPrompt, messages, {
      model: "gpt-4o-mini",
      temperature: 0.7,
    });

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

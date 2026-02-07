import { NextResponse } from "next/server";
import { generateChatResponse, generateJSON } from "@/lib/openai";

// ============================================
// ⚡ Generate API Route - POST /api/generate
// ============================================
// Flexible generation endpoint
// Body: { prompt: "...", type?: "text" | "json", systemPrompt?: "..." }

export async function POST(request) {
  try {
    const { prompt, type = "text", systemPrompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const defaultSystemPrompt =
      systemPrompt || "You are a helpful AI assistant.";

    let result;

    if (type === "json") {
      result = await generateJSON(defaultSystemPrompt, prompt);
      return NextResponse.json({ data: result });
    } else {
      result = await generateChatResponse(defaultSystemPrompt, prompt);
      return NextResponse.json({ response: result });
    }
  } catch (error) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}

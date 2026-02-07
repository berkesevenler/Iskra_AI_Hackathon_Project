import OpenAI from "openai";

// ============================================
// 🤖 OpenAI Client - Ready for any AI feature
// ============================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a chat completion (text response)
 * @param {string} systemPrompt - The system instruction
 * @param {string} userMessage - The user's message
 * @param {object} options - Optional: model, temperature, max_tokens
 * @returns {string} The AI response text
 */
export async function generateChatResponse(
  systemPrompt,
  userMessage,
  options = {}
) {
  const {
    model = "gpt-4o-mini",
    temperature = 0.7,
    max_tokens = 1024,
  } = options;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature,
    max_tokens,
  });

  return response.choices[0].message.content;
}

/**
 * Generate a chat completion with conversation history
 * @param {string} systemPrompt - The system instruction
 * @param {Array} messages - Array of {role, content} message objects
 * @param {object} options - Optional: model, temperature, max_tokens
 * @returns {string} The AI response text
 */
export async function generateConversation(
  systemPrompt,
  messages,
  options = {}
) {
  const {
    model = "gpt-4o-mini",
    temperature = 0.7,
    max_tokens = 1024,
  } = options;

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    temperature,
    max_tokens,
  });

  return response.choices[0].message.content;
}

/**
 * Stream a chat completion (for real-time responses)
 * @param {string} systemPrompt - The system instruction
 * @param {Array} messages - Array of {role, content} message objects
 * @param {object} options - Optional: model, temperature, max_tokens
 * @returns {ReadableStream} The streamed response
 */
export async function streamChatResponse(
  systemPrompt,
  messages,
  options = {}
) {
  const {
    model = "gpt-4o-mini",
    temperature = 0.7,
    max_tokens = 1024,
  } = options;

  const stream = await openai.chat.completions.create({
    model,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    temperature,
    max_tokens,
    stream: true,
  });

  return stream;
}

/**
 * Generate a JSON structured response
 * @param {string} systemPrompt - The system instruction (should ask for JSON)
 * @param {string} userMessage - The user's message
 * @param {object} options - Optional: model, temperature
 * @returns {object} Parsed JSON response
 */
export async function generateJSON(systemPrompt, userMessage, options = {}) {
  const { model = "gpt-4o-mini", temperature = 0.3 } = options;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * Generate embeddings for text (useful for search/similarity)
 * @param {string} text - Text to embed
 * @returns {Array<number>} Embedding vector
 */
export async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

export default openai;

"use client";

import { useState, useCallback } from "react";

// ============================================
// 💬 useChat Hook - AI Chat functionality
// ============================================
// Ready-to-use hook for AI chat features

export function useChat(endpoint = "/api/chat") {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (content) => {
      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage = { role: "user", content };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        const assistantMessage = {
          role: "assistant",
          content: data.message || data.content || data.response,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        return assistantMessage;
      } catch (err) {
        setError(err.message);
        // Remove the user message on error
        setMessages(messages);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [messages, endpoint]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    setMessages,
  };
}

"use client";

import { useState } from "react";
import { Send, Bot, User, Trash2, Lightbulb, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useChat } from "@/hooks/useChat";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import { copyToClipboard } from "@/lib/utils";

const quickPrompts = [
  "Explain quantum computing in simple terms",
  "Write a haiku about programming",
  "Give me 3 startup ideas using AI",
  "What are the best practices for hackathons?",
];

export default function DashboardPage() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput("");
    await sendMessage(message);
  };

  const handleQuickPrompt = async (prompt) => {
    if (isLoading) return;
    setInput("");
    await sendMessage(prompt);
  };

  const handleCopy = async (text, id) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="heading-section text-dark text-3xl sm:text-4xl">
              Dashboard
            </h1>
            <p className="text-dark-soft/50 mt-2 text-sm">
              Chat with AI — customize this for your hackathon project
            </p>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat}>
              <Trash2 className="h-3.5 w-3.5" /> CLEAR
            </Button>
          )}
        </div>

        {/* Chat Area */}
        <Card className="mb-6 min-h-[420px] max-h-[600px] overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[380px] text-center">
              <div className="w-14 h-14 bg-dark-mid flex items-center justify-center mb-5">
                <Bot className="h-6 w-6 text-white/70" />
              </div>
              <h3 className="text-lg font-semibold text-dark mb-2">
                Start a Conversation
              </h3>
              <p className="text-dark-soft/50 mb-8 max-w-md text-sm">
                Ask me anything. This interface is ready for your hackathon project.
              </p>

              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-cream-dark/60 hover:border-accent/40 hover:text-accent text-xs text-dark-soft/60 transition-all duration-300"
                  >
                    <Lightbulb className="h-3 w-3" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex-shrink-0 w-7 h-7 bg-dark-mid flex items-center justify-center mt-1">
                        <Bot className="h-3.5 w-3.5 text-white/70" />
                      </div>
                    )}

                    <div
                      className={`relative group max-w-[80%] px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-dark-mid text-white"
                          : "bg-cream border border-cream-dark/40 text-dark"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none prose-neutral">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}

                      {msg.role === "assistant" && (
                        <button
                          onClick={() => handleCopy(msg.content, index)}
                          className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1.5 shadow-sm border border-cream-dark/40"
                        >
                          {copiedId === index ? (
                            <Check className="h-3 w-3 text-green-700" />
                          ) : (
                            <Copy className="h-3 w-3 text-dark-soft/50" />
                          )}
                        </button>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="flex-shrink-0 w-7 h-7 bg-accent flex items-center justify-center mt-1">
                        <User className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 bg-dark-mid flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-white/70" />
                  </div>
                  <div className="bg-cream border border-cream-dark/40 px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-dark-soft/40 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-dark-soft/40 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-1.5 h-1.5 bg-dark-soft/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
              Error: {error}. Make sure your OpenAI API key is set in .env.local
            </div>
          )}
        </Card>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            loading={isLoading}
            className="self-end h-[54px] w-[54px] p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

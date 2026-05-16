// src/pages/ChatPage.js
// Full chat UI — saves messages to backend on every exchange

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { chatAPI } from "../services/api";
import AppLayout from "../components/AppLayout";

// ── Simulated AI responses (replace with real AI API later) ──────────────────
const AI_RESPONSES = [
  "Great question! Based on your startup context, I'd recommend starting with a lean MVP and validating with 20 real users before scaling.",
  "Focus on the problem first, not the solution. Talk to your target audience and understand their deepest pain points.",
  "For early-stage startups, distribution matters more than product. Who are the first 100 people who will use this, and how will you reach them?",
  "Consider the Ramen Profitable milestone — can you make just enough revenue to survive? That's your first real goal.",
  "Build in public. Share your progress on LinkedIn and Twitter weekly. Your authentic journey attracts your first users.",
  "Your pricing strategy matters. Don't underprice — charge what the value is worth and use that feedback to iterate.",
  "Focus on one acquisition channel and master it before diversifying. Most startups die from trying too many things.",
  "A great co-founder relationship is like a marriage. Make sure your values and working styles align before going all-in.",
];

let responseIndex = 0;
const getAIResponse = (userMsg) => {
  // Cycle through responses (replace with actual AI API call)
  const response = AI_RESPONSES[responseIndex % AI_RESPONSES.length];
  responseIndex++;
  return response;
};

// ── Message bubble component ──────────────────────────────────────────────────
const MessageBubble = ({ msg, isNew }) => {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"} ${isNew ? "animate-fade-up opacity-0-init" : ""}`}
      style={isNew ? { animationFillMode: "forwards" } : {}}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-volt-400/10 border border-volt-400/20 flex items-center justify-center flex-shrink-0 mb-0.5">
          <span className="text-volt-400 text-xs">◈</span>
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? "bg-volt-400 text-obsidian-950 font-500 rounded-br-sm"
            : "bg-obsidian-700/60 border border-white/[0.06] text-gray-200 rounded-bl-sm"
          }`}
      >
        {msg.content}
        <div className={`text-xs mt-1 ${isUser ? "text-obsidian-950/50" : "text-gray-600"}`}>
          {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-xl bg-volt-400 flex items-center justify-center flex-shrink-0 mb-0.5">
          <span className="text-obsidian-950 font-display font-700 text-xs">U</span>
        </div>
      )}
    </div>
  );
};

// ── Typing indicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-end gap-2 justify-start animate-fade-in">
    <div className="w-7 h-7 rounded-xl bg-volt-400/10 border border-volt-400/20 flex items-center justify-center flex-shrink-0">
      <span className="text-volt-400 text-xs">◈</span>
    </div>
    <div className="bg-obsidian-700/60 border border-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
      {[0, 0.2, 0.4].map((delay, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  </div>
);

// ── Starter prompts ───────────────────────────────────────────────────────────
const STARTERS = [
  "How do I validate my startup idea?",
  "What's the best way to find my first customers?",
  "How should I price my product?",
  "Help me write a 30-second pitch",
];

export default function ChatPage() {
  const { user } = useAuth();
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState("");
  const [typing,    setTyping]    = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [newMsgIdx, setNewMsgIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await chatAPI.getHistory(user.id);
        setMessages(res.data.messages || []);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [user?._id]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    setInput("");
    const userMsg = { role: "user", content: userText, createdAt: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setNewMsgIdx(messages.length);
    setTyping(true);

    // Simulate AI thinking delay (replace with real API call)
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const aiText = getAIResponse(userText);
    const aiMsg  = { role: "assistant", content: aiText, createdAt: new Date() };

    setTyping(false);
    setMessages((prev) => [...prev, aiMsg]);

    // Save to backend
    try {
      await chatAPI.save({ userMessage: userText, aiResponse: aiText });
    } catch (err) {
      console.error("Failed to save chat:", err);
    }

    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    try {
      await chatAPI.clear();
      setMessages([]);
    } catch (err) {
      console.error("Failed to clear chat:", err);
    }
  };

  return (
    <AppLayout title="AI Advisor" subtitle="Your personal startup co-founder, available 24/7">
      <div className="max-w-3xl mx-auto h-[calc(100vh-9rem)] flex flex-col">

        {/* ── Header strip ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-volt-400 animate-pulse-slow" />
            <span className="text-xs text-gray-500 font-mono">AI Advisor · Online</span>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat} className="btn-ghost text-xs py-1.5 px-3">
              Clear history
            </button>
          )}
        </div>

        {/* ── Message area ── */}
        <div className="glass-card flex-1 overflow-y-auto p-4 space-y-4 mb-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-volt-400/30 border-t-volt-400 rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-volt-400/10 border border-volt-400/20 flex items-center justify-center">
                <span className="text-volt-400 text-2xl">◈</span>
              </div>
              <div>
                <h3 className="font-display font-700 text-white text-lg mb-1">Start a conversation</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Ask me anything about your startup — strategy, pricing, customers, pitch, growth.
                </p>
              </div>
              {/* Starter prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md mt-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left px-3 py-2.5 rounded-xl bg-obsidian-700/40 border border-white/[0.06] text-sm text-gray-400 hover:text-gray-200 hover:border-volt-400/20 hover:bg-volt-400/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} isNew={i === newMsgIdx || i === newMsgIdx + 1} />
              ))}
              {typing && <TypingIndicator />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* ── Input area ── */}
        <div className="glass-card p-3 flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI advisor anything..."
            rows={1}
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-600 text-sm resize-none focus:outline-none font-body py-1.5 leading-relaxed max-h-32"
            style={{ fieldSizing: "content" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || typing}
            className="w-9 h-9 bg-volt-400 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-volt-500 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 text-obsidian-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>

        <p className="text-center text-gray-700 text-xs font-mono mt-3">
          Press Enter to send · Shift+Enter for new line · History saved automatically
        </p>
      </div>
    </AppLayout>
  );
}

"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, isTyping, status }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const isEmpty = messages.length === 0 && !isTyping;

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-shrink-0 px-5 py-4 border-b flex items-center gap-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, rgba(108,99,255,0.3), rgba(0,212,180,0.2))",
            border: "1.5px solid rgba(108,99,255,0.5)",
            boxShadow: "0 0 12px rgba(108,99,255,0.3)",
            color: "var(--accent-glow)",
          }}
        >
          S
        </div>

        <div>
          <p className="text-sm font-semibold text-white/90 leading-none mb-0.5"
             style={{ fontFamily: "var(--font-display)" }}>
            Simran
          </p>
          <p className="text-[10px] font-mono tracking-widest text-muted">
            AI VOICE ASSISTANT
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: status === "idle" ? "#6c63ff" : "var(--teal)",
              boxShadow: `0 0 8px ${status === "idle" ? "rgba(108,99,255,0.8)" : "rgba(0,212,180,0.8)"}`,
              animation: status !== "idle" ? "pulse-dot 1s ease-in-out infinite" : "none",
            }}
          />
          <span className="text-[10px] font-mono tracking-widest text-muted">
            {status === "idle" ? "ONLINE" : status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto chat-pane px-5 py-5 space-y-5">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                text={msg.text}
                isNew={i === messages.length - 1}
              />
            ))}
            {isTyping && (
              <MessageBubble
                key="typing"
                role="assistant"
                text=""
                isTyping
                isNew
              />
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,180,0.08))",
          border: "1px solid rgba(108,99,255,0.2)",
          boxShadow: "0 8px 32px rgba(108,99,255,0.1)",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
             stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>

      <div>
        <p className="text-white/60 text-sm font-light leading-relaxed">
          Your conversation will appear here.
        </p>
        <p className="text-muted text-xs mt-1 font-mono tracking-wider">
          PRESS THE BUTTON TO BEGIN
        </p>
      </div>

      <div className="flex gap-2 mt-2">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--border)",
              animation: `typing-dot 2s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

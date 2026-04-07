"use client";

export default function MessageBubble({ role, text, isNew, isTyping }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-end gap-3 ${isNew ? "message-enter" : ""} ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          text-xs font-semibold
          ${isUser
            ? "bg-accent/20 border border-accent/40 text-accent-glow"
            : "bg-teal/10 border border-teal/30 text-teal-glow avatar-glow"
          }
        `}
        style={
          !isUser
            ? { boxShadow: "0 0 0 1.5px var(--accent), 0 0 12px rgba(108,99,255,0.35)" }
            : {}
        }
      >
        {isUser ? "Y" : "S"}
      </div>

      <div
        className={`
          max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? "rounded-br-sm bg-accent/20 border border-accent/20 text-white/90 text-right"
            : "rounded-bl-sm border text-white/85"
          }
        `}
        style={
          !isUser
            ? {
                background: "rgba(13,13,20,0.9)",
                borderColor: "rgba(108,99,255,0.15)",
                backdropFilter: "blur(8px)",
              }
            : {}
        }
      >
        <p
          className={`text-[10px] font-mono tracking-widest mb-1.5 ${
            isUser ? "text-accent-glow/70 text-right" : "text-teal/70"
          }`}
        >
          {isUser ? "YOU" : "SIMRAN"}
        </p>

        {isTyping ? (
          <TypingIndicator />
        ) : (
          <p className="font-light" style={{ fontFamily: "var(--font-body)" }}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-0.5">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}
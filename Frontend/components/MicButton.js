"use client";

export default function MicButton({ status, onClick }) {
  const isIdle       = status === "idle";
  const isRecording  = status === "recording";
  const isProcessing = status === "processing";
  const isSpeaking   = status === "speaking";
  const isActive     = isRecording || isProcessing || isSpeaking;

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <StatusLabel status={status} />
      <div className="relative flex items-center justify-center">
        {isIdle && (
          <>
            <span className="orbit-ring" />
            <span className="orbit-ring" style={{ animationDelay: "0.5s" }} />
            <span className="orbit-ring" style={{ animationDelay: "1s" }} />
          </>
        )}

        {isSpeaking && (
          <>
            <span className="sound-ring" />
            <span className="sound-ring" style={{ animationDelay: "0.4s" }} />
            <span className="sound-ring" style={{ animationDelay: "0.8s" }} />
          </>
        )}

        {isProcessing && (
          <span
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "var(--teal)",
              animation: "spin 0.9s linear infinite",
            }}
          />
        )}

        <button
          onClick={onClick}
          disabled={false}
          aria-label={isIdle ? "Start voice call" : "End call"}
          className={`
            relative z-10 w-24 h-24 rounded-full
            flex items-center justify-center
            cursor-pointer transition-all duration-300
            ${isRecording  ? "call-btn-active"      : ""}
            ${isIdle       ? "call-btn-idle"         : ""}
            ${isProcessing ? "call-btn-processing"   : ""}
            ${isSpeaking   ? "call-btn-speaking"     : ""}
          `}
          style={
            isProcessing
              ? {
                  background: "radial-gradient(circle at 30% 30%, #1a3a4a, #0a2030)",
                  boxShadow: "0 0 20px rgba(0,212,180,0.3), 0 8px 32px rgba(0,0,0,0.5)",
                }
              : isSpeaking
              ? {
                  background: "radial-gradient(circle at 30% 30%, #1a4a3a, #0a3020)",
                  boxShadow: "0 0 30px rgba(0,212,180,0.5), 0 8px 32px rgba(0,212,180,0.2)",
                }
              : {}
          }
        >
          <ButtonIcon status={status} />
        </button>
      </div>

      {isRecording && (
        <div className="flex items-end gap-1 h-8" aria-hidden="true">
          {[...Array(7)].map((_, i) => (
            <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      <p className="text-xs text-muted font-mono tracking-widest">
        {isIdle ? "TAP TO START CALL" : "TAP TO END CALL"}
      </p>
    </div>
  );
}

function StatusLabel({ status }) {
  const configs = {
    idle:       { text: "Ready",      dot: "#6c63ff", border: "rgba(108,99,255,0.3)",  bg: "rgba(108,99,255,0.08)" },
    recording:  { text: "Listening",  dot: "#ff6b6b", border: "rgba(255,80,80,0.3)",   bg: "rgba(255,80,80,0.08)"  },
    processing: { text: "Thinking",   dot: "#00d4b4", border: "rgba(0,212,180,0.3)",   bg: "rgba(0,212,180,0.08)" },
    speaking:   { text: "Speaking",   dot: "#00d4b4", border: "rgba(0,212,180,0.3)",   bg: "rgba(0,212,180,0.08)" },
  };
  const c = configs[status] || configs.idle;

  return (
    <div
      className="status-pill"
      style={{ color: c.dot, borderColor: c.border, background: c.bg }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c.dot,
          display: "inline-block",
          animation: status !== "idle" ? "pulse-dot 1s ease-in-out infinite" : "none",
        }}
      />
      {c.text}
      {status !== "idle" && <span className="animate-pulse">…</span>}
    </div>
  );
}

function ButtonIcon({ status }) {
  const size = 32;
  const color = "white";

  if (status === "recording") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="8" y1="22" x2="16" y2="22"/>
      </svg>
    );
  }
  if (status === "processing") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    );
  }
  if (status === "speaking") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.01z"/>
    </svg>
  );
}
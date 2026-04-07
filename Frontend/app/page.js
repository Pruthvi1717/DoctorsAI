"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ChatWindow from "../components/ChatWindow";
import MicButton from "../components/MicButton";
import "../styles/page.css";

const BACKEND_URL = "/api/voice-chat";

function makeSessionId() {
  return "sess_" + Math.random().toString(36).slice(2) + "_" + Date.now();
}

async function blobToWav(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);
  await audioCtx.close();
  const sampleRate = decoded.sampleRate;
  const offlineCtx = new OfflineAudioContext(1, decoded.length, sampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = decoded;
  source.connect(offlineCtx.destination);
  source.start();
  const rendered = await offlineCtx.startRendering();
  return encodeWAV(rendered);
}

function encodeWAV(audioBuffer) {
  const sampleRate = audioBuffer.sampleRate;
  const samples = audioBuffer.getChannelData(0);
  const pcm = floatTo16BitPCM(samples);
  const wavBuffer = new ArrayBuffer(44 + pcm.byteLength);
  const view = new DataView(wavBuffer);
  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + pcm.byteLength, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, pcm.byteLength, true);
  new Uint8Array(wavBuffer).set(new Uint8Array(pcm), 44);
  return new Blob([wavBuffer], { type: "audio/wav" });
}

function floatTo16BitPCM(floatSamples) {
  const buffer = new ArrayBuffer(floatSamples.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < floatSamples.length; i++) {
    const s = Math.max(-1, Math.min(1, floatSamples[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function playBase64Audio(base64, mimeType = "audio/mpeg") {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`data:${mimeType};base64,${base64}`);
    audio.onended = resolve;
    audio.onerror = reject;
    audio.play().catch(reject);
  });
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const sessionIdRef = useRef("default");
  const streamRef = useRef(null);
  const recorderMimeRef = useRef("");
  const callActiveRef = useRef(false);

  useEffect(() => {
    const id = makeSessionId();
    sessionIdRef.current = id;
    setSessionId(id);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const addMessage = useCallback((role, text) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), role, text }]);
  }, []);

  const stopCall = useCallback(() => {
    callActiveRef.current = false;
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsTyping(false);
    setStatus("idle");
  }, []);

  const startRecording = useCallback(async () => {
    if (!callActiveRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
      const selectedMime = mimeTypes.find((t) => MediaRecorder.isTypeSupported(t)) || "";
      recorderMimeRef.current = selectedMime;

      const recorder = selectedMime
        ? new MediaRecorder(stream, { mimeType: selectedMime })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = handleRecordingStop;
      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setStatus("recording");
    } catch {
      stopCall();
    }
  }, []);

  const handleRecordingStop = useCallback(async () => {
    if (!callActiveRef.current) return;
    setStatus("processing");
    setIsTyping(true);

    try {
      const fallbackType = recorderMimeRef.current || "audio/webm";
      const rawBlob = new Blob(chunksRef.current, { type: fallbackType });

      if (rawBlob.size < 2048) {
        setIsTyping(false);
        if (callActiveRef.current) startRecording();
        return;
      }

      let audioBlob;
      let fileName;
      if (rawBlob.type?.startsWith("audio/")) {
        audioBlob = rawBlob;
        const ext = rawBlob.type.includes("ogg") ? "ogg" : rawBlob.type.includes("mp4") ? "mp4" : "webm";
        fileName = `recording.${ext}`;
      } else {
        try { audioBlob = await blobToWav(rawBlob); fileName = "recording.wav"; }
        catch { audioBlob = rawBlob; fileName = "recording.webm"; }
      }

      const formData = new FormData();
      formData.append("audio", audioBlob, fileName);

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "x-session-id": sessionIdRef.current || "default" },
        body: formData,
      });

      if (!response.ok) throw new Error(`Backend error: ${response.status}`);

      const data = await response.json();
      const { transcript, answer, audioBase64 } = data;

      if (transcript) addMessage("user", transcript);
      setIsTyping(false);
      if (answer) addMessage("assistant", answer);

      if (audioBase64 && callActiveRef.current) {
        setStatus("speaking");
        try { await playBase64Audio(audioBase64, "audio/mpeg"); } catch {}
      }

      if (callActiveRef.current) {
        startRecording();
      }
    } catch {
      setIsTyping(false);
      if (callActiveRef.current) startRecording();
    }
  }, [addMessage, startRecording]);

  const handleMicToggle = useCallback(() => {
    if (status === "idle") {
      callActiveRef.current = true;
      startRecording();
    } else if (status === "recording") {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
        streamRef.current?.getTracks().forEach((t) => t.stop());
      }
      setStatus("processing");
    } else {
      stopCall();
    }
  }, [status, startRecording, stopCall]);

  return (
    <main className="relative h-screen w-screen overflow-hidden grid-bg radial-glow flex">
      <div
        className="relative flex flex-col items-center justify-center w-1/2 h-full border-r"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
          <p
            className="text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "rgba(255,255,255,0.85)" }}
          >
            Simran
          </p>
          <p className="text-[10px] font-mono tracking-[0.25em] text-muted mt-0.5">
            VOICE AI · v2.0
          </p>
        </div>

        <MicButton status={status} onClick={handleMicToggle} />

        <p className="absolute bottom-4 right-4 text-[9px] font-mono tracking-wider opacity-20">
          {sessionId ? sessionId.slice(0, 16) : ""}
        </p>
      </div>

      <div className="flex flex-col w-1/2 h-full glass">
        <ChatWindow messages={messages} isTyping={isTyping} status={status} />
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }
      `}</style>
    </main>
  );
}
import express from "express";
import dotenv from "dotenv";

import voiceChatRouter from "./routes/voiceChat.js";

dotenv.config();

const app = express();

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/voice-chat", voiceChatRouter);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});


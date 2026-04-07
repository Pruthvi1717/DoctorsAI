import express from "express";
import dotenv from "dotenv";
import voiceChatRouter from "./routes/voiceChat.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/voice-chat", voiceChatRouter);

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
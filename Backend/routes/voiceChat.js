import express from "express";
import multer from "multer";
import { transcribeAudio } from "../services/deepgramService.js";
import { getGroqResponse, clearSession} from "../services/groqService.js";
import { textToSpeech } from "../services/sarvamService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"] || "default";
    const audioBuffer = req.file?.buffer;
    const audioMimeType = req.file?.mimetype;

    if (!audioBuffer) {
      return res.status(400).json({ error: "No audio file received" });
    }

    const transcript = await transcribeAudio(audioBuffer, audioMimeType);
    const answer = await getGroqResponse(transcript, sessionId);
    const audioBase64 = await textToSpeech(answer);

    res.json({ transcript, answer, audioBase64 });
  } catch (err) {
    console.error("Pipeline error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/session", (req, res) => {
  const sessionId = req.headers["x-session-id"] || "default";
  clearSession(sessionId);
  res.json({ message: "Session cleared" });
});

export default router;
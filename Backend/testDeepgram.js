import fs from "fs";
import path from "path";
import { transcribeAudio } from "./services/deepgramService.js";

const run = async () => {
  try {
    const audioBuffer = fs.readFileSync("./audios/test1.wav");

    const result = await transcribeAudio(audioBuffer);
    console.log("✅ Transcript:", result);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

run();
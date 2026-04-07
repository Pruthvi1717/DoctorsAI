import fs from "fs";
import { textToSpeech } from "./services/sarvamService.js";

const run = async () => {
  try {
    const text = "Namaste! Aap kaise ho? Aaj mai aapko ek movie suggest karungi.";

    const audioBase64 = await textToSpeech(text);

    // Convert base64 → audio file
    const buffer = Buffer.from(audioBase64, "base64");

    fs.writeFileSync("output.wav", buffer);

    console.log("✅ Audio saved as output.wav");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

run();
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

const run = async () => {
  try {
    // 🔹 Load audio file
    const audioStream = fs.createReadStream("./audios/test1.wav");

    const formData = new FormData();
    formData.append("audio", audioStream);

    console.log("🚀 Sending request...");

    const response = await fetch("http://localhost:3000/api/voice-chat", {
      method: "POST",
      headers: {
        "x-session-id": "test-user",
      },
      body: formData,
    });

    const data = await response.json();

    console.log("\n📝 Transcript:", data.transcript);
    console.log("💬 Answer:", data.answer);

    // 🔊 Save audio response
    if (data.audioBase64) {
      const buffer = Buffer.from(data.audioBase64, "base64");
      fs.writeFileSync("response.wav", buffer);
      console.log("🔊 Audio saved as response.wav");
    }

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

run();
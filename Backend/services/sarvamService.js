import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export async function textToSpeech(text) {
  const response = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "api-subscription-key": process.env.SARVAM_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: "hi-IN",
      speaker: "simran",
      pace: 1.0,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: "bulbul:v3",
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`Sarvam error: ${JSON.stringify(data)}`);

  const audioBase64 = data.audios?.[0];
  if (!audioBase64) throw new Error("No audio returned from Sarvam");

  return audioBase64;
}

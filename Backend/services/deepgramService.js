import fetch from "node-fetch";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

function getContentType(mimeType = "") {
  const type = mimeType.toLowerCase();

  if (type.includes("webm")) return "audio/webm";
  if (type.includes("ogg")) return "audio/ogg";
  if (type.includes("mp4")) return "audio/mp4";
  if (type.includes("mpeg") || type.includes("mp3")) return "audio/mpeg";

  return "audio/wav";
}

function getExtension(mimeType = "") {
  const type = mimeType.toLowerCase();

  if (type.includes("ogg")) return "ogg";
  if (type.includes("mp4")) return "mp4";
  if (type.includes("mpeg") || type.includes("mp3")) return "mp3";
  if (type.includes("wav")) return "wav";

  return "webm";
}

async function transcribeWithGroq(audioBuffer, mimeType) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const form = new FormData();
  const ext = getExtension(mimeType);

  form.append("file", audioBuffer, {
    filename: `audio.${ext}`,
    contentType: getContentType(mimeType),
  });

  form.append("model", "whisper-large-v3-turbo");

  const res = await fetch(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        ...form.getHeaders(),
      },
      body: form,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Groq Error: " + JSON.stringify(data));
  }

  return data.text || "";
}

export async function transcribeAudio(audioBuffer, mimeType) {
  try {
    if (!process.env.DEEPGRAM_API_KEY) {
      throw new Error("Missing DEEPGRAM_API_KEY");
    }

    const res = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2&punctuate=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": getContentType(mimeType),
        },
        body: audioBuffer,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return await transcribeWithGroq(audioBuffer, mimeType);
    }

    const text =
      data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

    if (!text.trim()) {
      return await transcribeWithGroq(audioBuffer, mimeType);
    }

    return text.trim();

  } catch (err) {
    return await transcribeWithGroq(audioBuffer, mimeType);
  }
}
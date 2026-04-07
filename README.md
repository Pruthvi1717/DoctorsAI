# AI Assistant with Voice

## Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm

## Backend Setup

1. Open terminal in `Backend`.
2. Install dependencies:
   - `npm install`
3. Create `Backend/.env` with:
   - `DEEPGRAM_API_KEY=your_key`
   - `GROQ_API_KEY=your_key`
   - `SARVAM_API_KEY=your_key`
   - `PORT=3000` (optional)
4. Start backend:
   - `npm run dev`

Backend runs on `http://localhost:3000`.

## Frontend Setup

1. Open terminal in `Frontend`.
2. Install dependencies:
   - `npm install`
3. Start frontend:
   - `npm run dev`

Frontend runs on `http://localhost:3001`.

## Run Order

1. Start backend first.
2. Start frontend.
3. Open `http://localhost:3001` in browser.

## Notes

- Microphone access works on secure context (`http://localhost` or `https`).
- Frontend uses `/api/voice-chat`, proxied to backend `http://localhost:3000/api/voice-chat`.

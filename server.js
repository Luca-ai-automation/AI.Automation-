import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// endpoint API
app.post("/api/chat", async (req, res) => {
  try {
    const { message = "" } = req.body || {};
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY non impostata." });
    if (!message) return res.status(400).json({ error: "Messaggio mancante." });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sei un assistente per ristoranti/attività locali. Rispondi in italiano, breve e utile." },
        { role: "user", content: message }
      ],
      temperature: 0.3,
      max_tokens: 220
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "Ok.";
    res.json({ reply });
  } catch (err) {
    console.error("Errore /api/chat:", err?.message || err);
    res.status(500).json({ error: "AI_UNAVAILABLE" });
  }
});

export default app;





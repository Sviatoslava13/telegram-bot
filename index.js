import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.post("/send", async (req, res) => {
  const { name, phone, email, message } = req.body;

  const text = `📩 *Заявка*\n👤 ${name}\n📞 ${phone}\n📧 ${email}\n📝 ${
    message || "—"
  }`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error("❌ Telegram API error:", data);
      return res.status(500).json({ error: "Telegram API error" });
    }

    res.json({ success: true, message: "Повідомлення надіслано" });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

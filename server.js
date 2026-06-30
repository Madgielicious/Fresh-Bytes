const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';

if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY environment variable.');
  process.exit(1);
}

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are FreshStart AI, a helpful assistant for new students. Answer briefly and clearly. Focus on government services, student requirements, and local processes. Question: ${question}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'Gemini request failed.' });
    }

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.json({ answer: answer ? answer.trim() : 'Sorry, I could not generate a response.' });
  } catch (error) {
    console.error('Chat proxy error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

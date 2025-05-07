import axios from 'axios'; // Changed from OpenAI package to axios
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const EMAILS_DIR = path.join(__dirname, '..', 'emails');
const POINTER_PATH = path.join(__dirname, '..', 'emailspointer.json');

function loadAllEmails(): string {
  const pointer = JSON.parse(fs.readFileSync(POINTER_PATH, 'utf-8'));
  let fullText = '';
  for (const filename of Object.keys(pointer)) {
    const filePath = path.join(EMAILS_DIR, `${filename}.txt`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      fullText += `\n[${filename}] ${content}`;
    }
  }
  return fullText;
}

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  const emailText = loadAllEmails();

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-8b-8192', // Using Groq's Llama 3 8B model
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that answers questions based on the user\'s saved emails.',
          },
          {
            role: 'user',
            content: `Here are my emails:\n${emailText}\n\nNow, answer this: ${question}`,
          },
        ],
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ answer: response.data.choices[0].message.content });
  } catch (error: any) {
    console.error('Groq API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Groq API error',
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
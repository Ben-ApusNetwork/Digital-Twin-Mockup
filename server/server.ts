
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Content } from '@google/genai';
import type { QuizAnswers, ChatMessage } from '../src/types';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// --- Gemini AI Setup ---
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY environment variable not set");
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey });

// --- API Endpoints ---
app.post('/api/generate-persona', async (req, res) => {
    try {
        const { bio, answers } = req.body as { bio: string, answers: QuizAnswers };
        if (!bio || !answers) {
            return res.status(400).json({ error: 'Missing bio or answers' });
        }

        const quizAnswersString = Object.entries(answers)
            .map(([key, value]) => `Question ${key.slice(1)}: ${value}`)
            .join('\n');

        const prompt = `
            Based on the user's bio and quiz answers, generate a short persona tag describing their communication style.
            The tag must be a single line of text with 5-7 descriptive points separated by a '•' character.
            Example: Friendly • Uses slang • Frequent emojis • Asks questions • Concise • Sarcastic undertones
            Focus on tone, phrasing, formality, and use of things like emojis or slang.
            The output must be plain text only, without any markdown (no asterisks, lists, etc.), and only contain the tag itself.

            **User Bio:**
            ${bio}

            **Personality Quiz Answers:**
            ${quizAnswersString}

            **Generated Persona Tag:**
        `;

        // 修复generate-persona端点 (大约第49行)
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 50,
            }
        });
        
        const personaText = response.text.trim();
        const cleanedPersona = personaText.replace(/^[\s*#-]+/, '').replace(/[*_`]/g, '').trim();

        res.json({ persona: cleanedPersona });

    } catch (error) {
        console.error('Error generating persona:', error);
        res.status(500).json({ error: 'Failed to generate persona' });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { persona, history, message } = req.body as { persona: string, history: ChatMessage[], message: string };

        if (!persona || !history || !message) {
            return res.status(400).json({ error: 'Missing persona, history, or message' });
        }

        const geminiHistory: Content[] = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));
        
        // Remove last message from history, as it's the current user message being sent
        geminiHistory.pop(); 

        // 修复chat端点 (大约第85行)
        const chat = await ai.chats.create({
            model: 'gemini-2.5-flash',
            history: geminiHistory,
            systemInstruction: `You are a digital twin. Your communication style must strictly adhere to the following persona tag: "${persona}". Mimic this style in all your responses. Do not break character. Do not mention that you are an AI or a digital twin. Just act as the person described by the persona.`,
        });
        
        const response = await chat.sendMessageStream({ message });
        
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        for await (const chunk of response) {
            res.write(chunk.text);
        }
        res.end();

    } catch (error) {
        console.error('Error in chat stream:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process chat message' });
        } else {
            res.end();
        }
    }
});


// --- Static File Serving ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

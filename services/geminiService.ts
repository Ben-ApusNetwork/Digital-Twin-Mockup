
import { GoogleGenAI, Chat } from '@google/genai';
import type { QuizAnswers } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePersona = async (bio: string, answers: QuizAnswers): Promise<string> => {
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

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.5,
      maxOutputTokens: 50,
      thinkingConfig: { thinkingBudget: 25 },
    }
  });

  const personaText = response.text.trim();
  // Remove potential markdown like list items and bold markers as a safeguard.
  return personaText.replace(/^[\s*#-]+/, '').replace(/[*_`]/g, '').trim();
};

export const createChat = (persona: string): Chat => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are a digital twin. Your communication style must strictly adhere to the following persona tag: "${persona}". Mimic this style in all your responses. Do not break character. Do not mention that you are an AI or a digital twin. Just act as the person described by the persona.`,
    },
  });
  return chat;
};
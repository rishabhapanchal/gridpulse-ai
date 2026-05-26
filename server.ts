/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Set limit to comfortably allow base64 document payloads
app.use(express.json({ limit: '15mb' }));

// Diagnostics and Health Check Route
app.get('/api/healthz', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV || 'development',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    geminiKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
    geminiKeyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 6) : 'none',
  });
});

// Lazy initialize Gemini client on the server side
let _ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('MY_GEMINI_API_KEY')) {
      throw new Error('GEMINI_API_KEY is not configured or is set to a placeholder. Please configure your actual Gemini API Key inside the platform secrets panel.');
    }
    _ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return _ai;
}

// Multimodal Bill Analyzer and Savings Forecaster Route
app.post('/api/analyze-bill', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { fileBase64, mimeType } = req.body;

    if (!fileBase64 || !mimeType) {
      res.status(400).json({ error: 'Missing file data or mimeType' });
      return;
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: fileBase64,
      },
    };

    const textPart = {
      text: `Analyze this electricity utility bill. Extract the key metrics and suggest clean energy recommendations.
Make sure you accurately extract the average or current monthly bill amount (in dollars) and the utility rate per kWh if visible, otherwise estimate them prudently.
Identify energy conservation actions or appliance improvements the user can make.
Provide a high-fidelity estimation of how much they could save by adapting rooftop solar panel arrays.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Fallback safety model
      contents: [imagePart, textPart],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedBillAmount: {
              type: Type.NUMBER,
              description: 'The extracted average or current monthly bill cost in USD (e.g. 230). Fall back to 150 if not discernible.',
            },
            estimatedConsumptionKwh: {
              type: Type.NUMBER,
              description: 'The extracted electricity consumption in kWh (e.g. 1200).',
            },
            utilityRate: {
              type: Type.NUMBER,
              description: 'The utility price per kWh in USD (e.g. 0.18). Fall back to 0.18 if not discernible.',
            },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 concrete personal actions, recommended improvements, or home adjustments they should carry out to lower peak demands.',
            },
            estimatedSavingsPotential: {
              type: Type.STRING,
              description: 'A 1-sentence projection of potential monthly or lifetime savings achieved through solar integration.',
            },
            summaryOfFindings: {
              type: Type.STRING,
              description: 'A 2-sentence summary of the bill observation.',
            },
          },
          required: [
            'extractedBillAmount',
            'estimatedConsumptionKwh',
            'utilityRate',
            'recommendedActions',
            'estimatedSavingsPotential',
            'summaryOfFindings',
          ],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Gemini model did not return text response.');
    }

    const parsedJSON = JSON.parse(resultText.trim());
    res.json(parsedJSON);
  } catch (error: any) {
    console.error('Error in Gemini Multimodal Bill Analysis:', error);
    res.status(500).json({ error: error.message || 'Analysis processing failed' });
  }
});

// Server-Sent Events (SSE) AI Streaming Route
app.post('/api/chat', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { messages, systemInstruction } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Invalid messages array' });
      return;
    }

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || m.text }],
    }));

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Error in Gemini Generation stream:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Failed to generate content' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream disconnected due to server error' })}\n\n`);
      res.end();
    }
  }
});

// Handle Frontend serving safely across deployment systems
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Only listen locally, Vercel will handle listening natively via handles
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

export default app;

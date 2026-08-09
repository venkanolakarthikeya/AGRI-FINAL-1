import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const fallbackModels = [
    'gemini-3.5-flash',
    'gemini-2.5-flash',
    'gemini-3.1-flash-lite'
  ];

  async function generateWithRetry(modelArgs: any) {
    let attempt = 0;
    while (attempt < fallbackModels.length) {
      try {
        const currentModel = fallbackModels[attempt];
        return await ai.models.generateContent({ ...modelArgs, model: currentModel });
      } catch (error: any) {
        attempt++;
        const isUnavailable = error?.status === 503 || error?.status === 'UNAVAILABLE' || error?.message?.includes('503');
        const isRateLimit = error?.status === 429 || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429');
        if (isUnavailable || isRateLimit) {
          if (attempt < fallbackModels.length) {
            console.warn(`[Gemini API] Error 503/429 on ${fallbackModels[attempt - 1]}. Switching to ${fallbackModels[attempt]}...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
        }
        throw error;
      }
    }
    throw new Error('Failed after retrying fallback models');
  }

  // API Routes
  app.post('/api/recommend', async (req, res) => {
    try {
      const { n, p, k, temperature, humidity, rainfall, ph, location, season, language } = req.body;
      
      const prompt = `
        You are an expert AI agricultural assistant. Based on the following data, recommend the top 3 crops.
        Soil N: ${n}, P: ${p}, K: ${k}
        Temperature: ${temperature}°C
        Humidity: ${humidity}%
        Rainfall: ${rainfall}mm
        pH Level: ${ph}
        Location: ${location}
        Season: ${season}
        
        CRITICAL INSTRUCTION: You MUST translate ALL output text (including cropName, reason, and actionPlan) into ${language || 'English'}.
        
        Provide the response strictly in JSON format matching this schema:
        {
          "recommendations": [
            {
              "cropName": "Name of the crop in ${language || 'English'}",
              "matchPercentage": 95,
              "isPrimary": true,
              "reason": "Detailed scientific reason why this crop is suitable in ${language || 'English'}",
              "actionPlan": "Short action plan or tip for planting in ${language || 'English'}"
            }
          ]
        }
      `;

      const response = await generateWithRetry({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    cropName: { type: Type.STRING },
                    matchPercentage: { type: Type.NUMBER },
                    isPrimary: { type: Type.BOOLEAN },
                    reason: { type: Type.STRING },
                    actionPlan: { type: Type.STRING }
                  },
                  required: ['cropName', 'matchPercentage', 'isPrimary', 'reason', 'actionPlan']
                }
              }
            },
            required: ['recommendations']
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.warn('Recommendation Error:', error?.message);
      const isUnavailable = error?.status === 503 || error?.status === 'UNAVAILABLE' || error?.message?.includes('503');
      const isRateLimit = error?.status === 429 || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429');
      let errorMessage = 'Failed to generate recommendations. Please try again.';
      if (isUnavailable) {
        errorMessage = 'The AI model is currently experiencing high demand. Please try again in a few moments.';
      } else if (isRateLimit) {
        errorMessage = 'The API rate limit (quota) has been exceeded. Please wait a few seconds and try again.';
      }
      res.status(500).json({ error: errorMessage, details: error.message });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, context, language } = req.body;
      
      const systemPrompt = `You are an expert agricultural assistant bot named AgriSmart AI. 
       CRITICAL INSTRUCTION: You MUST translate and respond strictly in ${language || 'English'}. 
       Even if the user asks in English, your final response MUST be fully written in ${language || 'English'}.
       Context about the farmer's current soil/location: ${JSON.stringify(context)}.
      Keep answers concise, actionable, and friendly.`;

      const response = await generateWithRetry({
        model: 'gemini-3.5-flash',
        contents: [
           { role: 'user', parts: [{ text: systemPrompt + "\n\nUser message: " + message }] }
        ]
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.warn('Chat Error:', error?.message);
      const isUnavailable = error?.status === 503 || error?.status === 'UNAVAILABLE' || error?.message?.includes('503');
      const isRateLimit = error?.status === 429 || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429');
      let errorMessage = 'Failed to generate chat response. Please try again.';
      if (isUnavailable) {
        errorMessage = 'The AI model is currently experiencing high demand. Please try again in a few moments.';
      } else if (isRateLimit) {
        errorMessage = 'The API rate limit (quota) has been exceeded. Please wait a few seconds and try again.';
      }
      res.status(500).json({ error: errorMessage, details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

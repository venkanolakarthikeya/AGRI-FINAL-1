import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit to accommodate base64 images
  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini API
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const fallbackModels = [
    'gemini-3.5-flash',
    'gemini-2.5-flash',
    'gemini-flash-latest'
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
        const isNotFound = error?.status === 404 || error?.status === 'NOT_FOUND' || error?.message?.includes('404');
        
        if (isUnavailable || isRateLimit || isNotFound) {
          if (attempt < fallbackModels.length) {
            console.log(`[Gemini API] Error (${error?.status}) on ${fallbackModels[attempt - 1]}. Instantly switching to ${fallbackModels[attempt]}...`);
            continue;
          }
        }
        throw error;
      }
    }
    throw new Error('Failed after retrying all fallback models');
  }

  // API Routes
  app.post('/api/extract-soil-card', async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ error: "Image data is required" });
      }

      // Remove the data:image/jpeg;base64, prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const prompt = `
        You are an expert AI agricultural assistant. 
        Analyze this image of a Soil Health Card or soil test report.
        Extract the following values if they exist:
        - Nitrogen (N) in kg/ha
        - Phosphorus (P) in kg/ha
        - Potassium (K) in kg/ha
        - pH Level

        If a value is not found, return an empty string for it.
        Return ONLY a JSON object matching this schema.
      `;

      const response = await generateWithRetry({
        model: 'gemini-3.5-flash',
        contents: [
          { role: 'user', parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
          ]}
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              n: { type: Type.STRING },
              p: { type: Type.STRING },
              k: { type: Type.STRING },
              ph: { type: Type.STRING }
            },
            required: ['n', 'p', 'k', 'ph']
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.warn('Extraction Error:', error?.message);
      res.status(500).json({ error: 'Failed to extract data from image', details: error.message });
    }
  });

  app.post('/api/recommend', async (req, res) => {
    try {
      const { n, p, k, temperature, humidity, rainfall, ph, location, season, language } = req.body;
      
      const prompt = `
        You are an expert AI agricultural assistant. Based on the following data, recommend the top 3 crops.
        Soil N: ${n || "Not provided (estimate based on location)"}, P: ${p || "Not provided"}, K: ${k || "Not provided"}
        Temperature: ${temperature}°C
        Humidity: ${humidity}%
        Rainfall: ${rainfall}mm
        pH Level: ${ph || "Not provided (estimate based on location)"}
        Location: ${location}
        Season: ${season}
        
        CRITICAL INSTRUCTION: You MUST translate ALL output text (including cropName, reason, and actionPlan) natively into ${language || 'English'} using local terminology familiar to farmers. If the language is Hindi or Telugu, you MUST use the native script. IF THE LANGUAGE IS ENGLISH, YOU MUST STRICTLY OUTPUT ONLY IN ENGLISH, regardless of the location.
        
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
        model: 'gemini-flash-latest',
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
      
      const systemPrompt = `You are AgriSmart AI, an expert agricultural assistant dedicated to helping farmers.\n        CRITICAL INSTRUCTION: You MUST communicate fluently in the user's preferred language: ${language || 'English'}.\n        If the preferred language is Hindi or Telugu, you MUST write your entire response natively in that language. IF THE PREFERRED LANGUAGE IS ENGLISH, YOU MUST STRICTLY OUTPUT ONLY IN ENGLISH, regardless of the user's location or regional terms.\n        Understand that farmers may ask questions using local, regional terms or Romanized Hindi/Telugu (e.g., \"khad\", \"eruvulu\").\n        Keep your answers concise, practical, actionable, and friendly. Avoid overly complex scientific jargon; speak like a knowledgeable local agronomist.\n        Context about the farmer's current soil/location: ${JSON.stringify(context)}.`;

      const response = await generateWithRetry({
        model: 'gemini-flash-latest',
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

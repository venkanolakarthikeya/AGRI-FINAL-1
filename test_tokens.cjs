const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.generateContent({ 
      model: 'gemini-3.1-flash-lite', 
      contents: "Hello",
      config: { maxOutputTokens: 8192 }
    });
    console.log("SUCCEEDED!");
  } catch (e) {
    console.log("FAILED:", e.status, e.message);
  }
}
test();

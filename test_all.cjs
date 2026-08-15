const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const models = [
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-pro-latest'
];
async function test() {
  for (const m of models) {
    try {
      await ai.models.generateContent({ model: m, contents: "Hi" });
      console.log(m, "SUCCEEDED!");
    } catch(e) {
      console.log(m, "FAILED:", e.status, e.message.substring(0, 50));
    }
  }
}
test();

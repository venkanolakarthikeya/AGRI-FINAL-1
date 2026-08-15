const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  const models = ['gemini-3.7-flash', 'gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.5-flash-latest'];
  for (const m of models) {
    try {
      await ai.models.generateContent({ model: m, contents: "Hello" });
      console.log(m, "WORKS");
    } catch (e) {
      console.log(m, "FAILS", e.status || e.message);
    }
  }
}
test();

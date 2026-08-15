const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  const models = ['gemini-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro'];
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

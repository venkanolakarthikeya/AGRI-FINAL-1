const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-3.0-flash'];
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

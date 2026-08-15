const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    await ai.models.generateContent({ model: 'gemini-3.1-flash-lite', contents: "Test" });
    console.log("3.1-flash-lite Works");
  } catch(e) {
    console.log("3.1-flash-lite Failed:", e.status, e.message);
  }
}
test();

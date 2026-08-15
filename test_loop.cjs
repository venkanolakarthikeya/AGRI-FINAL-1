const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  for(let i = 0; i < 5; i++) {
    try {
      await ai.models.generateContent({ model: 'gemini-3.1-flash-lite', contents: "Say test" });
      console.log("Success", i);
    } catch(e) {
      console.log("Error", i, e.status);
    }
  }
}
test();

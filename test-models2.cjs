const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const models = ['gemini-1.5-pro-latest', 'gemini-1.5-flash-latest'];
  for (const m of models) {
    try {
      await ai.models.generateContent({ model: m, contents: 'hello' });
      console.log(m, 'SUCCESS');
    } catch(e) {
      console.log(m, 'ERROR', e.status, e.message);
    }
  }
}
run();

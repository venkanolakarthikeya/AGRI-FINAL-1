const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.list();
    const names = response.models.map(m => m.name);
    console.log(names.filter(n => n.includes('gemini')));
  } catch(e) {
    console.log(e);
  }
}
run();

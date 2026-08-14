const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.list();
    for (const model of response.models) {
      if (model.name.includes('gemini')) {
        console.log(model.name);
      }
    }
  } catch(e) {
    console.log(e);
  }
}
run();

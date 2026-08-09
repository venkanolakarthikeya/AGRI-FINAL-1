import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function testModel(model) {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: 'Hello'
    });
    console.log(model, 'SUCCESS');
  } catch (e) {
    console.log(model, 'FAILED:', e.message);
  }
}
async function run() {
  await testModel('gemini-3.6-flash');
  await testModel('gemini-3.6-pro');
  await testModel('gemini-2.0-flash');
}
run();

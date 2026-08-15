const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const fallbackModels = [
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-1.5-flash',
  'gemini-pro-latest'
];

async function generateWithRetry(modelArgs) {
  const maxRetriesPerModel = 2;
  let fallbackIndex = 0;
  
  while (fallbackIndex < fallbackModels.length) {
    const currentModel = fallbackModels[fallbackIndex];
    let retryCount = 0;
    
    while (retryCount < maxRetriesPerModel) {
      try {
        const config = modelArgs.config || {};
        config.maxOutputTokens = config.maxOutputTokens || 8192;
        
        console.log(`Trying ${currentModel}...`);
        const res = await ai.models.generateContent({ 
          ...modelArgs, 
          model: currentModel,
          config: config
        });
        console.log(`${currentModel} SUCCEEDED!`);
        return res;
      } catch (error) {
        console.log(`Error on ${currentModel}: ${error.status} - ${error.message}`);
        const isUnavailable = error?.status === 503 || error?.status === 'UNAVAILABLE' || error?.message?.includes('503');
        const isRateLimit = error?.status === 429 || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429');
        const isNotFound = error?.status === 404 || error?.status === 'NOT_FOUND' || error?.message?.includes('404');
        const isTokenError = error?.message?.toLowerCase().includes('token');

        if (isNotFound) {
          console.warn(`[Gemini API] Model ${currentModel} not found, switching to next model...`);
          break; // Go to next model instantly
        }

        if (isRateLimit) {
          console.warn(`[Gemini API] Rate limit (429) hit on ${currentModel}. Switching to next model instantly...`);
          break; // Go to next model instantly to avoid user waiting
        }

        if (isUnavailable || isTokenError) {
          retryCount++;
          if (retryCount >= maxRetriesPerModel) {
            console.warn(`[Gemini API] Model ${currentModel} failed after ${maxRetriesPerModel} retries.`);
            break; // Go to next model
          }
          const delayMs = 1500;
          console.log(`[Gemini API] Error on ${currentModel} (Attempt ${retryCount}). Retrying in ${delayMs}ms...`);
          // simulate wait
          continue;
        }
        
        // For other errors, throw immediately
        throw error;
      }
    }
    fallbackIndex++;
  }
  throw new Error('Our AI service is experiencing heavy traffic or a temporary issue. Please try again in a moment.');
}

generateWithRetry({
  contents: "Hello"
}).then(() => console.log("Done")).catch(e => console.error(e));

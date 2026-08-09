export type ViewState = 'dashboard' | 'soil' | 'recommendations' | 'weather' | 'chatbot' | 'settings';
export type Language = 'English' | 'Hindi' | 'Telugu';

export interface SoilData {
  n: string;
  p: string;
  k: string;
  temperature: string;
  humidity: string;
  rainfall: string;
  ph: string;
  location: string;
  season: string;
}

export interface Recommendation {
  cropName: string;
  matchPercentage: number;
  isPrimary: boolean;
  reason: string;
  actionPlan: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

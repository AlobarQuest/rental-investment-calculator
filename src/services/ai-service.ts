// AI Service Interface
// Provides abstraction over AI providers for future flexibility

export interface AIServiceConfig {
  apiEndpoint?: string;
  model?: string;
  maxTokens?: number;
}

export interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIService {
  generate(prompt: string, systemPrompt?: string): Promise<AIResponse>;
}

// Example implementation for Gemini
export class GeminiService implements AIService {
  private config: AIServiceConfig;
  
  constructor(config: AIServiceConfig = {}) {
    this.config = {
      apiEndpoint: config.apiEndpoint || '/api/gemini',
      model: config.model || 'gemini-pro',
      maxTokens: config.maxTokens || 1000
    };
  }
  
  async generate(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    const response = await fetch(this.config.apiEndpoint!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemPrompt,
        model: this.config.model,
        maxTokens: this.config.maxTokens
      })
    });
    
    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      text: data.text || data.content || '',
      usage: data.usage
    };
  }
}

// Factory function for easy instantiation
export function createAIService(
  provider: 'gemini' = 'gemini', 
  config?: AIServiceConfig
): AIService {
  switch (provider) {
    case 'gemini':
      return new GeminiService(config);
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}

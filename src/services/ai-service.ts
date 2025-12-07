export interface AIServiceInterface {
  generateResponse(prompt: string, options?: AIGenerationOptions): Promise<AIResponse>;
  generateCompletion(messages: ChatMessage[], options?: AICompletionOptions): Promise<AICompletionResponse>;
  generateEmbedding(text: string): Promise<number[]>;
  analyzeText(text: string, analysisType: TextAnalysisType): Promise<TextAnalysisResult>;
  summarizeText(text: string, maxLength?: number): Promise<string>;
  translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string>;
  classifyText(text: string, categories: string[]): Promise<TextClassificationResult>;
  extractEntities(text: string): Promise<EntityExtractionResult>;
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult>;
  transcribeAudio(audioData: Buffer, options?: TranscriptionOptions): Promise<TranscriptionResult>;
  synthesizeSpeech(text: string, options?: SpeechSynthesisOptions): Promise<Buffer>;
  moderateContent(content: string): Promise<ContentModerationResult>;
  getModelInfo(): Promise<ModelInfo>;
  setApiKey(apiKey: string): void;
  setModel(modelName: string): void;
  isConfigured(): boolean;
  getUsageStats(): Promise<UsageStats>;
}

export interface AIGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  model?: string;
}

export interface AICompletionOptions extends AIGenerationOptions {
  systemMessage?: string;
  tools?: AITool[];
  toolChoice?: 'auto' | 'none' | string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  toolCallId?: string;
}

export interface AIResponse {
  content: string;
  tokenCount: number;
  finishReason: 'stop' | 'length' | 'content_filter' | 'tool_calls';
  model: string;
  usage: TokenUsage;
}

export interface AICompletionResponse extends AIResponse {
  messages: ChatMessage[];
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface AITool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: object;
  };
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export enum TextAnalysisType {
  SENTIMENT = 'sentiment',
  LANGUAGE_DETECTION = 'language_detection',
  KEY_PHRASES = 'key_phrases',
  TOPICS = 'topics',
  READABILITY = 'readability'
}

export interface TextAnalysisResult {
  type: TextAnalysisType;
  confidence: number;
  result: any;
  metadata?: Record<string, any>;
}

export interface TextClassificationResult {
  categories: Array<{
    label: string;
    confidence: number;
  }>;
  topCategory: string;
  confidence: number;
}

export interface EntityExtractionResult {
  entities: Array<{
    text: string;
    type: string;
    confidence: number;
    startIndex: number;
    endIndex: number;
  }>;
}

export interface ImageGenerationOptions {
  width?: number;
  height?: number;
  quality?: 'standard' | 'hd';
  style?: string;
  count?: number;
  model?: string;
}

export interface ImageGenerationResult {
  images: Array<{
    url?: string;
    base64?: string;
    revisedPrompt?: string;
  }>;
  usage?: TokenUsage;
}

export interface TranscriptionOptions {
  language?: string;
  model?: string;
  temperature?: number;
  prompt?: string;
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  timestampGranularities?: Array<'word' | 'segment'>;
}

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
  segments?: Array<{
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: number[];
    temperature: number;
    avgLogprob: number;
    compressionRatio: number;
    noSpeechProb: number;
  }>;
  words?: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}

export interface SpeechSynthesisOptions {
  voice?: string;
  model?: string;
  responseFormat?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm';
  speed?: number;
}

export interface ContentModerationResult {
  flagged: boolean;
  categories: Record<string, boolean>;
  categoryScores: Record<string, number>;
  reason?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  description?: string;
  maxTokens: number;
  capabilities: string[];
  pricing?: {
    inputTokens: number;
    outputTokens: number;
    currency: string;
  };
}

export interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  requestsByModel: Record<string, number>;
  tokensByModel: Record<string, number>;
  costByModel: Record<string, number>;
  period: {
    start: Date;
    end: Date;
  };
}

export abstract class BaseAIService implements AIServiceInterface {
  protected apiKey: string;
  protected model: string;
  protected baseURL?: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || '';
    this.model = model || '';
  }

  abstract generateResponse(prompt: string, options?: AIGenerationOptions): Promise<AIResponse>;
  abstract generateCompletion(messages: ChatMessage[], options?: AICompletionOptions): Promise<AICompletionResponse>;
  abstract generateEmbedding(text: string): Promise<number[]>;
  abstract analyzeText(text: string, analysisType: TextAnalysisType): Promise<TextAnalysisResult>;
  abstract summarizeText(text: string, maxLength?: number): Promise<string>;
  abstract translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string>;
  abstract classifyText(text: string, categories: string[]): Promise<TextClassificationResult>;
  abstract extractEntities(text: string): Promise<EntityExtractionResult>;
  abstract generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult>;
  abstract transcribeAudio(audioData: Buffer, options?: TranscriptionOptions): Promise<TranscriptionResult>;
  abstract synthesizeSpeech(text: string, options?: SpeechSynthesisOptions): Promise<Buffer>;
  abstract moderateContent(content: string): Promise<ContentModerationResult>;
  abstract getModelInfo(): Promise<ModelInfo>;
  abstract getUsageStats(): Promise<UsageStats>;

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setModel(modelName: string): void {
    this.model = modelName;
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.model;
  }
}
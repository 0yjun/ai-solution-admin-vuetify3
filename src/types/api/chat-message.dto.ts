export interface ChatMessageDto {
  sessionId: string;
  seq: number;
  query: string;
  llmResponse: string;
  keyword: string;
  intent: string;
  confidence: number;
  relevanceScores: number;
  latency: number;
  totalTime: number;
  requestTimestamp: string; // ISO 8601 형식
  responseTimestamp: string; // ISO 8601 형식
  completionTokens: number;
}

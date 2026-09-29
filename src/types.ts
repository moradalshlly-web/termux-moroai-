/**
 * MOROAI Type Definitions
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  provider?: string;
  model?: string;
  latency_ms?: number;
  toolsUsed?: boolean;
  error?: boolean;
}

export interface SendMessagePayload {
  message: string;
  tools: boolean;
}

export interface ChatApiResponse {
  ok: boolean;
  reply: string;
  provider?: string;
  model?: string;
  latency_ms?: number;
  error?: string;
}

export interface StatusApiResponse {
  ok: boolean;
  owner?: string;
  providers?: string[] | number | Record<string, unknown>;
  lessons?: number;
  episodes?: number;
  version?: string;
  uptime?: string;
}

export type DrawerTabId = 'chat' | 'knowledge' | 'tools' | 'status' | 'settings';

export interface DrawerNavigationItem {
  id: DrawerTabId;
  label: string;
  icon: string;
  description: string;
}

export interface SuggestionCardItem {
  id: string;
  emoji: string;
  title: string;
  description: string;
  prompt: string;
}

export interface ToolOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  addedAt: string;
  tags: string[];
}

export interface ConversationSession {
  id: string;
  title: string;
  date: string;
  messageCount: number;
}

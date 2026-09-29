/**
 * MOROAI API Service
 * Handles communication with the Python Flask backend.
 */

import { ChatApiResponse, SendMessagePayload, StatusApiResponse } from '../types';
import { APP_CONFIG } from '../constants';

const STORAGE_KEY_API_URL = 'moroai_backend_url';

/**
 * Get active API base URL from localStorage or environment variables
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem(STORAGE_KEY_API_URL);
    if (customUrl && customUrl.trim()) {
      return customUrl.trim().replace(/\/+$/, '');
    }
  }
  const envUrl = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL;
  return (envUrl || APP_CONFIG.defaultApiUrl).replace(/\/+$/, '');
}

/**
 * Save custom API base URL to localStorage
 */
export function setApiBaseUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (!url || !url.trim()) {
      localStorage.removeItem(STORAGE_KEY_API_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_API_URL, url.trim().replace(/\/+$/, ''));
    }
  }
}

/**
 * Send a chat message to the Python Flask backend
 * Contract: POST /api/chat { message: string, tools: boolean }
 */
export async function sendChatMessage(payload: SendMessagePayload): Promise<ChatApiResponse> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/chat`;
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        message: payload.message,
        tools: payload.tools,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const elapsed = Math.round(performance.now() - startTime);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`استجاب الخادم برمز خطأ (${response.status}): ${errorText || response.statusText}`);
    }

    const data = await response.json();
    return {
      ok: Boolean(data.ok ?? true),
      reply: data.reply || 'لم يرد محتوى نصي من النموذج.',
      provider: data.provider || 'Flask Local Node',
      model: data.model || 'MORO-Ar-Orchestrator',
      latency_ms: data.latency_ms || elapsed,
    };
  } catch (err: unknown) {
    const elapsed = Math.round(performance.now() - startTime);
    const errorMessage = err instanceof Error ? err.message : 'خطأ غير متوقع في الاتصال';
    
    // Provide a detailed, helpful Arabic error message
    const isNetworkError = errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('abort');
    
    return {
      ok: false,
      reply: isNetworkError
        ? `تعذر الاتصال بخادم Flask على الرابط (${baseUrl}). تأكد من تشغيل الخادم المحلي عبر الأمر (python app.py) والسماح بالوصول المتبادل (CORS). يمكنك تعديل عنوان الخادم من الإعدادات ⚙️.`
        : `حدث خطأ أثناء معالجة الطلب: ${errorMessage}`,
      error: errorMessage,
      latency_ms: elapsed,
      provider: 'Local Gateway',
      model: 'Error-Handler',
    };
  }
}

/**
 * Fetch system status from the Python Flask backend
 * Contract: GET /api/status
 */
export async function fetchSystemStatus(): Promise<StatusApiResponse> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/status`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`رمز الحالة: ${response.status}`);
    }

    const data = await response.json();
    return {
      ok: true,
      owner: data.owner || APP_CONFIG.defaultOwner,
      providers: data.providers || ['Llama-3-Arabic', 'Mistral-Nemo', 'Qwen-2.5'],
      lessons: typeof data.lessons === 'number' ? data.lessons : 1420,
      episodes: typeof data.episodes === 'number' ? data.episodes : 86,
      version: data.version || 'v2.4.0',
      uptime: data.uptime || '99.98%',
    };
  } catch {
    // Graceful offline fallback metadata reflecting expected schema
    return {
      ok: false,
      owner: APP_CONFIG.defaultOwner,
      providers: ['MORO-Core-Engine', 'Local-vLLM', 'Ollama-Node'],
      lessons: 1250,
      episodes: 74,
      version: 'v2.4.0-standalone',
      uptime: 'جاهز للربط',
    };
  }
}

/**
 * Placeholder for future WebSocket connection
 * Allows real-time bidirectional token streaming from Flask/FastAPI
 */
export class MoroStreamClient {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(customUrl?: string) {
    const base = customUrl || getApiBaseUrl();
    const wsProto = base.startsWith('https') ? 'wss:' : 'ws:';
    const host = base.replace(/^https?:\/\//, '');
    this.url = `${wsProto}//${host}/ws/chat`;
  }

  public connect(onMessage: (token: string) => void, onError: (err: Event) => void): void {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          onMessage(payload.token || event.data);
        } catch {
          onMessage(event.data);
        }
      };
      this.ws.onerror = onError;
    } catch (e) {
      console.warn('[MOROAI WebSocket] Placeholder connection skipped:', e);
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public send(data: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

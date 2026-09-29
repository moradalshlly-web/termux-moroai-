/**
 * ChatArea Component
 * Displays conversation messages with royal blue minimalism, code syntax formatting, metadata, and copy actions
 */

import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check, RotateCw, Sparkles, Terminal, AlertCircle, Wrench } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onRetry: () => void;
  onOpenSettings: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onRetry,
  onOpenSettings,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /**
   * Helper to render message content with code blocks formatted in JetBrains Mono
   */
  const renderFormattedContent = (content: string, msgId: string) => {
    // Split by code blocks ```...```
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        let language = 'code';
        let code = part.slice(3, -3);

        if (lines.length > 0 && /^[a-zA-Z0-9_-]+$/.test(lines[0].trim())) {
          language = lines[0].trim();
          code = lines.slice(1).join('\n');
        }

        const codeBlockId = `${msgId}-code-${index}`;

        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden border border-blue-600/30 bg-[#060c1d] shadow-lg text-left" dir="ltr">
            {/* Code Block Header */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a142c] border-b border-blue-900/40 text-xs text-[#9BB1D0] font-mono">
              <span className="flex items-center gap-1.5 text-sky-400 font-semibold text-[11px]">
                <Terminal className="w-3.5 h-3.5" />
                <span>{language}</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(code, codeBlockId)}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] hover:bg-blue-800/40 hover:text-white transition-colors"
              >
                {copiedId === codeBlockId ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>نسخ الكود</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Code Content */}
            <pre className="p-3 text-xs sm:text-sm font-mono overflow-x-auto text-[#E2E8F0] leading-relaxed selection:bg-blue-700/40">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Normal text: split into paragraphs
      const paragraphs = part.split('\n\n').filter(Boolean);
      return (
        <div key={index} className="space-y-2.5">
          {paragraphs.map((p, pIdx) => {
            // Check if bullet lines
            const lines = p.split('\n');
            if (lines.some(l => l.trim().startsWith('- ') || l.trim().startsWith('* ') || l.trim().startsWith('• '))) {
              return (
                <ul key={pIdx} className="space-y-1 my-1.5 list-disc list-inside text-right">
                  {lines.map((line, lIdx) => {
                    const cleanLine = line.replace(/^[-*•]\s*/, '').trim();
                    return cleanLine ? <li key={lIdx} className="leading-relaxed">{cleanLine}</li> : null;
                  })}
                </ul>
              );
            }
            return (
              <p key={pIdx} className="leading-relaxed whitespace-pre-wrap">
                {p}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-[820px] mx-auto px-4 pt-4 pb-36 space-y-6">
      {messages.map((message) => {
        const isUser = message.role === 'user';

        if (isUser) {
          return (
            <div key={message.id} className="flex justify-start">
              <div className="max-w-[88%] sm:max-w-[78%] rounded-2xl rounded-tr-sm px-4 py-3 bg-gradient-to-r from-blue-700/60 to-blue-600/70 border border-blue-400/30 text-white shadow-md shadow-blue-900/20 backdrop-blur-md">
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <div className="mt-1 flex items-center justify-end gap-2 text-[10px] text-blue-200/70">
                  {message.toolsUsed && (
                    <span className="flex items-center gap-1 text-sky-200">
                      <Wrench className="w-2.5 h-2.5" />
                      الأدوات
                    </span>
                  )}
                  <span>{message.timestamp}</span>
                </div>
              </div>
            </div>
          );
        }

        // Assistant Message
        return (
          <div key={message.id} className="flex gap-3 sm:gap-4 items-start">
            {/* MOROAI Avatar */}
            <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center font-mono font-bold text-white text-sm shadow-md shadow-blue-600/30 mt-1 select-none">
              M
            </div>

            {/* Message Bubble Container */}
            <div className="flex-1 min-w-0">
              <div className={`p-4 sm:p-5 rounded-2xl rounded-tl-sm glass-panel border transition-all ${
                message.error
                  ? 'border-rose-500/40 bg-rose-950/20'
                  : 'border-blue-600/20 hover:border-blue-500/30'
              }`}>
                {/* Content */}
                <div className="text-sm sm:text-base text-[#E8EEF5]">
                  {renderFormattedContent(message.content, message.id)}
                </div>

                {/* Error Banner with helpful troubleshooting */}
                {message.error && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-rose-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>تعذر استلام رد من خادم Flask المحلي</span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={onOpenSettings}
                        className="px-2.5 py-1 rounded-lg bg-rose-900/50 hover:bg-rose-800/60 border border-rose-500/30 text-rose-100 transition-colors"
                      >
                        الإعدادات
                      </button>
                      <button
                        type="button"
                        onClick={onRetry}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>إعادة المحاولة</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Metadata & Actions */}
                {!message.error && (
                  <div className="mt-3 pt-3 border-t border-blue-900/30 flex flex-wrap items-center justify-between gap-2 text-xs text-[#8A9EB8]">
                    {/* Model & Latency Telemetry */}
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      {message.model && (
                        <span className="text-sky-300 font-medium">
                          {message.model}
                        </span>
                      )}
                      {message.provider && (
                        <>
                          <span className="text-blue-600">·</span>
                          <span className="text-[#9BB1D0]">{message.provider}</span>
                        </>
                      )}
                      {typeof message.latency_ms === 'number' && (
                        <>
                          <span className="text-blue-600">·</span>
                          <span className="tabular-nums text-blue-400">
                            {message.latency_ms}ms
                          </span>
                        </>
                      )}
                    </div>

                    {/* Actions: Copy */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(message.content, message.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-900/30 hover:text-white transition-colors"
                        title="نسخ الرد"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">نسخ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Loading state indicator with pulsing animated dots */}
      {isLoading && (
        <div className="flex gap-3 sm:gap-4 items-start animate-fade-in">
          <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center font-mono font-bold text-white text-sm shadow-md shadow-blue-600/30 mt-1 select-none animate-pulse">
            M
          </div>
          <div className="px-5 py-4 rounded-2xl rounded-tl-sm glass-panel border border-blue-500/30 flex items-center gap-3">
            <span className="text-xs sm:text-sm text-sky-200">
              جاري تفكير وتنسيق الإجابة...
            </span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-sky-300 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
};

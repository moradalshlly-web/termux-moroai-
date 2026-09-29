/**
 * Composer Component
 * Floating bottom glass container (rounded-24px), tools chip, auto-resizing input, 42px circular send button
 */

import React, { useRef, useEffect } from 'react';
import { Send, Wrench, Sparkles, Loader2 } from 'lucide-react';
import { APP_CONFIG } from '../constants';

interface ComposerProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  toolsEnabled: boolean;
  onToggleTools: () => void;
}

export const Composer: React.FC<ComposerProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  toolsEnabled,
  onToggleTools,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height up to 180px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 44), 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSend();
      }
    }
  };

  const canSend = Boolean(input.trim()) && !isLoading;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none px-4 pb-4 sm:pb-6 pt-6 bg-gradient-to-t from-[#050810] via-[#050810]/80 to-transparent">
      <div className="max-w-[820px] mx-auto pointer-events-auto">
        
        {/* Floating Glass Container (border-radius: 24px) */}
        <div className="relative rounded-[24px] glass-input shadow-2xl shadow-blue-950/40 p-2 sm:p-2.5 transition-all duration-300 focus-within:border-blue-500/60 focus-within:shadow-[0_0_25px_rgba(37,99,235,0.25)]">
          
          <div className="flex items-end gap-2">

            {/* Right side (RTL start): Tools Toggle Chip (Pill shape) */}
            <div className="shrink-0 mb-1">
              <button
                type="button"
                onClick={onToggleTools}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer select-none ${
                  toolsEnabled
                    ? 'bg-blue-600/30 text-sky-300 border border-blue-400/50 shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                    : 'bg-blue-950/40 text-[#9BB1D0] border border-blue-800/30 hover:bg-blue-900/40 hover:text-white'
                }`}
                title={toolsEnabled ? 'الأدوات مفعلة: استرجاع البيانات والبرمجة' : 'انقر لتفعيل أدوات البحث والتحليل'}
              >
                <Wrench className={`w-3.5 h-3.5 ${toolsEnabled ? 'text-sky-300' : 'text-blue-400/70'}`} />
                <span className="hidden sm:inline">
                  {toolsEnabled ? 'الأدوات نشطة' : 'الأدوات'}
                </span>
                {toolsEnabled && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                )}
              </button>
            </div>

            {/* Middle: Auto-resizing Textarea */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب استفسارك أو طلبك لـ MOROAI هنا..."
                rows={1}
                disabled={isLoading}
                dir="rtl"
                className="w-full bg-transparent text-[#E8EEF5] placeholder-[#6C82A3] text-sm sm:text-base resize-none outline-none py-2 px-2 max-h-[180px] overflow-y-auto leading-relaxed"
              />
            </div>

            {/* Left side (RTL end): Circular Send Button (42px, blue gradient) */}
            <div className="shrink-0 mb-0.5">
              <button
                type="button"
                onClick={onSend}
                disabled={!canSend}
                aria-label="إرسال الرسالة"
                className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all duration-200 ${
                  canSend
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-600/40 hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-blue-950/40 text-[#546A8B] border border-blue-900/30 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-sky-200" />
                ) : (
                  <Send className="w-4 h-4 rtl:-scale-x-100 transform text-white translate-x-[-1px]" />
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Disclaimer / Hint Text Below Composer */}
        <p className="text-center text-[11px] text-[#6C82A3] mt-2 select-none">
          {APP_CONFIG.disclaimer}
        </p>

      </div>
    </div>
  );
};

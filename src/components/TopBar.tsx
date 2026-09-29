/**
 * TopBar Component
 * Fixed 64px glassmorphism top navigation bar
 */

import React from 'react';
import { Menu, Plus, Sparkles, Terminal } from 'lucide-react';
import { APP_CONFIG } from '../constants';

interface TopBarProps {
  onToggleDrawer: () => void;
  onNewChat: () => void;
  hasMessages: boolean;
  isBackendConnected: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleDrawer,
  onNewChat,
  hasMessages,
  isBackendConnected,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-30 bg-[#050810]/70 backdrop-blur-xl border-b border-blue-600/20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        
        {/* Right Zone (RTL Start): Logo + Brand Title + Tagline */}
        <div className="flex items-center gap-3 select-none">
          <div className="relative group cursor-pointer" onClick={onNewChat} title="العودة للشاشة الرئيسية">
            <div className="w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30 group-hover:shadow-blue-500/50 transition-all duration-300">
              <span className="font-mono text-xl tracking-tighter">M</span>
            </div>
            {/* Subtle glow beacon */}
            <div className="absolute -inset-0.5 rounded-xl bg-blue-500/20 blur-sm -z-10 group-hover:bg-blue-400/40 transition-all" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-wide bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                {APP_CONFIG.name}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-950/80 text-blue-300 border border-blue-700/30">
                <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                <span>v2.4</span>
              </span>
            </div>
            <span className="text-[11px] text-[#A0B0CB] tracking-tight leading-none mt-0.5">
              {APP_CONFIG.tagline}
            </span>
          </div>
        </div>

        {/* Left Zone (RTL End): Actions & Hamburger Drawer Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Backend Connection Indicator */}
          <div 
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-blue-950/40 border border-blue-700/20 text-[#A0B0CB]"
            title={isBackendConnected ? 'الخادم متصل وجاهز' : 'وضع الاستعداد / في انتظار تشغيل خادم Flask'}
          >
            <span 
              className={`w-2 h-2 rounded-full ${
                isBackendConnected 
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' 
                  : 'bg-amber-400/80 shadow-[0_0_6px_#fbbf24]'
              }`} 
            />
            <span className="text-[11px]">
              {isBackendConnected ? 'Flask متصل' : 'محلي'}
            </span>
          </div>

          {/* New Chat Button (visible when conversation is ongoing) */}
          {hasMessages && (
            <button
              type="button"
              onClick={onNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-blue-200 bg-blue-900/30 hover:bg-blue-800/40 border border-blue-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              title="بدء محادثة جديدة"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">محادثة جديدة</span>
            </button>
          )}

          {/* Hamburger Drawer Toggle Button */}
          <button
            type="button"
            onClick={onToggleDrawer}
            aria-label="فتح لوحة التحكم"
            className="p-2 rounded-xl text-blue-200 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-600/20 hover:border-blue-500/40 transition-all duration-200 active:scale-95"
            title="لوحة التحكم"
          >
            <Menu className="w-5 h-5 text-blue-300" />
          </button>
        </div>

      </div>
    </header>
  );
};

/**
 * Drawer Component
 * Slides from the RIGHT (RTL start/edge) with width 320px, glass background, 5 nav tabs, and bottom status panel
 */

import React from 'react';
import { X, RefreshCw, ChevronLeft, Check, ExternalLink } from 'lucide-react';
import { DRAWER_NAV_ITEMS, APP_CONFIG } from '../constants';
import { DrawerTabId, StatusApiResponse, ToolOption, ConversationSession } from '../types';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: DrawerTabId;
  onSelectTab: (tab: DrawerTabId) => void;
  statusData: StatusApiResponse | null;
  isLoadingStatus: boolean;
  onRefreshStatus: () => void;
  // Extra interactive state for tabs
  conversations: ConversationSession[];
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  tools: ToolOption[];
  onToggleTool: (toolId: string) => void;
  apiUrl: string;
  onUpdateApiUrl: (newUrl: string) => void;
  isSimulatedMode: boolean;
  onToggleSimulatedMode: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  statusData,
  isLoadingStatus,
  onRefreshStatus,
  conversations,
  onSelectConversation,
  onNewChat,
  tools,
  onToggleTool,
  apiUrl,
  onUpdateApiUrl,
  isSimulatedMode,
  onToggleSimulatedMode,
}) => {
  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel: Slides from the RIGHT in RTL */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-[320px] max-w-[85vw] bg-[#070e24]/90 backdrop-blur-2xl border-l border-blue-600/20 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="لوحة التحكم"
      >
        {/* Top Header: "لوحة التحكم" + Close Button */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-blue-700/20">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-sky-400 font-mono text-sm">
                ⚙️
              </div>
              <h2 className="text-base font-bold text-[#E8EEF5]">
                لوحة التحكم
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9BB1D0] hover:text-white hover:bg-blue-900/40 transition-colors"
              aria-label="إغلاق لوحة التحكم"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 5 Navigation Items */}
          <div className="p-3 border-b border-blue-800/20">
            <nav className="space-y-1">
              {DRAWER_NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-right text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/25 text-sky-300 border border-blue-500/40 shadow-sm'
                        : 'text-[#A0B0CB] hover:bg-blue-950/50 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base select-none">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <ChevronLeft className={`w-3.5 h-3.5 text-blue-400/70 transition-transform ${isActive ? 'rotate-90 text-sky-300' : ''}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content Section (Dynamic detail view according to active tab) */}
          <div className="p-4 max-h-[36vh] overflow-y-auto">
            {activeTab === 'chat' && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    onNewChat();
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
                >
                  + بدء محادثة جديدة
                </button>
                <div className="text-[11px] text-[#7E93B0] font-medium pt-1">
                  المحادثات السابقة:
                </div>
                <div className="space-y-1.5">
                  {conversations.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onSelectConversation(c.id);
                        onClose();
                      }}
                      className="w-full text-right p-2 rounded-lg bg-blue-950/40 hover:bg-blue-900/30 border border-blue-900/30 text-xs text-[#CBD5E1] truncate block transition-colors"
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="space-y-2 text-xs">
                <div className="text-[11px] text-[#7E93B0] leading-relaxed">
                  قاعدة المعرفة الحية المدمجة في نموذج MOROAI:
                </div>
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/30 text-[#CBD5E1] space-y-1.5">
                  <div className="flex items-center justify-between font-semibold text-sky-300">
                    <span>المدونة اللغوية العربية</span>
                    <span className="text-[10px] text-emerald-400">مفعلة</span>
                  </div>
                  <p className="text-[11px] text-[#8EA2BF]">
                    قواعد النحو، البلاغة، والمعاجم العربية الكبرى مدعمة في الذاكرة الدلالية.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/30 text-[#CBD5E1] space-y-1.5">
                  <div className="flex items-center justify-between font-semibold text-sky-300">
                    <span>مكتبة الأكواد والمكتبات</span>
                    <span className="text-[10px] text-emerald-400">مفعلة</span>
                  </div>
                  <p className="text-[11px] text-[#8EA2BF]">
                    توثيق كامل لمكتبات Python, TypeScript, PyTorch, LangChain.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-2">
                <div className="text-[11px] text-[#7E93B0]">
                  تخصيص أدوات التنفيذ المباشرة:
                </div>
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => onToggleTool(tool.id)}
                    className="p-2 rounded-lg bg-blue-950/40 border border-blue-900/30 flex items-center justify-between text-xs cursor-pointer hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="pr-1 text-right">
                      <div className="font-medium text-[#E2E8F0] text-xs">
                        {tool.name}
                      </div>
                      <div className="text-[10px] text-[#8EA2BF] line-clamp-1">
                        {tool.description}
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      tool.enabled
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'border-blue-800 bg-transparent'
                    }`}>
                      {tool.enabled && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'status' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-[#7E93B0]">
                  <span>تشخيص الاتصال المباشر:</span>
                  <button
                    type="button"
                    onClick={onRefreshStatus}
                    className="text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingStatus ? 'animate-spin' : ''}`} />
                    <span>تحديث</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/30 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-[#8EA2BF]">
                    <span>حالة الخادم:</span>
                    <span className={statusData?.ok ? 'text-emerald-400' : 'text-amber-400'}>
                      {statusData?.ok ? 'متصل (Online)' : 'محلي (Offline)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#8EA2BF]">
                    <span>الإصدار:</span>
                    <span className="text-white">{statusData?.version || 'v2.4.0'}</span>
                  </div>
                  <div className="flex justify-between text-[#8EA2BF]">
                    <span>جاهزية النظام:</span>
                    <span className="text-sky-300">{statusData?.uptime || '99.9%'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] text-[#7E93B0] mb-1">
                    رابط خادم Flask المحلي (API Base URL):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={apiUrl}
                    onChange={(e) => onUpdateApiUrl(e.target.value)}
                    placeholder="http://localhost:5000"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-blue-950/60 border border-blue-700/40 text-sky-200 font-mono text-xs focus:outline-none focus:border-blue-400"
                  />
                  <span className="text-[10px] text-[#6C82A3] mt-1 block">
                    يتم إرسال طلبات POST /api/chat إلى هذا الرابط.
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-blue-950/30 border border-blue-900/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#E2E8F0] block">وضع المحاكاة التجريبي</span>
                    <span className="text-[10px] text-[#6C82A3]">الرد تلقائياً إذا كان الخادم مغلقاً</span>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleSimulatedMode}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      isSimulatedMode ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      isSimulatedMode ? 'right-5' : 'right-1'
                    }`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Status Panel (Required: owner, providers, lessons, episodes) */}
        <div className="p-3.5 m-3 rounded-2xl bg-[#091533]/80 border border-blue-600/30 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-sky-300">
              حالة المنظومة (System Status)
            </span>
            <button
              type="button"
              onClick={onRefreshStatus}
              disabled={isLoadingStatus}
              title="تحديث الحالة من خادم Flask"
              className="p-1 rounded text-[#8EA2BF] hover:text-white hover:bg-blue-900/40 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingStatus ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono">
            {/* Owner */}
            <div className="flex items-center justify-between text-[#8EA2BF]">
              <span>المالك (Owner):</span>
              <span className="text-[#E2E8F0] font-sans font-medium truncate max-w-[150px]">
                {statusData?.owner || APP_CONFIG.defaultOwner}
              </span>
            </div>

            {/* Providers */}
            <div className="flex items-center justify-between text-[#8EA2BF]">
              <span>المزودون (Providers):</span>
              <span className="text-sky-300">
                {Array.isArray(statusData?.providers)
                  ? `${statusData.providers.length} مزودين نشطين`
                  : typeof statusData?.providers === 'number'
                  ? `${statusData.providers} مزودين`
                  : '3 مزودين'}
              </span>
            </div>

            {/* Lessons */}
            <div className="flex items-center justify-between text-[#8EA2BF]">
              <span>الدروس (Lessons):</span>
              <span className="text-emerald-400 tabular-nums">
                {statusData?.lessons?.toLocaleString('ar-EG') || (1420).toLocaleString('ar-EG')}
              </span>
            </div>

            {/* Episodes */}
            <div className="flex items-center justify-between text-[#8EA2BF]">
              <span>الجولات (Episodes):</span>
              <span className="text-blue-300 tabular-nums">
                {statusData?.episodes?.toLocaleString('ar-EG') || (86).toLocaleString('ar-EG')}
              </span>
            </div>
          </div>

          {/* Connection status tag */}
          <div className="mt-2.5 pt-2 border-t border-blue-900/40 flex items-center justify-between text-[10px]">
            <span className="text-[#7E93B0]">نقطة النهاية:</span>
            <span className="text-[#9BB1D0] font-mono truncate max-w-[160px]" dir="ltr">
              {apiUrl}
            </span>
          </div>
        </div>

      </aside>
    </>
  );
};

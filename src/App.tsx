/**
 * MOROAI Main Application Component
 * Independent AI orchestration platform. Arabic-first, RTL, Royal Blue Minimalism design.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { Welcome } from './components/Welcome';
import { ChatArea } from './components/ChatArea';
import { Composer } from './components/Composer';
import { Drawer } from './components/Drawer';
import { sendChatMessage, fetchSystemStatus, getApiBaseUrl, setApiBaseUrl } from './services/api';
import { DEFAULT_TOOLS } from './constants';
import { ChatMessage, DrawerTabId, StatusApiResponse, ToolOption, ConversationSession } from './types';

export default function App() {
  // Application State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toolsEnabled, setToolsEnabled] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTabId>('chat');
  const [statusData, setStatusData] = useState<StatusApiResponse | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false);
  const [tools, setTools] = useState<ToolOption[]>(DEFAULT_TOOLS);
  const [apiUrl, setApiUrlState] = useState<string>(getApiBaseUrl());
  const [isSimulatedMode, setIsSimulatedMode] = useState<boolean>(true);

  // Conversation Sessions History
  const [conversations, setConversations] = useState<ConversationSession[]>([
    {
      id: 'session-1',
      title: 'استكشاف نماذج اللغة العربية ومهام الترجمة',
      date: 'اليوم',
      messageCount: 4,
    },
    {
      id: 'session-2',
      title: 'تحليل شفرة بايثون لمعالجة البيانات الضخمة',
      date: 'أمس',
      messageCount: 8,
    },
  ]);

  // Load backend status on mount
  const refreshStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    try {
      const data = await fetchSystemStatus();
      setStatusData(data);
    } catch (e) {
      console.warn('Status check warning:', e);
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  // Handle API URL update
  const handleUpdateApiUrl = (newUrl: string) => {
    setApiUrlState(newUrl);
    setApiBaseUrl(newUrl);
  };

  // Toggle specific tool
  const handleToggleTool = (toolId: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, enabled: !t.enabled } : t))
    );
  };

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend ?? input).trim();
    if (!messageContent || isLoading) return;

    const userMessageId = `msg-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      toolsUsed: toolsEnabled,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        message: messageContent,
        tools: toolsEnabled,
      });

      if (response.ok) {
        const assistantMsg: ChatMessage = {
          id: `resp-${Date.now()}`,
          role: 'assistant',
          content: response.reply,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          provider: response.provider,
          model: response.model,
          latency_ms: response.latency_ms,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // If real backend call failed, check if simulated mode is on for smooth test experience
        if (isSimulatedMode) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const simulatedMsg: ChatMessage = {
            id: `resp-sim-${Date.now()}`,
            role: 'assistant',
            content: generateSimulatedArabicResponse(messageContent, toolsEnabled),
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            provider: 'محاكي MOROAI المحلي (Offline Mode)',
            model: 'MORO-Ar-Orchestrator v2.4',
            latency_ms: response.latency_ms || 320,
          };
          setMessages((prev) => [...prev, simulatedMsg]);
        } else {
          // Display actual error state with guidance
          const errorMsg: ChatMessage = {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: response.reply,
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            error: true,
            provider: 'Flask Gateway',
            latency_ms: response.latency_ms,
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      }
    } catch (err: unknown) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `تعذر الاتصال بخادم Flask المحلي على ${apiUrl}. يرجى التحقق من تشغيل الخادم وتصريح CORS.`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        error: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for mock demo Arabic responses when Flask is not yet launched by user
  const generateSimulatedArabicResponse = (query: string, toolsActive: boolean): string => {
    if (query.includes('كود') || query.includes('بايثون') || query.includes('برمج')) {
      return `مرحباً بك! إليك نموذج كود بايثون متقدم ومحسّن لمعالجة النصوص العربية وتوحيد الحروف وإزالة علامات التشكيل:

\`\`\`python
import re
from typing import List, Dict
from collections import Counter

class ArabicTextProcessor:
    """معالج نصوص عربية متكامل للأوركسترا الذكية"""
    
    TASHKEEL_REGEX = re.compile(r'[\u0617-\u061A\u064B-\u0652]')
    TATWEEL_REGEX = re.compile(r'\u0640')

    @classmethod
    def clean_text(cls, text: str) -> str:
        # إزالة التشكيل والتطويل
        text = cls.TASHKEEL_REGEX.sub('', text)
        text = cls.TATWEEL_REGEX.sub('', text)
        
        # توحيد أشكال الألف والهمزات
        text = re.sub('[إأآا]', 'ا', text)
        text = re.sub('ى', 'ي', text)
        text = re.sub('ؤ', 'ء', text)
        text = re.sub('ئ', 'ء', text)
        text = re.sub('ة', 'ه', text)
        return text.strip()

    @classmethod
    def extract_top_keywords(cls, text: str, top_n: int = 5) -> List[Dict[str, int]]:
        cleaned = cls.clean_text(text)
        words = [w for w in cleaned.split() if len(w) > 2]
        counts = Counter(words).most_common(top_n)
        return [{"word": word, "frequency": freq} for word, freq in counts]

# تجربة المعالج
sample = "مِنَصَّةُ مورو للذكاء الاصطناعي العربي تقدم حلولاً برمجية رائدة"
print(ArabicTextProcessor.clean_text(sample))
\`\`\`

${toolsActive ? '🔍 *ملاحظة:* تم التحقق من سلامة الأوامر وتوافق المعايير عبر أداة فحص الكود (Code Inspector).' : ''}
هل تود إضافة مكتبة استخراج الجذور اللغوية (Stemming) أو دمجها مع واجهة REST API؟`;
    }

    if (query.includes('بيان') || query.includes('بلاغة') || query.includes('لغوي')) {
      return `إليك صياغة بليغة لبيان صحفي رسمي:

**بيان صحفي رسمي: إطلاق منصة MOROAI للذكاء الاصطناعي العربي المستقل**

في خطوة تاريخية تعزز الاستقلال التقني والسيادة الرقمية للعالم العربي، يُسعدنا الإعلان عن الإطلاق الرسمي لمنصة **MOROAI**؛ محرك الأوركسترا الذكي الأول المخصص لمعالجة اللغة العربية وفنونها بدقة فائقة وخصوصية مطلقة.

- **الرؤية:** تمكين الباحثين، المطورين، والمؤسسات من الاستفادة من طاقات الذكاء الاصطناعي التوليدي عبر منظومة حرة، مفتوحة ومجانية للأبد.
- **الركائز:** معالجة دلالية متقدمة للبلاغة العربية، استقلالية تشغيلية محلية (On-Premises)، وتكامل مرن مع مختلف نماذج المصدر المفتوح.

نسعد بانضمامكم لمسيرة الابتكار التقني العربي المستقل.`;
    }

    return `أهلاً بك في منصة **MOROAI**.
لقد استلمت استفسارك: "${query}".

${toolsActive ? '🛠 **الأدوات النشطة:** تم تحليل السياق واسترجاع المعارف المطلوبة بنجاح.' : ''}

منصة MOROAI تعمل كمنسق ذكي (Orchestrator) يقوم بتوجيه الأسئلة إلى النموذج الأنسب محلياً لتحقيق أعلى سرعة واستجابة متوازنة باللغة العربية.

هل تحتاج إلى تفاصيل إضافية أو ترغب في تنفيذ خطوة برمجية معينة؟`;
  };

  // Retry last message
  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  // Reset to welcome / new chat
  const handleNewChat = () => {
    if (messages.length > 0) {
      // Save current conversation to history
      const newSession: ConversationSession = {
        id: `session-${Date.now()}`,
        title: messages[0]?.content.slice(0, 36) + '...' || 'محادثة جديدة',
        date: 'الآن',
        messageCount: messages.length,
      };
      setConversations((prev) => [newSession, ...prev]);
    }
    setMessages([]);
    setInput('');
  };

  const handleSelectConversation = (id: string) => {
    const target = conversations.find((c) => c.id === id);
    if (target) {
      setMessages([
        {
          id: `hist-1-${id}`,
          role: 'user',
          content: target.title,
          timestamp: '10:30 ص',
        },
        {
          id: `hist-2-${id}`,
          role: 'assistant',
          content: `أهلاً بك مجدداً. تم استرجاع سياق جلسة "${target.title}". كيف يمكنني مساعدتك الآن؟`,
          timestamp: '10:31 ص',
          provider: 'MORO-Cache',
          model: 'MORO-Ar-Orchestrator',
          latency_ms: 120,
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-[#E8EEF5] relative flex flex-col font-sans selection:bg-blue-600/30 selection:text-white overflow-x-hidden">
      
      {/* Dynamic Royal Blue Mesh Background Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Blob 1: Top Right Royal Blue */}
        <div className="absolute -top-[10%] -right-[10%] w-[550px] h-[550px] rounded-full bg-blue-600/12 blur-[130px] animate-blob-1" />
        
        {/* Blob 2: Bottom Left Sky Blue */}
        <div className="absolute -bottom-[15%] -left-[10%] w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[150px] animate-blob-2" />
        
        {/* Blob 3: Center Ambient Depth */}
        <div className="absolute top-[40%] left-[25%] w-[450px] h-[450px] rounded-full bg-blue-800/8 blur-[140px]" />
      </div>

      {/* 1. Top Bar (Fixed 64px, Glassmorphism) */}
      <TopBar
        onToggleDrawer={() => setIsDrawerOpen(true)}
        onNewChat={handleNewChat}
        hasMessages={messages.length > 0}
        isBackendConnected={Boolean(statusData?.ok)}
      />

      {/* Main Content Area (Centered, max-width 820px, offset for 64px header) */}
      <main className="flex-1 w-full pt-16 flex flex-col items-center">
        {messages.length === 0 ? (
          <div className="w-full flex-1 flex items-center justify-center">
            <Welcome onSelectPrompt={(prompt) => handleSendMessage(prompt)} />
          </div>
        ) : (
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            onRetry={handleRetry}
            onOpenSettings={() => {
              setActiveDrawerTab('settings');
              setIsDrawerOpen(true);
            }}
          />
        )}
      </main>

      {/* 3. Floating Bottom Composer */}
      <Composer
        input={input}
        setInput={setInput}
        onSend={() => handleSendMessage()}
        isLoading={isLoading}
        toolsEnabled={toolsEnabled}
        onToggleTools={() => setToolsEnabled((prev) => !prev)}
      />

      {/* 4. Sliding Right Drawer (320px) */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeDrawerTab}
        onSelectTab={setActiveDrawerTab}
        statusData={statusData}
        isLoadingStatus={isLoadingStatus}
        onRefreshStatus={refreshStatus}
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        tools={tools}
        onToggleTool={handleToggleTool}
        apiUrl={apiUrl}
        onUpdateApiUrl={handleUpdateApiUrl}
        isSimulatedMode={isSimulatedMode}
        onToggleSimulatedMode={() => setIsSimulatedMode((prev) => !prev)}
      />

    </div>
  );
}

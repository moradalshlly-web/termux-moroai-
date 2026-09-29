/**
 * MOROAI Constants and Configuration
 */

import { DrawerNavigationItem, SuggestionCardItem, ToolOption } from './types';

export const APP_CONFIG = {
  name: 'MOROAI',
  tagline: 'ذكاء اصطناعي مستقل · عربي · مجاني',
  subtitle: 'محرك أوركسترا الذكاء الاصطناعي العربي المتطور — خصوصية كاملة، أداء فائق وتكامل محلي',
  disclaimer: 'MOROAI قد يخطئ — تحقق من المعلومات المهمة',
  defaultApiUrl: 'http://localhost:5000',
  defaultOwner: 'MOROAI Core Team',
  colors: {
    background: '#050810',
    primary: '#2563EB',
    secondary: '#60A5FA',
    text: '#E8EEF5',
    card: 'rgba(37, 99, 235, 0.06)',
    border: 'rgba(37, 99, 235, 0.18)',
    borderActive: 'rgba(96, 165, 250, 0.45)',
  },
};

export const DRAWER_NAV_ITEMS: DrawerNavigationItem[] = [
  {
    id: 'chat',
    label: 'المحادثة',
    icon: '💬',
    description: 'إدارة سجل المحادثات والبدء بجلسة حوارية جديدة',
  },
  {
    id: 'knowledge',
    label: 'المعرفة',
    icon: '🧠',
    description: 'قاعدة المعرفة والوثائق وسياق التخصيص',
  },
  {
    id: 'tools',
    label: 'الأدوات',
    icon: '🛠',
    description: 'أدوات التنفيذ، البحث والبرمجة الحسابية',
  },
  {
    id: 'status',
    label: 'الحالة',
    icon: '📊',
    description: 'حالة خادم Flask، مزودو النماذج وزمن الاستجابة',
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: '⚙️',
    description: 'تكوين نقطة النهاية، النماذج وتفضيلات النظام',
  },
];

export const SUGGESTION_CARDS: SuggestionCardItem[] = [
  {
    id: 'code-review',
    emoji: '⚡',
    title: 'تطوير وهندسة برمجية',
    description: 'اكتب كود بايثون لمعالجة البيانات النصية واستخراج المعالم الرئيسية',
    prompt: 'اكتب لي كود بايثون متقدم لمعالجة النصوص العربية، مع إزالة التشكيل وتوحيد الحروف واستخراج الكلمات المفتاحية الأكثر تكراراً.',
  },
  {
    id: 'arabic-linguistics',
    emoji: '📖',
    title: 'بلاغة وتحليل لغوي',
    description: 'صياغة نصوص أدبية متقنة مع تدقيق لغوي وبلاغي شامل',
    prompt: 'قم بصياغة بيان صحفي بليغ باللغة العربية الفصحى يعلن عن إطلاق منصة ذكاء اصطناعي عربية حرة ومستقلة، بأسلوب رسمي وراقٍ.',
  },
  {
    id: 'orchestration',
    emoji: '🧩',
    title: 'أوركسترا النماذج',
    description: 'كيف ينسق MOROAI بين نماذج اللغة المتعددة لتحقيق أفضل دقة؟',
    prompt: 'اشرح لي مبدأ أوركسترا النماذج (Model Orchestration) في الذكاء الاصطناعي وكيف يمكن دمج نماذج متخصصة لتقديم إجابة موحدة فائقة الدقة.',
  },
  {
    id: 'data-analysis',
    emoji: '📊',
    title: 'تحليل الأعمال والاستراتيجية',
    description: 'خطة استراتيجية لإطلاق تطبيق محلي يعتمد على الاستضافة الخاصة',
    prompt: 'ضع خطة عمل تفصيلية من 5 مراحل لنشر حلول الذكاء الاصطناعي محلياً داخل المؤسسات (On-Premises) مع ضمان حماية البيانات وأمن المعلومات.',
  },
];

export const DEFAULT_TOOLS: ToolOption[] = [
  {
    id: 'python_exec',
    name: 'مفسر بايثون (Python Sandbox)',
    description: 'تنفيذ العمليات الحسابية وتحليل البيانات المباشر عبر بيئة آمنة',
    enabled: true,
    category: 'computation',
  },
  {
    id: 'web_search',
    name: 'البحث المباشر في الويب',
    description: 'استرجاع أحدث الأخبار والبيانات الحية الموثقة عبر الإنترنت',
    enabled: true,
    category: 'retrieval',
  },
  {
    id: 'rag_docs',
    name: 'استرجاع الوثائق (RAG)',
    description: 'البحث الدلالي ضمن ملفات قاعدة المعرفة المحلية المرفوعة',
    enabled: true,
    category: 'knowledge',
  },
  {
    id: 'code_inspector',
    name: 'فاحص الكود والأمان',
    description: 'تدقيق الشفرات البرمجية والتحقق من سلامة الأوامر قبل التشغيل',
    enabled: false,
    category: 'security',
  },
];

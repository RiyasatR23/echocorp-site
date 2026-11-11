import {
  BellRing,
  Database,
  FileSpreadsheet,
  GitBranch,
  Globe,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type CapabilityCategory = 'Web' | 'AI' | 'Automation' | 'Data & Systems';

export interface Capability {
  id: string;
  category: CapabilityCategory;
  icon: LucideIcon;
  title: string;
  description: string;
  outcome: string;
  tools: string[];
}

export const CAPABILITY_FILTERS = ['All', 'Web', 'AI', 'Automation', 'Data & Systems'] as const;

export type CapabilityFilter = (typeof CAPABILITY_FILTERS)[number];

export const CAPABILITIES: Capability[] = [
  {
    id: 'websites',
    category: 'Web',
    icon: Globe,
    title: 'Fast, search-ready websites',
    description: 'Static-first sites built for speed and Google, with real HTML search engines can read.',
    outcome: 'Found on Google, loads in under 2 seconds',
    tools: ['Astro', 'React', 'Tailwind', 'SEO'],
  },
  {
    id: 'stores',
    category: 'Web',
    icon: ShoppingBag,
    title: 'E-commerce & online stores',
    description: 'Shopify and headless stores with product catalogues, quote requests and payments.',
    outcome: 'Sell and take enquiries 24/7',
    tools: ['Shopify', 'Storefront API', 'Paystack'],
  },
  {
    id: 'assistants',
    category: 'AI',
    icon: MessageCircle,
    title: 'Ask Echo AI assistants',
    description: 'Claude-powered chat assistants trained on your business that answer questions and capture leads.',
    outcome: 'Every visitor gets an instant answer',
    tools: ['Claude API', 'Guardrails', 'Lead capture'],
  },
  {
    id: 'ai-workflows',
    category: 'AI',
    icon: Sparkles,
    title: 'AI-powered workflows',
    description: 'Use AI to draft replies, summarise documents, classify enquiries and generate reports.',
    outcome: 'Hours of admin done in minutes',
    tools: ['Claude API', 'n8n', 'Python'],
  },
  {
    id: 'workflow-automation',
    category: 'Automation',
    icon: Workflow,
    title: 'Workflow automation',
    description: 'Connect your tools so forms, emails, calendars and spreadsheets update themselves.',
    outcome: 'No more copy-paste between apps',
    tools: ['n8n', 'Google Apps Script', 'Zapier-style flows'],
  },
  {
    id: 'reminders',
    category: 'Automation',
    icon: BellRing,
    title: 'Reminders & notifications',
    description: 'Automatic WhatsApp, SMS and email reminders for bookings, sessions and payments.',
    outcome: 'Fewer no-shows, faster payments',
    tools: ['Twilio', 'WhatsApp', 'Resend'],
  },
  {
    id: 'excel-reporting',
    category: 'Automation',
    icon: FileSpreadsheet,
    title: 'Excel & reporting automation',
    description: 'VBA macros and automated reports that turn hours of manual work into one click.',
    outcome: '3-hour reports in one click',
    tools: ['Excel', 'VBA', 'Pivot Tables'],
  },
  {
    id: 'databases',
    category: 'Data & Systems',
    icon: Database,
    title: 'Databases & dashboards',
    description: 'Secure databases, client portals and live dashboards so you can see your business at a glance.',
    outcome: 'One source of truth',
    tools: ['Supabase', 'PostgreSQL', 'Row-Level Security'],
  },
  {
    id: 'pipelines',
    category: 'Data & Systems',
    icon: GitBranch,
    title: 'Business systems & pipelines',
    description: 'Lead-to-cash pipelines, scheduling apps and booking systems designed by an industrial engineer.',
    outcome: 'Every job tracked from enquiry to payment',
    tools: ['Process mapping', 'Supabase', 'APIs'],
  },
];

export const TECH_STACK = [
  'Astro',
  'React',
  'Tailwind',
  'Supabase',
  'PostgreSQL',
  'Shopify',
  'Claude API',
  'n8n',
  'Google Apps Script',
  'Python',
  'Twilio',
  'WhatsApp',
  'Resend',
  'Paystack',
  'Excel VBA',
  'GitHub',
];

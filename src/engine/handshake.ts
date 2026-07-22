/**
 * Handshake AI integration — monitors and interacts with the Handshake AI portal.
 * Currently uses simulated data. When real integration is ready, this will
 * scrape/API-call joinhandshake.com/ai.
 */

import type { HandshakeTask, TaskCategory } from "../types";

// ── Categories with display metadata ──

export const TASK_CATEGORIES: { value: TaskCategory; label: string; icon: string }[] = [
  { value: "ai_training", label: "AI Training", icon: "🧠" },
  { value: "data_annotation", label: "Data Annotation", icon: "📝" },
  { value: "evaluation", label: "Evaluation", icon: "📊" },
  { value: "feedback", label: "Feedback", icon: "💬" },
  { value: "content_review", label: "Content Review", icon: "🔍" },
  { value: "reasoning", label: "Reasoning", icon: "🤔" },
  { value: "coding", label: "Coding", icon: "💻" },
  { value: "writing", label: "Writing", icon: "✍️" },
];

export function categoryLabel(cat: TaskCategory): string {
  return TASK_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
}

export function categoryIcon(cat: TaskCategory): string {
  return TASK_CATEGORIES.find((c) => c.value === cat)?.icon ?? "📋";
}

// ── Simulated task templates ──

const TASK_TEMPLATES: Omit<HandshakeTask, "id" | "url">[] = [
  {
    title: "Train AI Model on Code Reasoning",
    category: "reasoning",
    description: "Review and evaluate AI-generated code reasoning for correctness and clarity.",
    payRate: "$30/hr",
    estimatedHours: 5,
    requirements: ["Strong logical reasoning", "Basic programming knowledge"],
    status: "available",
    postedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    skills: ["logic", "programming", "analysis"],
  },
  {
    title: "Data Annotation — Technical Documents",
    category: "data_annotation",
    description: "Label and categorize technical documents for AI training datasets.",
    payRate: "$25/hr",
    estimatedHours: 10,
    requirements: ["Attention to detail", "Technical reading comprehension"],
    status: "available",
    postedDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
    skills: ["annotation", "reading", "categorization"],
  },
  {
    title: "AI Response Quality Evaluation",
    category: "evaluation",
    description: "Rate AI model responses for helpfulness, accuracy, and safety across multiple domains.",
    payRate: "$28/hr",
    estimatedHours: 8,
    requirements: ["Critical thinking", "Strong writing skills"],
    status: "available",
    postedDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
    skills: ["evaluation", "writing", "critical-thinking"],
  },
  {
    title: "Creative Writing Feedback",
    category: "feedback",
    description: "Provide detailed feedback on AI-generated creative writing pieces — stories, poems, scripts.",
    payRate: "$22/hr",
    estimatedHours: 6,
    requirements: ["Creative writing background", "Constructive criticism skills"],
    status: "available",
    postedDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    skills: ["writing", "creativity", "feedback"],
  },
  {
    title: "Math Reasoning Validation",
    category: "reasoning",
    description: "Verify step-by-step math reasoning from AI models. Algebra through calculus.",
    payRate: "$35/hr",
    estimatedHours: 4,
    requirements: ["College-level math", "Step-by-step verification"],
    status: "available",
    postedDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    skills: ["math", "logic", "verification"],
    },
  {
    title: "Code Review & Refactoring Tasks",
    category: "coding",
    description: "Review AI-generated code for bugs, security issues, and best practices. Suggest improvements.",
    payRate: "$40/hr",
    estimatedHours: 3,
    requirements: ["Professional coding experience", "Code review experience"],
    status: "available",
    postedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    skills: ["programming", "code-review", "security"],
  },
  {
    title: "Content Moderation — Edge Cases",
    category: "content_review",
    description: "Review and classify edge-case content for AI safety training.",
    payRate: "$25/hr",
    estimatedHours: 7,
    requirements: ["Judgment and reasoning", "Understanding of content policies"],
    status: "available",
    postedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    skills: ["judgment", "policy", "analysis"],
  },
  {
    title: "Instruction Tuning — Conversational AI",
    category: "ai_training",
    description: "Write high-quality instruction-response pairs for fine-tuning conversational AI models.",
    payRate: "$30/hr",
    estimatedHours: 12,
    requirements: ["Excellent writing", "Conversational design"],
    status: "available",
    postedDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    deadline: new Date(Date.now() + 86400000 * 21).toISOString(),
    skills: ["writing", "conversation-design", "creativity"],
  },
];

const USED_INDICES = new Set<number>();

/**
 * Fetch available tasks from Handshake AI.
 * Currently returns simulated data. Replace with real scraping/API when available.
 */
export async function fetchAvailableTasks(): Promise<HandshakeTask[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1500));

  const count = Math.min(3, TASK_TEMPLATES.length - USED_INDICES.size);

  // Pick random unused tasks
  const available: number[] = [];
  const pool = TASK_TEMPLATES.map((_, i) => i).filter((i) => !USED_INDICES.has(i));
  while (available.length < count && pool.length > 0) {
    const idx = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
    available.push(idx);
    USED_INDICES.add(idx);
  }

  // Reset if all used
  if (available.length === 0) {
    USED_INDICES.clear();
    return fetchAvailableTasks();
  }

  return available.map((i) => ({
    ...TASK_TEMPLATES[i],
    id: `hns-${Date.now()}-${i}`,
    url: `https://joinhandshake.com/ai/tasks/${i}`,
  }));
}

/**
 * Apply for a task on Handshake AI.
 */
export async function applyForTask(_taskId: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 2000 + Math.random() * 3000));
  // Simulate success (90% chance)
  return Math.random() > 0.1;
}

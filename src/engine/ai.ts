/**
 * AI Integration — abstract interface for any AI provider.
 * Currently uses Web Fetch to call the configured API.
 */

import type { AIProviderConfig } from "../types";

export interface AICompletion {
  content: string;
  model: string;
  usage?: { prompt: number; completion: number };
}

/**
 * Send a prompt to the configured AI provider and get a completion.
 */
export async function aiComplete(
  config: AIProviderConfig,
  system: string,
  user: string
): Promise<AICompletion> {
  const { provider, apiKey, model, baseUrl, maxTokens, temperature } = config;

  if (!apiKey) {
    throw new Error("AI API key not configured. Go to Settings to set it up.");
  }

  let endpoint: string;
  let body: Record<string, unknown>;

  switch (provider) {
    case "openai":
      endpoint = `${baseUrl}/chat/completions`;
      body = {
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: maxTokens,
        temperature,
      };
      break;

    case "anthropic":
      endpoint = `${baseUrl}/v1/messages`;
      body = {
        model,
        system,
        messages: [{ role: "user", content: user }],
        max_tokens: maxTokens,
        temperature,
      };
      break;

    case "deepseek":
      endpoint = `${baseUrl}/chat/completions`;
      body = {
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: maxTokens,
        temperature,
      };
      break;

    case "custom":
      endpoint = `${baseUrl}/chat/completions`;
      body = {
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: maxTokens,
        temperature,
      };
      break;

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (provider === "anthropic") {
    headers["x-api-key"] = apiKey;
    headers["anthropic-version"] = "2023-06-01";
  } else {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "unknown error");
    throw new Error(`AI API error (${response.status}): ${text.slice(0, 200)}`);
  }

  const data = await response.json();

  // Parse response based on provider format
  if (provider === "anthropic") {
    const content = data.content?.[0]?.text || "";
    return {
      content,
      model: data.model || model,
      usage: data.usage,
    };
  }

  // OpenAI-compatible (openai, deepseek, custom)
  return {
    content: data.choices?.[0]?.message?.content || "",
    model: data.model || model,
    usage: data.usage,
  };
}

/**
 * Generate a decision on whether to apply for a Handshake task.
 */
export async function decideOnTask(
  config: AIProviderConfig,
  taskTitle: string,
  taskDescription: string,
  payRate: string,
  preferredCategories: string[]
): Promise<{ shouldApply: boolean; reason: string; score: number }> {
  const system = `You are a career advisor helping decide which Handshake AI tasks to take.
Rate tasks on a 1-100 scale based on:
- Relevance to preferred categories: ${preferredCategories.join(", ")}
- Pay rate value
- Skill match

Respond ONLY with valid JSON: {"shouldApply": bool, "reason": string, "score": number}`;

  const user = `Task: ${taskTitle}
Description: ${taskDescription}
Pay: ${payRate}`;

  const result = await aiComplete(config, system, user);
  try {
    return JSON.parse(result.content);
  } catch {
    return { shouldApply: true, reason: "Auto-approved (AI parse fallback)", score: 50 };
  }
}

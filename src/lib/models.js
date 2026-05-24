export const AVAILABLE_MODELS = [
  {
    id: "meta/llama-3.1-70b-instruct",
    name: "Llama 3.1 70B Instruct",
    provider: "Meta",
    badge: "Recommended",
    badgeColor: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
    description: "Standard model for balanced, thorough legal auditing and clause risk detection.",
    latency: "Fast (~1.8s)",
    accuracy: "94%",
    type: "Text Analysis",
    capabilities: ["Full Audits", "Clause Decoding", "Standard Rewriting"]
  },
  {
    id: "meta/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B Instruct",
    provider: "Meta",
    badge: "Deep Reasoning",
    badgeColor: "bg-violet-500/10 border-violet-500/30 text-violet-400",
    description: "Deep reasoning model suited for highly complex agreements, non-competes, and liability capping.",
    latency: "Moderate (~2.9s)",
    accuracy: "98%",
    type: "Advanced Legal Logic",
    capabilities: ["Liability Analysis", "Complex Covenants", "Counter-Proposals"]
  },
  {
    id: "mistralai/mixtral-8x7b-instruct-v0.1",
    name: "Mixtral 8x7B Instruct",
    provider: "Mistral AI",
    badge: "High Speed",
    badgeColor: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    description: "High speed Mixture-of-Experts architecture optimized for fast summaries and explanations.",
    latency: "Ultra-Fast (~0.9s)",
    accuracy: "89%",
    type: "Rapid Summarization",
    capabilities: ["Quick Summary", "Plain-English Decoding", "Relational Tone"]
  }
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0].id;

export function getModelById(id) {
  return AVAILABLE_MODELS.find(m => m.id === id) || AVAILABLE_MODELS[0];
}

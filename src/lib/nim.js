import OpenAI from "openai";

const nim = new OpenAI({
  apiKey: process.env.NIM_API_KEY || "dummy",
  baseURL: process.env.NIM_BASE_URL || "https://integrate.api.nvidia.com/v1",
});

export async function callNIM(systemPrompt, userPrompt, options = {}) {
  // Graceful fallback trigger if API key is not configured or is the default dummy key
  if (!process.env.NIM_API_KEY || process.env.NIM_API_KEY === "dummy_for_demo" || process.env.NIM_API_KEY === "your_nvidia_nim_api_key_here") {
    throw new Error("MOCK_FALLBACK_REQUIRED");
  }

  const completion = await nim.chat.completions.create({
    model: options.model || process.env.NIM_MODEL || "meta/llama-3.1-70b-instruct",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: options.temperature ?? 0.1,
    max_tokens: options.max_tokens ?? 4096,
  });

  return completion.choices[0].message.content;
}

export default nim;

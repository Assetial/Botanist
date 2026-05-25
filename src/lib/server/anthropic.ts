import "server-only";

export function hasAnthropicApiKeyConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

export function getAnthropicApiKey(): string {
  const value = process.env.ANTHROPIC_API_KEY?.trim();

  if (!value) {
    // Keep errors generic so secrets are never revealed in logs or responses.
    throw new Error("Missing required AI provider configuration.");
  }

  return value;
}

import type { VisionProvider } from './vision-provider';

// ─── Vision Provider Factory ────────────────────────────────────────────────
// Reads VISION_PROVIDER env var: "claude" (default) | "openai"
// Lazy-initialised singleton — created once per cold start.

let _cached: VisionProvider | null = null;

export function getVisionProvider(): VisionProvider {
  if (_cached) return _cached;

  const provider = (process.env.VISION_PROVIDER || 'claude').toLowerCase().trim();

  switch (provider) {
    case 'openai':
    case 'gpt4o':
    case 'gpt-4o': {
      // Dynamic import to avoid loading both SDKs
      const { OpenAIVisionProvider } = require('./adapters/openai-vision');
      _cached = new OpenAIVisionProvider();
      console.log('[vision] Provider initialised: openai (GPT-4o)');
      break;
    }
    case 'claude':
    case 'anthropic':
    default: {
      const { ClaudeVisionProvider } = require('./adapters/claude-vision');
      _cached = new ClaudeVisionProvider();
      console.log('[vision] Provider initialised: claude (Sonnet)');
      break;
    }
  }

  return _cached!;
}

/** Reset cached provider — useful for testing */
export function resetVisionProvider(): void {
  _cached = null;
}

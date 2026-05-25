# TODO (Post-v1)

## Enable Real Botanist AI Reviews

- Add real OpenAI photo analysis flow using `OPENAI_API_KEY`.
- Add real Anthropic Claude photo analysis flow using `ANTHROPIC_API_KEY`.
- Add provider adapters so `/api/reviews/refresh` can switch between mock and live modes.
- Store provider request/response metadata for debugging and cost tracking.
- Add a per-plant toggle for mock-only vs live AI analysis.

## Privacy & Sharing Evolution

- Social plant profiles (optional, not default).
- Friend/family accounts.
- Comments and reactions.
- Public plant pages with explicit publish controls.
- More advanced family invite/share permissions.

## Integrations

- MCP connector for ChatGPT workflows.
- Google Drive photo backup.
- Google Calendar care reminders.
- AI photo analysis endpoint hardening (rate limits, queueing, retry behavior).

## Product Improvements

- Better photo upload metadata extraction from EXIF.
- Task completion UX and recurring task auto-generation.
- Progressive web app support for homescreen install and offline view.
- Cost dashboard for storage, bandwidth, and future AI usage.
#!/usr/bin/env bash
set -euo pipefail

status="approved"
reasons=()

if [[ "${GITHUB_EVENT_NAME:-}" == "pull_request" ]]; then
  base_sha="${GITHUB_BASE_REF:+origin/${GITHUB_BASE_REF}}"
  if [[ -n "$base_sha" ]]; then
    git fetch origin "${GITHUB_BASE_REF}" --depth=1 >/dev/null 2>&1 || true
    range="${base_sha}...HEAD"
  else
    range="HEAD~1...HEAD"
  fi
else
  if git rev-parse --verify HEAD~1 >/dev/null 2>&1; then
    range="HEAD~1...HEAD"
  else
    range="HEAD"
  fi
fi

mapfile -t changed_files < <(git diff --name-only "$range" | sed '/^$/d')

if [[ ${#changed_files[@]} -eq 0 ]]; then
  echo "status=approved" >> "$GITHUB_OUTPUT"
  echo "reasons=" >> "$GITHUB_OUTPUT"
  exit 0
fi

secret_pattern='OPENAI_API_KEY=|ANTHROPIC_API_KEY=|CLAUDE_API_KEY=|sk-|-----BEGIN PRIVATE KEY-----|password=|secret=|token='
human_needed_pattern='(^|/)(database/schema\.sql|database/seed\.sql)$|^src/app/api/|^src/lib/server/|supabase|auth|security|privacy|migration|BOTANIST_ENABLE_REAL_AI'

for file in "${changed_files[@]}"; do
  [[ -f "$file" ]] || continue

  if grep -q 'BOTANIST_ENABLE_REAL_AI=true' "$file"; then
    status="rejected"
    reasons+=("real-ai-flag:${file}")
  fi

  if grep -Eiq "$secret_pattern" "$file"; then
    status="rejected"
    reasons+=("secret-pattern:${file}")
  fi

  if [[ "$status" != "rejected" ]] && [[ "$file" =~ $human_needed_pattern ]]; then
    status="human_needed"
    reasons+=("sensitive-area:${file}")
  fi
done

echo "status=$status" >> "$GITHUB_OUTPUT"
if [[ ${#reasons[@]} -gt 0 ]]; then
  joined=$(IFS='; '; echo "${reasons[*]}")
  echo "reasons=$joined" >> "$GITHUB_OUTPUT"
else
  echo "reasons=" >> "$GITHUB_OUTPUT"
fi

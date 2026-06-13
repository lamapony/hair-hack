#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="$ROOT/.vendor/agent-skills"
SKILLS_DIR="$ROOT/.cursor/skills"

SKILLS=(
  using-agent-skills
  spec-driven-development
  planning-and-task-breakdown
  incremental-implementation
  test-driven-development
  frontend-ui-engineering
  api-and-interface-design
  code-review-and-quality
  security-and-hardening
  browser-testing-with-devtools
  debugging-and-error-recovery
  shipping-and-launch
)

if [[ -d "$VENDOR/.git" ]]; then
  echo "Updating agent-skills in $VENDOR"
  git -C "$VENDOR" pull --ff-only
else
  echo "Cloning agent-skills into $VENDOR"
  mkdir -p "$(dirname "$VENDOR")"
  git clone --depth 1 https://github.com/addyosmani/agent-skills.git "$VENDOR"
fi

mkdir -p "$SKILLS_DIR"
for skill in "${SKILLS[@]}"; do
  ln -sf "../../.vendor/agent-skills/skills/$skill" "$SKILLS_DIR/$skill"
done

echo "Installed ${#SKILLS[@]} skills into .cursor/skills/"
echo "Version: $(git -C "$VENDOR" describe --tags --always 2>/dev/null || echo unknown)"

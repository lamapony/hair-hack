#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://hair-hack.vercel.app}"
RUN_GENERATE=false

for arg in "$@"; do
  case "$arg" in
    --generate) RUN_GENERATE=true ;;
    -h|--help)
      echo "Usage: $0 [--generate]"
      echo "  BASE_URL=https://hair-hack.vercel.app $0"
      exit 0
      ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

echo "Checking $BASE_URL/api/health ..."
health="$(curl -sfS "$BASE_URL/api/health")"
echo "$health" | grep -q '"ok":true'
echo "$health" | grep -q '"productionReady":true'
echo "health ok"

for path in /privacy /terms; do
  code="$(curl -sS -o /dev/null -w '%{http_code}' "$BASE_URL$path")"
  if [ "$code" != "200" ]; then
    echo "FAIL $path HTTP $code" >&2
    exit 1
  fi
  echo "$path ok"
done

if [ "$RUN_GENERATE" = true ]; then
  echo "POST /api/generate (OpenAI — may take ~60s) ..."
  body='{"image":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==","goal":"density","consent":{"explainedAiOnly":true,"clientConsent":true,"noServerRetention":true,"clientIsAdult":true}}'
  res="$(curl -sfS -X POST "$BASE_URL/api/generate" -H "Content-Type: application/json" -d "$body")"
  echo "$res" | grep -q '"image":"data:image'
  echo "generate ok"
fi

echo "smoke pass"

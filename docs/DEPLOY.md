# Deploy — Vercel

**Live demo:** [https://hair-hack.vercel.app](https://hair-hack.vercel.app)

GitHub repo `lamapony/hair-hack` is connected to Vercel project `hair-hack` (`lamaponys-projects`).

## Required environment variables

Set in [Vercel project settings](https://vercel.com/lamaponys-projects/hair-hack/settings/environment-variables):

| Variable | Environments | Notes |
|----------|--------------|-------|
| `OPENAI_API_KEY` | Production, Preview, Development | Required for `/api/generate` |
| `OPENAI_IMAGE_MODEL` | Production (optional) | Default `gpt-image-2` in code |
| `OPENAI_IMAGE_QUALITY` | Optional | Default `medium` |

Optional (see `.env.example`): rate limits, `LEGAL_PAGES_REQUIRED`, `COUNSEL_LEGAL_APPROVED`.

## Health check

```bash
curl -sS https://hair-hack.vercel.app/api/health
```

Expect `productionReady: true` while the legal gate is off. When `LEGAL_PAGES_REQUIRED=true` on **production** without counsel sign-off, `/api/generate` returns 503.

## CLI (team)

```bash
npx vercel link          # once per clone
npx vercel env pull      # optional: sync env to .env.local
npx vercel deploy        # preview deployment
npx vercel deploy --prod # production (requires approval in team workflow)
```

After changing env vars on Vercel, redeploy:

```bash
npx vercel redeploy hair-hack.vercel.app --non-interactive
```

## Before paid clinic pilot

1. Complete [legal/OPENAI-ENGINEERING-CHECKLIST.md](./legal/OPENAI-ENGINEERING-CHECKLIST.md)
2. Counsel sign-off → [legal/COMPLIANCE.md](./legal/COMPLIANCE.md)
3. Set `LEGAL_PAGES_REQUIRED=true` only when ready; set `COUNSEL_LEGAL_APPROVED=true` after counsel approval

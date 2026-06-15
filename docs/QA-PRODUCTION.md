# Production QA — Hair Hack

**Date:** 2026-06-15  
**URL:** https://hair-hack.vercel.app  
**Tester:** Agent (browser snapshot + API curl)

---

## Summary

| Area | Result | Notes |
|------|--------|-------|
| `/api/health` | ✅ Pass | `productionReady: true`; legal gate off |
| Home / clinic UI | ✅ Pass | Goals, upload hint, 4 consent boxes, disabled generate |
| Legal pages | ✅ Pass | `/privacy`, `/terms` → 200, DRAFT banner |
| API consent | ✅ Pass | `POST /api/generate` `{}` → validation error (not 503) |
| Generate (API) | ✅ Pass | Tiny PNG + full consent → `data:image/...` in ~65s |
| Legal gate | ✅ Pass | Not blocking (`LEGAL_PAGES_REQUIRED` unset) |

**Verdict:** Production demo is ready to share with counsel/clinic for walkthrough. **Not** cleared for paid pilot until [COMPLIANCE.md](./legal/COMPLIANCE.md) sign-off.

---

## Checks

### Health

```bash
curl -sS https://hair-hack.vercel.app/api/health
# {"ok":true,"legal":{"pagesRequired":false,"counselApproved":false,"productionReady":true}}
```

### Browser (home)

- [x] Title: "Hair Hack — Clinic consultation demo"
- [x] Three treatment goals visible
- [x] Upload area: "up to 25 MB (auto-resized)"
- [x] Consent checkboxes disabled until photo
- [x] Generate disabled until photo + consent
- [x] Footer links to Privacy / Terms (draft)

### API smoke (optional — uses OpenAI credits)

```bash
./scripts/smoke-production.sh --generate
```

---

## Repeat

```bash
./scripts/smoke-production.sh
```

See [DEPLOY.md](./DEPLOY.md) for env and redeploy notes.

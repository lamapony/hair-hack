# Fixture photos for QA

**Purpose:** Repeatable manual QA for AI hair previews ([QA-RUBRIC.md](../../docs/QA-RUBRIC.md)).

## Rules

- **Do not commit** real prospect or patient photos (PII / HIPAA / GDPR).
- Store clinic samples **locally only** or in a private team vault.
- Synthetic or stock faces are OK in git only if license allows redistribution.

## Suggested local setup

```text
public/fixtures/local/     # gitignored — your clinic copies here
public/fixtures/samples/   # optional — redistributable stock (if added later)
```

Add to `.gitignore`:

```gitignore
public/fixtures/local/
```

## Minimum set

See [QA-RUBRIC.md](../../docs/QA-RUBRIC.md) — three photos: recession/crown, hairline, varied lighting.

## Agent / dev testing

Use a small synthetic PNG for smoke tests only (API path). For **quality** rubric, use real-ish clinic lighting and visible scalp/hairline.

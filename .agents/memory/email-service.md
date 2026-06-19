---
name: Email service setup
description: nodemailer welcome email — env vars required, graceful fallback when absent
---

## Rule
`server/services/emailService.ts` uses nodemailer. It logs a warning and resolves immediately when `SMTP_HOST`, `SMTP_USER`, or `SMTP_PASS` are not set — registration always succeeds regardless.

## Why
Registration must not fail if email is misconfigured. The non-blocking `.catch()` pattern in routes.ts ensures this.

## How to apply
- Env vars needed for real email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- None are currently configured in Replit secrets — email is silently skipped in development
- Call `sendWelcomeEmail()` with `.catch()` after user creation, never with `await` in the main response path

# Mailbox Plus Website - Operational Rules

## Credential Storage

- Always persist tokens/keys to profile .env immediately (~/.hermes/profiles/mailboxplus-website/.env)
- Verify with a live API call before confirming to user
- Never re-ask user for credentials that are already stored

## Git Workflow (PR-Based)

- ALWAYS use PR workflow for main branch
- Create feature branches from clean main: git checkout -b feat/<description> main
- Push feature branch to GitHub
- Review Netlify deploy preview at the unique preview URL
- Open PR from feature branch to main
- Let CI pass (build, lint, test)
- Review changes, then squash and merge
- NEVER push directly to main

## Subagent-Driven Development (Phase 5+)

- For multi-step implementation work, use the subagent-driven-development skill
- Write a plan first (writing-plans skill), then dispatch subagents per task
- Each task = 2-5 minutes of focused work
- Two-stage review: spec compliance THEN code quality
- Fresh subagent per task (no context pollution)
- Never skip reviews

## Kanban Board

- Board slug: mailboxplus-website
- Always create tasks with --workspace dir:/home/blackghost/mailbox-plus-website
- Human tasks: prefix with "Frank: " and add REVIEW REQUIRED comment
- Link tasks to parent phases using kanban_link
- Complete tasks with --summary and --metadata for traceability

## Netlify

- Production branch: main (never deploy from feature branches to production)
- Deploy previews: automatic on branch push
- PAT stored in .env as NETLIFY_AUTH_TOKEN
- Site ID: 7a885e38-5ed0-4988-bc5c-a6007fce97a4

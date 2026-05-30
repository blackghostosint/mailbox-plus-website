# Mailbox Plus Website (V2)

This is the codebase for the Mailbox Plus V2 website, built with React, TypeScript, and Vite.

## 🚨 Micro-Problem Governance

This project enforces strict **Quarterly Governance** for all micro-problem pages to prevent SEO bloat and ensure content quality.

- **[GOVERNANCE_QUICK_REFERENCE.md](./GOVERNANCE_QUICK_REFERENCE.md)** (Start Here)
- **[MICRO_PROBLEM_GOVERNANCE.md](./MICRO_PROBLEM_GOVERNANCE.md)** (Authoritative Policy)
- **[.agent/workflows/micro-problem-quarterly-audit.md](.agent/workflows/micro-problem-quarterly-audit.md)** (Audit Workflow)

**Key Rule**:

> A micro-problem page must reduce real-world friction. If it doesn't, it doesn't deserve to exist.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run micro-problem audit
npm run audit:micro-problems -- --search-console=scripts/audits/search-console-data/latest.csv
```

## Documentation

- **Config Architecture**: `src/config/micro-problems/README.md`
- **Design System**: `V2 Design System & Aesthetic Specification.md`
- **Internal Linking**: `INTERNAL_LINKING_GUIDE.md`

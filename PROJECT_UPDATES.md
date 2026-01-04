## 2026-01-04 — Implement Build-Time Embeddings for Chatbot Retrieval

**Summary**
Migrated chatbot retrieval from runtime embedding generation to build-time precomputed embeddings to eliminate Netlify serverless timeout issues and improve performance. The system now generates all embeddings at build time as a static artifact, dramatically reducing retrieval latency and improving production reliability.

**Scope**
- `scripts/build-embeddings.ts` - New build script to generate embeddings for all KB entries using Gemini API
- `knowledge/embeddings.json` - 5.2MB static artifact containing 2,500+ precomputed embeddings
- `netlify/functions/chat-retrieve.ts` - Updated to load precomputed embeddings instead of generating at runtime
- `package.json` - Added `build:embeddings` npm script for developer workflow

**Notes**
- Resolved Netlify serverless persistence issue: embeddings are now committed as static files, not cached at runtime
- Cache key format changed from `${entryId}::${text}` to `${taskType}::${text}` (RETRIEVAL_QUERY/RETRIEVAL_DOCUMENT)
- Build script extracts and deduplicates all `title`, `searchText`, and `questionVariants` from kb.entries.json
- Runtime embedding generation now only used for incoming user queries, not KB entries
- Developer workflow: run `npm run build:embeddings` after updating kb.entries.json, commit embeddings.json to git
- Performance improvement: retrieval function no longer makes thousands of Gemini API calls per request
- Production-safe: serverless functions now operate in read-only mode for KB embeddings

${readFileSync('d:\\mailbox-plus-website\\mailbox-plus-website\\PROJECT_UPDATES.md', 'utf-8')}

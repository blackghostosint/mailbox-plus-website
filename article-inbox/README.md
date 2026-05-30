# Article Inbox

## Purpose

Drop new articles from your content pipeline into this folder for processing.

## Workflow

### 1. Drop Articles

Place finished `.md` files from your pipeline here:

```
/article-inbox/
  ├── pack-ship-painesville-city.md
  ├── pack-ship-mentor-ohio.md
  └── mailbox-rentals-business-address.md
```

### 2. Processing

When ready to integrate articles:

- Review frontmatter for completeness
- Validate image paths (articles/{category}/{slug}-featured.webp)
- Check for duplicate `intentKey` values
- Move to `/content/articles/{category}/` based on frontmatter category

### 3. Internal Link Conventions

- All internal paths must start with `/`
- Use actual route paths (e.g., `/pack-ship/fedex-shipping`), **NOT** `/services/` prefixed paths
- `relatedServices` should contain 2-4 valid route paths relevant to the article
- Run `npm run audit:articles` to validate all links against the sitemap
- Common service path prefixes:
  - `/pack-ship/` — packing & shipping services
  - `/copy-print/` — copy & print services
  - `/home-business/` — home & business services
  - `/specialty/` — specialty services
  - `/service-area/` — service area pages

#### Internal Linking Best Practices

- **Target**: 5-10 contextual internal links per article
- **Anchor text**: Use descriptive, exact-match phrases naturally (avoid generic "click here")
- **Link to**: Service pages, related articles, micro-problems, service areas, contact page
- **Avoid**: Forced or unnatural placement, keyword stuffing
- **External links**: 1-3 authoritative sources when citing data/research only
- **Note**: More links can be added later during quarterly audits

### 4. Post-Processing

After moving to `/content/articles/`:

- Add strategic internal links
- Update sitemap configuration
- Run validation scripts
- Build and deploy
- **Provide the finalized URL** (format: `https://mailboxplusohio.com/articles/{slug}`)

## Processing Status

Articles in this folder are **UNPROCESSED**.
Once moved to `/content/articles/{category}/`, they are **PROCESSED**.

## Notes

- You can drop 1 or 100 articles at a time
- Files stay here until manually processed
- This folder is gitignored (won't be committed)

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

### 3. Post-Processing
After moving to `/content/articles/`:
- Add strategic internal links
- Update sitemap configuration
- Run validation scripts
- Build and deploy

## Processing Status
Articles in this folder are **UNPROCESSED**.
Once moved to `/content/articles/{category}/`, they are **PROCESSED**.

## Notes
- You can drop 1 or 100 articles at a time
- Files stay here until manually processed
- This folder is gitignored (won't be committed)

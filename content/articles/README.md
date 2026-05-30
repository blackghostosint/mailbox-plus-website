# Published Articles

## Structure

Articles are organized by category:

```
/content/articles/
  ├── pack-ship/
  │   ├── painesville-city.md
  │   ├── mentor-ohio.md
  │   └── concord-township.md
  ├── mailbox-rentals/
  │   ├── business-address-lake-county.md
  │   └── virtual-mailbox-ohio.md
  ├── notary/
  ├── international-shipping/
  └── printing/
```

## Article Status

Articles in this directory are **PROCESSED AND PUBLISHED**.

## Categories

- `pack-ship/` - Packing and shipping services
- `mailbox-rentals/` - Mailbox and virtual address services
- `notary/` - Notary and legal services
- `international-shipping/` - International shipping services
- `printing/` - Printing and document services

## Frontmatter Requirements

Every article must have:

- `title`, `description`, `slug`, `category`, `intentKey`, `pubDate`
- `image` (R2 path: articles/{category}/{slug}-featured.webp)
- `imageAlt`

## Governance

- Each `intentKey` must be unique across all articles
- Quarterly audits follow the same process as micro-problems
- Changes logged in `PROJECT_UPDATES.md`

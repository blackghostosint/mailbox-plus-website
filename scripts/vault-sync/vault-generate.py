#!/usr/bin/env python3
"""vault-sync generator: turn /tmp/vault-data.json + article frontmatter into
rich Obsidian notes for the Mailbox Plus vault.

Usage:
  1. (in repo/astro) npx vitest run src/scripts/vault-extract.test.ts  # writes /tmp/vault-data.json
  2. python3 vault-generate.py /tmp/vault-data.json /tmp/vault-stage/Knowledge/
"""
import json
import os
import re
import sys
from datetime import date
from pathlib import Path

DATA = Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp/vault-data.json')
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else '/tmp/vault-stage/Knowledge')
REPO = Path('/home/blackghost/Projects/mailbox-plus-website')
TODAY = date.today().isoformat()

d = json.load(open(DATA))
sc = d['siteConfig']
services = d['services']
areas = d['serviceAreas']
locations = d['locations']
faqs = d['faqs']

# ---------- helpers ----------
def fm(title, tags, source, extra=None):
    lines = [
        '---',
        f'title: {title}',
        'type: knowledge',
        'business: Mailbox Plus',
        f'source: {source}',
        f'updated: {TODAY}',
        f'tags: [{tags}]',
    ]
    if extra:
        lines.append(extra)
    lines.append('---')
    return '\n'.join(lines) + '\n'

def strip_html(s):
    return re.sub(r'<[^>]+>', '', s or '').replace('\\u2014', '—').replace('\\u2019', '’').replace('\\u201c', '"').replace('\\u201d', '"').strip()

def clean_text(s):
    return re.sub(r'\s+', ' ', strip_html(s)).strip()

def find_service(service_list, svc_id):
    for s in service_list:
        if s.get('id') == svc_id:
            return s
    return None

# ---------- 1. Business Identity ----------
def gen_identity():
    extra = f'related: "[[Knowledge Hub]], [[Positioning]], [[Digital Footprint]]"'
    body = fm('Business Identity', 'mailbox-plus, business, identity', 'astro/src/config/siteConfig.ts (siteConfig)', extra)
    body += f"""
# Business Identity — from the Website

> Extracted from the live website source (`astro/src/config/siteConfig.ts`), not a summary. This is the site's own self-description.

## Legal & Brand

- **Name**: {sc['name']}
- **Legal name**: {sc['legalName']}
- **Tagline**: "{sc['tagline']}"
- **Domain**: {sc['domain']}
- **Description** (site's own): {sc['description']}

## Contact

- **Phone**: {sc['contact']['phone']}
- **Email**: {sc['contact']['email']}
- **Address**: {sc['contact']['address']['street']}, {sc['contact']['address']['city']}, {sc['contact']['address']['state']} {sc['contact']['address']['zip']}
- **Map**: {sc.get('mapUrl', 'n/a')}
- **Geo**: {sc['geo']['lat']}, {sc['geo']['lng']}

## Hours

| Day | Hours |
|---|---|
"""
    for day, hrs in sc['hours'].items():
        body += f"| {day.capitalize()} | {hrs} |\n"
    body += f"""
## Social

- **Facebook**: {sc['social']['facebook']}
- **Instagram**: {sc['social']['instagram']}
- **Nextdoor**: {sc['social']['nextdoor']}

## Area Served

{', '.join(sc.get('areaServed', []))}

## Notes

- This note regenerates from the website config on every sync — if the site's
  business facts change, re-run the vault-sync script rather than editing here.
"""
    (OUT / 'Business Identity.md').write_text(body)

# ---------- 2. Positioning ----------
def gen_positioning():
    extra = 'related: "[[Business Identity]], [[Brand Voice]], [[Knowledge Hub]]"'
    body = fm('Positioning', 'mailbox-plus, positioning, messaging', 'astro/src/config/services/*.ts (heroTitle/heroSubtitle)', extra)
    body += """
# Positioning — from the Website

> Extracted from every service config's hero copy. These are the site's actual
> positioning statements, not paraphrases.

## Core Positioning

"""
    core = find_service(services['core'], 'pack-ship')
    if core:
        body += f"""### Pack & Ship — "{core.get('heroTitle')}"
{clean_text(core.get('heroSubtitle'))}

- **Features title**: {clean_text(core.get('featuresTitle'))}
- **Features subtitle**: {clean_text(core.get('featuresSubtitle'))}
"""
    # collect every service hero across categories
    body += "\n## Every Service Hero\n\n| Service | Hero Title | Hero Subtitle |\n|---|---|---|\n"
    for cat, svcs in services.items():
        for s in svcs:
            body += f"| {s.get('serviceName', s.get('id'))} | {clean_text(s.get('heroTitle'))} | {clean_text(s.get('heroSubtitle'))} |\n"
    body += f"""
## CTA Taglines (site-wide)

- **Site tagline**: "{sc['tagline']}"

## Notes

- Regenerated from website configs on sync. The tagline on the site
  ("Shipping shouldn't cost you an hour.") is the current one.
"""
    (OUT / 'Positioning.md').write_text(body)

# ---------- 3. Services catalog: per-category notes + index ----------
SERVICE_CAT_NAMES = {
    'core': 'Core',
    'pack-ship': 'Pack & Ship',
    'copy-print': 'Copy & Print',
    'mailbox-rentals': 'Mailbox Rentals',
    'document-services': 'Document Services',
    'additional': 'Additional Services',
}
CAT_VAULT_LINK = {
    'pack-ship': '[[Shipping]]',
    'copy-print': '[[Copy & Print]]',
    'mailbox-rentals': '[[Private Mailboxes]]',
    'document-services': '[[Document Services]]',
    'additional': '[[Services]]',
}

def _svc_detail(s):
    out = []
    name = s.get('serviceName', s.get('id'))
    out.append(f"## {name} (`{s.get('id')}`)\n")
    out.append(f"- **Slug**: {s.get('slug')}")
    if s.get('metaDescription'):
        out.append(f"- **Meta**: {clean_text(s.get('metaDescription'))}")
    if s.get('heroTitle'):
        out.append(f"- **Hero**: {clean_text(s.get('heroTitle'))} — {clean_text(s.get('heroSubtitle'))}")
    if s.get('featuresTitle'):
        out.append(f"- **Features**: {clean_text(s.get('featuresTitle'))}: {clean_text(s.get('featuresSubtitle'))}")
    if s.get('features'):
        out.append("- **Feature list**:")
        for f in s['features']:
            out.append(f"  - **{f.get('title')}** — {clean_text(f.get('description'))}")
    if s.get('content'):
        out.append(f"- **Content sections** ({len(s['content'])}):")
        for c in s['content']:
            out.append(f"  - **{clean_text(c.get('heading'))}** — {clean_text(c.get('body'))[:250]}{'…' if len(clean_text(c.get('body'))) > 250 else ''}")
    if s.get('cta'):
        out.append(f"- **CTA**: {clean_text(s['cta'].get('title'))} / {clean_text(s['cta'].get('buttonText'))}")
    out.append("")
    return '\n'.join(out)

def gen_services():
    # Per-category full notes
    for cat, svcs in services.items():
        catname = SERVICE_CAT_NAMES.get(cat, cat)
        extra = 'related: "[[Services]], [[FAQ Hub]], [[Knowledge Hub]]"'
        body = fm(f'Services — {catname}', 'mailbox-plus, services, catalog', f'astro/src/config/services/{cat}.ts (full config)', extra)
        body += f"""
# {catname} Services — Full, from the Website

> Complete catalog extracted from the {cat} service config. Every service's
> actual description, features, and content sections.

"""
        for s in svcs:
            body += _svc_detail(s)
        link = CAT_VAULT_LINK.get(cat)
        if link:
            body += f"\nRelated: {link}, [[FAQ Hub]], [[Service Areas]]\n"
        fname = f'Services {catname}.md'
        (OUT / fname).write_text(body)
    # Index note
    extra = 'related: "[[Knowledge Hub]], [[FAQ Hub]], [[Service Areas]]"'
    body = fm('Services', 'mailbox-plus, services, catalog', 'astro/src/config/services/*.ts (config index)', extra)
    body += f"""
# Services Catalog — Index

> Index of the full service catalog. Each category has its own note with the
> complete data from the website configs.

"""
    for cat, svcs in services.items():
        catname = SERVICE_CAT_NAMES.get(cat, cat)
        body += f"\n## {catname} ({len(svcs)} services)\n\n"
        body += f"Full note: [[Services {catname}]]\n\n"
        for s in svcs:
            body += f"- **{s.get('serviceName', s.get('id'))}** — {clean_text(s.get('heroSubtitle'))[:150]}\n"
    body += """
## Notes

- Regenerated from website service configs on sync.
"""
    (OUT / 'Services.md').write_text(body)

# ---------- 4. FAQ Hub (171 FAQs) ----------
def gen_faqs():
    extra = 'related: "[[Services]], [[Knowledge Hub]]"'
    body = fm('FAQ Hub', 'mailbox-plus, faq, questions', 'astro/src/config/faqs/*.ts (all FAQ configs)', extra)
    body += """
# FAQ Hub — 171 FAQs from the Website

> Every FAQ from the site's FAQ configs, organized by category. Answers are the
> site's actual answers.

"""
    total = 0
    # general FAQs
    body += "\n## General Shipping\n\n"
    for f in faqs['generalShipping']:
        body += f"### {f['question']}\n\n{clean_text(f['answer'])}\n\n"
        total += 1
    body += "\n## General Copy & Print\n\n"
    for f in faqs['generalCopyPrint']:
        body += f"### {f['question']}\n\n{clean_text(f['answer'])}\n\n"
        total += 1
    body += "\n## General Home & Business\n\n"
    for f in faqs['generalHomeBusiness']:
        body += f"### {f['question']}\n\n{clean_text(f['answer'])}\n\n"
        total += 1
    # category FAQs (group by category dir)
    cats = faqs['categories']
    # group by prefix before ':'
    grouped = {}
    for key, arr in cats.items():
        prefix = key.split(':')[0]
        grouped.setdefault(prefix, []).extend(arr)
    CAT_LABELS = {
        'pack-ship': 'Pack & Ship',
        'copy-print': 'Copy & Print',
        'home-business': 'Home & Business',
        'specialty': 'Specialty',
        'notary': 'Notary',
    }
    for prefix in ['pack-ship', 'copy-print', 'home-business', 'specialty', 'notary']:
        arr = grouped.get(prefix, [])
        if not arr:
            continue
        body += f"\n## {CAT_LABELS.get(prefix, prefix)}\n\n"
        # dedupe by question
        seen = set()
        for f in arr:
            q = f['question']
            if q in seen:
                continue
            seen.add(q)
            body += f"### {q}\n\n{clean_text(f['answer'])}\n\n"
            total += 1
    body += f"\n---\n\n**Total FAQs in this note: {total}.**\n"
    (OUT / 'FAQ Hub.md').write_text(body)

# ---------- 5. Service Areas ----------
def gen_areas():
    extra = 'related: "[[Services]], [[Locations]], [[Knowledge Hub]]"'
    body = fm('Service Areas', 'mailbox-plus, service-areas, locations', 'astro/src/config/serviceAreas.ts', extra)
    body += f"""
# Service Areas — {len(areas)} Areas from the Website

> Every service area page's actual content.

"""
    for a in areas:
        name = a.get('serviceName', a.get('city'))
        body += f"\n## {name} (`{a.get('slug')}`)\n"
        body += f"- **Canonical**: {a.get('canonicalUrl')}\n"
        if a.get('metaDescription'):
            body += f"- **Meta**: {clean_text(a.get('metaDescription'))}\n"
        if a.get('priorityServices'):
            body += f"- **Priority services**: {', '.join(a['priorityServices'])}\n"
        if a.get('features'):
            body += "- **Features**:\n"
            for f in a['features']:
                body += f"  - **{f.get('title')}** — {clean_text(f.get('description'))}\n"
        if a.get('content'):
            body += f"- **Content** ({len(a['content'])} sections):\n"
            for c in a['content']:
                body += f"  - **{clean_text(c.get('heading'))}** — {clean_text(c.get('body'))[:180]}{'…' if len(clean_text(c.get('body'))) > 180 else ''}\n"
        if a.get('faqs'):
            body += f"- **FAQs** ({len(a['faqs'])}):\n"
            for f in a['faqs']:
                body += f"  - **{f['question']}** — {clean_text(f['answer'])[:150]}\n"
        body += "\n"
    (OUT / 'Service Areas.md').write_text(body)

# ---------- 6. Locations ----------
def gen_locations():
    extra = 'related: "[[Service Areas]], [[Knowledge Hub]]"'
    body = fm('Locations', 'mailbox-plus, locations, lake-county', 'astro/src/config/locations.ts', extra)
    body += """
# Locations — Lake County Coverage from the Website

> Unique local content per city from the locations config (programmatic SEO playbook).

## Primary Locations

"""
    for loc in locations['primary'] + locations['secondary']:
        tier = 'Primary' if loc in locations['primary'] else 'Secondary'
        body += f"\n### {loc['name']} ({tier})\n"
        body += f"- **County**: {loc.get('county')} | **Population**: {loc.get('population', 'n/a')}\n"
        uc = loc.get('uniqueContent', {})
        body += f"- **Drive time**: {uc.get('driveTime', 'n/a')}\n"
        if uc.get('directions'):
            body += f"- **Directions**: {clean_text(uc['directions'])}\n"
        if uc.get('landmarks'):
            body += f"- **Landmarks**: {', '.join(uc['landmarks'])}\n"
        if uc.get('nearbyHighways'):
            body += f"- **Nearby highways**: {', '.join(uc['nearbyHighways'])}\n"
        if uc.get('localExample'):
            body += f"- **Local example**: {clean_text(uc['localExample'])}\n"
        seo = loc.get('seo', {})
        if seo:
            body += f"- **Demonym**: {seo.get('demonymSingular', 'n/a')} / {seo.get('demonymPlural', 'n/a')} | **Area descriptor**: {seo.get('areaDescriptor', 'n/a')}\n"
    body += """
## Notes

- Regenerated from locations config on sync.
"""
    (OUT / 'Locations.md').write_text(body)

# ---------- 7. Articles index ----------
def gen_articles():
    extra = 'related: "[[Services]], [[Knowledge Hub]]"'
    body = fm('Articles Index', 'mailbox-plus, articles, content', 'content/articles/*.md (frontmatter)', extra)
    body += """
# Articles Index — from the Website Content Library

> Every published article on the site, indexed by category, with its intent
> keyword and target location. Link from here to read the full article.

"""
    articles = []
    art_dir = REPO / 'content' / 'articles'
    if art_dir.exists():
        for md in sorted(art_dir.rglob('*.md')):
            txt = md.read_text(encoding='utf-8', errors='ignore')
            m = re.match(r'^---\n(.*?)\n---', txt, re.S)
            if not m:
                continue
            fm_block = m.group(1)
            def getf(key):
                mm = re.search(rf'^{key}:\s*(.+)$', fm_block, re.M)
                return mm.group(1).strip().strip("'\"") if mm else ''
            articles.append({
                'title': getf('title'),
                'slug': getf('slug'),
                'category': getf('category'),
                'location': getf('location'),
                'pubDate': getf('pubDate'),
                'author': getf('author'),
                'intentKey': getf('intentKey'),
            })
    # group by category
    by_cat = {}
    for a in articles:
        by_cat.setdefault(a['category'] or 'uncategorized', []).append(a)
    for cat in sorted(by_cat):
        body += f"\n## {cat}\n\n"
        for a in by_cat[cat]:
            body += f"- **{a['title']}** — `{a['slug']}`"
            if a.get('location'):
                body += f" · {a['location']}"
            if a.get('pubDate'):
                body += f" · {a['pubDate'][:10]}"
            body += "\n"
    body += f"\n---\n\n**Total articles: {len(articles)}.**\n"
    (OUT / 'Articles Index.md').write_text(body)

# ---------- run all ----------
OUT.mkdir(parents=True, exist_ok=True)
gen_identity()
gen_positioning()
gen_services()
gen_faqs()
gen_areas()
gen_locations()
gen_articles()
print('Generated:')
for f in sorted(OUT.iterdir()):
    print(f'  {f.name}: {f.stat().st_size} bytes')

#!/usr/bin/env python3
"""Generate Astro page files for all services."""

import os
import re
import glob

BASE = '/home/blackghost/mailbox-plus-website/astro'

# Extract id -> slug mappings from all service config files
id_to_slug = {}
skip_ids = {'pack-ship', 'copy-print', 'home-business'}

for f in (sorted(glob.glob(f'{BASE}/src/config/services/**/*.ts', recursive=True)) +
          sorted(glob.glob(f'{BASE}/src/config/micro-problems/**/*.ts', recursive=True))):
    with open(f) as fh:
        content = fh.read()
    # Extract all id/slug pairs — they appear in order in each array
    ids = re.findall(r"id: '([^']+)'", content)
    slugs = re.findall(r"slug: '([^']+)'", content)
    for i, s in zip(ids, slugs):
        if i not in skip_ids:
            id_to_slug[i] = s

print(f"Found {len(id_to_slug)} services with slugs")

created = 0
skipped = 0
for sid, slug in sorted(id_to_slug.items()):
    parts = slug.strip('/').split('/')
    
    if len(parts) == 1:
        file_path = f'{BASE}/src/pages/{parts[0]}.astro'
        layout_path = '../layouts/ServiceLayout.astro'
        utils_path = '../utils/services-helpers'
    elif len(parts) >= 2:
        os.makedirs(f'{BASE}/src/pages/{parts[0]}', exist_ok=True)
        file_path = f'{BASE}/src/pages/{parts[0]}/{parts[1]}.astro'
        layout_path = '../../layouts/ServiceLayout.astro'
        utils_path = '../../utils/services-helpers'
    else:
        continue
    
    if os.path.exists(file_path):
        skipped += 1
        continue
    
    content = f"""---
import ServiceLayout from '{layout_path}';
import {{ getServiceById }} from '{utils_path}';

const service = getServiceById('{sid}')!;
---

<ServiceLayout service={{service}} />
"""
    with open(file_path, 'w') as f:
        f.write(content.lstrip())
    created += 1
    rel_path = os.path.relpath(file_path, BASE)
    print(f"  CREATED: {rel_path}  ({slug})")

print(f"\nDone: {created} created, {skipped} skipped (already exist)")

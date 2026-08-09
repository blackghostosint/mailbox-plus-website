#!/usr/bin/env python3
"""Verify wikilinks in the Mailbox Plus vault resolve to existing notes.
Handles spaces inside [[link names]] correctly (shell loops cannot)."""
import os
import re
import sys

VAULT = '/mnt/storage1/Obsidian/MainVault/Mailbox Plus'
KNOWLEDGE = os.path.join(VAULT, 'Knowledge')
PLANNING = os.path.join(VAULT, 'Planning')
TEMPLATES = os.path.join(VAULT, 'Templates')
ARCHIVED = os.path.join(VAULT, 'Archived')
ROOT = VAULT

# All existing note names (basename without .md) per directory, plus root
existing = set()
for d in [KNOWLEDGE, PLANNING, TEMPLATES, ARCHIVED, ROOT]:
    if os.path.isdir(d):
        for f in os.listdir(d):
            if f.endswith('.md'):
                existing.add(os.path.splitext(f)[0])

# Build a lookup across dirs: name -> list of dirs it exists in
def find_in(name):
    dirs = []
    if os.path.exists(os.path.join(KNOWLEDGE, name + '.md')):
        dirs.append('Knowledge')
    if os.path.exists(os.path.join(PLANNING, name + '.md')):
        dirs.append('Planning')
    if os.path.exists(os.path.join(TEMPLATES, name + '.md')):
        dirs.append('Templates')
    if os.path.exists(os.path.join(ROOT, name + '.md')):
        dirs.append('.')
    return dirs

LINK_RE = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]')
broken = []
total = 0
for d in [KNOWLEDGE, PLANNING, TEMPLATES, ROOT]:
    if not os.path.isdir(d):
        continue
    for f in sorted(os.listdir(d)):
        if not f.endswith('.md'):
            continue
        path = os.path.join(d, f)
        try:
            text = open(path, encoding='utf-8').read()
        except Exception:
            continue
        for m in LINK_RE.finditer(text):
            target = m.group(1).strip()
            total += 1
            # embedded file link e.g. [[assets/x.png]]
            if '/' in target:
                continue
            # special: ! Mailbox Plus Hub is the start-here hub
            found = find_in(target)
            if not found:
                broken.append(f'{d}/{f} -> [[{target}]]')

print(f'Checked {total} wikilinks')
if broken:
    print(f'BROKEN ({len(broken)}):')
    for b in broken:
        print('  ' + b)
    sys.exit(1)
else:
    print('ALL LINKS RESOLVE')

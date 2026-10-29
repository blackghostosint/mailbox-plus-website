// ---------- source:constraints — Layer A+ deterministic source-reconciliation gate ----------
// Frank, 2026-10-29: article PRs kept failing in review cycles on three defect
// classes that the existing gates cannot see:
//   (1) word-form numbers ("five minutes") — receipt-coverage regexes only match digits;
//   (2) scope errors — a TRUE number applied to the wrong tier/plan ("$15 tier takes
//       all four carriers" when the pricing page says $15 is Mail Only);
//   (3) copy contradicting the article's own fact-check receipt.
// Constraint-first fix: the Fact-Check Gate writes `.factchecks/<slug>.sources.json`
// BEFORE drafting — every allowed number (with its SOURCE-VERIFIED SCOPE) and every
// scope rule comes from the canonical source, not from the draft. This gate fails the
// PR when the article uses a number that was never registered, or violates a scope rule.
//
// sources.json shape (all fields optional except numeric_claims for new articles):
// {
//   "source_extracts": [{ "label": "pricing page", "url": "...", "quote": "..." }],
//   "numeric_claims":  [{ "value": "$15", "scope": "Small Mail Only tier price" },
//                       { "value": "10 minutes", "scope": "setup time" }],
//   "scope_rules":     [{ "forbid": "regex", "reason": "Mail Only tiers exist" }],
//   "required_when":   [{ "trigger": "regex", "must_include": "on package plans" }]
// }
// Exported as a factory; verify.mjs calls runSourceConstraintGate(slug, content, check, ROOT, DRAFTS_DIR).

const WORD_NUMBERS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  fifteen: 15,
  twenty: 20,
  twentyfour: 24,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
};

export function makeSourceConstraintGate(fs, path) {
  function parseValueToken(token) {
    // Normalize "$15", "15", "five", "10-12", "$150.50", "5%" to a comparable string.
    const t = token
      .trim()
      .toLowerCase()
      .replace(/^us?\$/, '$');
    // word-number + optional unit: "five minutes", "twenty-four hours", "ten"
    const wm = t.match(
      /^([a-z-]+)(\s*(?:%|minutes?|mins?|min|hours?|hr|miles?|mi|days?|weeks?|months?|month|cases?|packages?|dollars?|inches?|pounds?|lbs?))?$/
    );
    if (wm) {
      const compound = wm[1].replace(/[-\s]/g, '');
      const num = WORD_NUMBERS[compound];
      if (num !== undefined) {
        let unit = (wm[2] || '').trim();
        unit = unit
          .replace(/^minutes?$|^mins?$|^min$/, 'minutes')
          .replace(/^hours?$|^hr$/, 'hours')
          .replace(/^miles?$|^mi$/, 'miles')
          .replace(/^days?$/, 'days');
        return unit ? `${num} ${unit}` : String(num);
      }
    }
    if (
      /^\$?\d+(?:\.\d+)?(?:%| minutes?| mins?| min| hours?| hr| miles?| mi| days?| weeks?| months?| cases?)?$/.test(
        t
      )
    ) {
      return t
        .replace(/\bminutes?\b|\bmins?\b/, 'minutes')
        .replace(/\bhours?\b|\bhr\b/, 'hours')
        .replace(/\bmiles?\b|\bmi\b/, 'miles')
        .replace(/\bdays?\b/, 'days')
        .replace(/\binches?\b/, 'inches')
        .replace(/\bpounds?\b|\blbs?\b/, 'pounds')
        .replace(/\bpackages?\b/, 'packages')
        .replace(/\bdollars?\b/, 'dollars');
    }
    return null;
  }

  function extractNumericTokens(text) {
    // strip URLs and R2/CDN asset paths — digits in links are not claims
    const cleaned = text
      .replace(/\d{4}-\d{2}-\d{2}(?:T[\d:.+-]+Z?)?/g, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/[\w./-]+\.(?:webp|png|jpg|jpeg|svg|json)\b/gi, ' ');
    const tokens = [];
    // digit forms: $12.50, 10-12, 5%, 30 minutes, 24 cases
    const digitRe =
      /\$\d+(?:\.\d{1,2})?|\b\d{1,4}(?:-\d{1,4})?(?:\.\d+)?(?:\s*(?:%|minutes?|mins?|min|hours?|hr|miles?|mi|days?|weeks?|months?|month|cases?|packages?|dollars?|inches?|pounds?|lbs?))?\b/g;
    let m;
    while ((m = digitRe.exec(cleaned)) !== null) {
      if (/^\d{4}$/.test(m[0].replace(/\s.*/, ''))) continue; // years
      tokens.push({
        token: m[0],
        index: m.index,
        ctx: cleaned
          .slice(Math.max(0, m.index - 40), m.index + m[0].length + 20)
          .replace(/\s+/g, ' '),
      });
    }
    // word forms: five minutes, ten, twenty-four
    const wordRe =
      /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)(?:[-\s](?:one|two|three|four|five|six|seven|eight|nine))?\b(?:\s*(?:%|minutes?|mins?|min|hours?|hr|miles?|mi|days?|weeks?|months?|month|cases?|packages?|dollars?|inches?|pounds?|lbs?))?/gi;
    while ((m = wordRe.exec(cleaned)) !== null) {
      const norm = parseValueToken(m[0]);
      if (norm !== null)
        tokens.push({
          token: m[0],
          index: m.index,
          wordForm: true,
          ctx: cleaned
            .slice(Math.max(0, m.index - 40), m.index + m[0].length + 20)
            .replace(/\s+/g, ' '),
        });
    }
    return tokens;
  }

  function runSourceConstraintGate(slug, articleText, check, ROOT, DRAFTS_DIR) {
    const candidates = [
      path.join(DRAFTS_DIR, `${slug}.sources.json`),
      path.join(path.dirname(slug), `${path.basename(slug)}.sources.json`),
    ];
    const found = candidates.find((f) => fs.existsSync(f));
    if (!found) {
      check(
        'source:constraints',
        false,
        `no ${slug}.sources.json in ${DRAFTS_DIR}`,
        'constraint-first rule: during the Fact-Check Gate, register every allowed number and scope rule in sources.json BEFORE drafting — see docs/ARTICLE-WORKFLOW.md Hard Gate 2b'
      );
      return;
    }
    let sources;
    try {
      sources = JSON.parse(fs.readFileSync(found, 'utf8'));
    } catch (e) {
      check(
        'source:constraints',
        false,
        `unparseable sources.json: ${e.message}`,
        'fix JSON syntax'
      );
      return;
    }
    check('source:constraints', true, `${path.relative(ROOT, found)} loaded`);

    const numericClaims = Array.isArray(sources.numeric_claims) ? sources.numeric_claims : [];
    const allowedValues = new Set(
      numericClaims.map((c) => parseValueToken(String(c.value ?? ''))).filter(Boolean)
    );
    if (numericClaims.length === 0) {
      check(
        'source:numeric-claims',
        false,
        'sources.json has no numeric_claims — nothing is pre-registered',
        'extract every number the article may use from its canonical source into numeric_claims during the Fact-Check Gate'
      );
    } else {
      check('source:numeric-claims', true, `${numericClaims.length} numbers pre-registered`);
    }

    // A) every numeric token in the article must be registered (or in the receipt text)
    const tokens = extractNumericTokens(articleText);
    const uncovered = [];
    for (const t of tokens) {
      const norm = parseValueToken(t.token);
      if (norm === null) continue;
      if (allowedValues.has(norm)) continue;
      uncovered.push(`${t.token} ("…${t.ctx || ''}…")`);
    }
    const uniqUncovered = [...new Set(uncovered)];
    check(
      'source:number-coverage',
      uncovered.length === 0,
      uncovered.length === 0
        ? `${tokens.length} numeric usages, all pre-registered`
        : `unregistered numbers: ${uniqUncovered.slice(0, 8).join('; ')}`,
      'every number in the copy must exist in sources.json numeric_claims with its source-verified scope — if the fact-check did not verify it, cut it or verify it first'
    );

    // B) scope rules — forbidden patterns must not match anywhere in the article
    for (const rule of Array.isArray(sources.scope_rules) ? sources.scope_rules : []) {
      if (!rule.forbid) continue;
      let re;
      try {
        re = new RegExp(rule.forbid, 'i');
      } catch (e) {
        check('source:scope-rule', false, `bad scope_rule regex: ${rule.forbid} (${e.message})`);
        continue;
      }
      const hit = re.exec(articleText);
      check(
        'source:scope-rule',
        !hit,
        hit
          ? `scope violation: /${rule.forbid}/ matches "${hit[0]}" — ${rule.reason || 'no reason recorded'}`
          : `clean: /${rule.forbid}/`,
        rule.reason || 'rewrite the claim to match the source-verified scope'
      );
    }

    // C) required_when — if trigger matches, the qualifier must appear within the article
    for (const rule of Array.isArray(sources.required_when) ? sources.required_when : []) {
      if (!rule.trigger || !rule.must_include) continue;
      let reT, reM;
      try {
        reT = new RegExp(rule.trigger, 'i');
        reM = new RegExp(rule.must_include, 'i');
      } catch (e) {
        check('source:required-qualifier', false, `bad required_when regex: ${e.message}`);
        continue;
      }
      if (reT.test(articleText) && !reM.test(articleText)) {
        check(
          'source:required-qualifier',
          false,
          `trigger /${rule.trigger}/ matched but required qualifier /${rule.must_include}/ is missing`,
          `add the qualifier: "${rule.must_include}"`
        );
      } else {
        check('source:required-qualifier', true, `ok: /${rule.trigger}/ + /${rule.must_include}/`);
      }
    }
  }

  return { runSourceConstraintGate, parseValueToken, extractNumericTokens };
}

if (isMainModuleFor(import.meta.url)) {
  const { parseScriptArgs } = await import('../lib/cli-utils.ts');
  const { values } = parseScriptArgs({
    options: {
      slug: { type: 'string' },
      article: { type: 'string' },
      root: { type: 'string' },
      drafts: { type: 'string' },
    },
    strict: false,
  });
  const fs = await import('node:fs');
  const path = await import('node:path');
  const article = fs.readFileSync(values.article, 'utf8');
  // gate reads the FULL file (frontmatter carries quickAnswer/faqs numbers too)
  const results = [];
  const check = (name, pass, detail, fix) => results.push({ name, pass: !!pass, detail, fix });
  const { runSourceConstraintGate } = makeSourceConstraintGate(fs.default, path.default ?? path);
  runSourceConstraintGate(values.slug, article, check, values.root, values.drafts);
  console.log(JSON.stringify(results, null, 0));
  process.exit(results.some((r) => !r.pass) ? 1 : 0);
}

function isMainModuleFor(_url) {
  const argv1 = process.argv[1];
  if (!argv1) return false;
  return (
    import.meta.url === (typeof process !== 'undefined' ? new URL(`file://${argv1}`).href : '')
  );
}

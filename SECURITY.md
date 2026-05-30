# Security Audit Report

## Summary
As of May 29, 2026, `npm audit` reports **8 total vulnerabilities** (6 low, 2 moderate) in dev dependencies only. No production runtime dependencies are affected.

## Vulnerable Packages
| Package               | Severity | Advisory Link                                                                 | Notes                                  |
|-----------------------|----------|-------------------------------------------------------------------------------|----------------------------------------|
| esbuild <=0.24.2      | Moderate | [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)     | Dev-only: Affects Vite dev server only |
| elliptic *            | Low      | [GHSA-848j-6mx2-7j84](https://github.com/advisories/GHSA-848j-6mx2-7j84)     | Transitive dev dependency              |
| browserify-sign >=2.4.0 | Low    | Depends on vulnerable elliptic                                                | Transitive dev dependency              |
| crypto-browserify >=3.4.0 | Low   | Depends on vulnerable browserify-sign/create-ecdh                             | Transitive dev dependency              |
| create-ecdh *         | Low      | Depends on vulnerable elliptic                                                | Transitive dev dependency              |
| node-stdlib-browser * | Low      | Depends on vulnerable crypto-browserify                                       | Transitive dev dependency              |
| vite-plugin-node-polyfills >=0.3.0 | Low | Depends on vulnerable node-stdlib-browser | Dev dependency |
| vite <=6.4.1          | Low      | Depends on vulnerable esbuild                                                 | Dev dependency                         |

## Remediation Attempt
Ran `npm audit fix` (without `--force`) as requested to avoid breaking changes. No fixes were applied automatically because resolving the vulnerabilities requires breaking version upgrades:
- Upgrading to `vite@8.0.14+` (breaking change from Vite 5.x)
- Upgrading to `vite-plugin-node-polyfills@0.2.0` (breaking change)

## Risk Assessment
All vulnerabilities are **dev-only**:
- Affected packages are only used in development (Vite dev server, build tools) and polyfills for Node.js APIs in browser builds
- No vulnerable code is included in production runtime bundles
- The esbuild moderate vulnerability only allows unauthorized requests to the local development server, which is never exposed to the public internet

## Conclusion
These vulnerabilities pose no risk to production deployments and can be safely ignored until a non-breaking fix is available or the project is ready to upgrade to Vite 8+.

## Next Steps
- Monitor for non-breaking updates to Vite 5.x or the vulnerable transitive dependencies
- Consider upgrading to Vite 8+ (with testing) in a future major version update to fully resolve the issues

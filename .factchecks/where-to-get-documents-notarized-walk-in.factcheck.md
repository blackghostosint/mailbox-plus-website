# Fact-Check Receipt — where-to-get-documents-notarized-walk-in

Article: Where to Get Documents Notarized Without an Appointment: Your Walk-In Options, Compared
Verified: 2026-10-21 by independent subagent (fresh context) against official Ohio government sources + in-repo facts.json.

| #   | Claim                                                                                                                                                            | Verdict        | Source URL                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Ohio caps the notarial-act fee at $5 per act (not per signature) for non-online acts                                                                             | ✅             | https://codes.ohio.gov/ohio-revised-code/section-147.08                                                                                                   |
| 2   | Online notarization: up to $30 per act plus technology fee up to $10 per session                                                                                 | ✅             | https://codes.ohio.gov/ohio-revised-code/section-147.08                                                                                                   |
| 3   | ID: passport, driver's license, gov-issued nondriver ID or other gov ID with photo or signature, current or expired ≤3 years                                     | ✅             | https://codes.ohio.gov/ohio-revised-code/section-147.50 ; https://www.ohiosos.gov/notary/become-a-notary-in-ohio/resources-and-frequently-asked-questions |
| 4   | Jurat requires signing in the notary's presence; acknowledgment allows prior signing (draft corrected from blanket "must sign before notary")                    | ✅ (after fix) | https://codes.ohio.gov/ohio-revised-code/section-147.53 ; Ohio SOS FAQ                                                                                    |
| 5   | Notary certificate: state/county venue, wording, date, seal, commission expiration (ORC 147.542); notary may explain ack vs jurat but only attorneys advise type | ✅             | https://codes.ohio.gov/ohio-revised-code/section-147.542 ; Ohio SOS FAQ                                                                                   |
| 6   | Personal appearance required; notary role is identity verification + witnessing, not document review                                                             | ✅             | Ohio SOS FAQ ; https://codes.ohio.gov/ohio-revised-code/chapter-147                                                                                       |
| 7   | Mailbox Plus Concord Township hours Mon–Fri 9–6, Sat 9–2, Sun closed                                                                                             | ✅             | in-repo content/facts.json (canonical store facts)                                                                                                        |
| 8   | Address: Mailbox Plus, 7554 Fredle Drive, Concord Township OH 44077; phone 440-709-1946                                                                          | ✅             | in-repo content/facts.json ; astro/src/config/siteConfig.ts                                                                                               |
| 9   | Location phrasing "just off Crile Road, minutes from SR-44 and I-90"                                                                                             | ✅             | content/facts.json approved_phrasing (owner-verified)                                                                                                     |
| 10  | "Many banks reserve notary service for their own account holders"                                                                                                | ⚠️ softened    | Hedged with "many" + "call first" guidance in body; no categorical claim asserted                                                                         |
| 11  | "Many shipping-franchise stores offer notary service, availability store-specific"                                                                               | ⚠️ softened    | Hedged with "many"/"call the specific store first"; no national-brand guarantee asserted                                                                  |

Initial draft errors caught and fixed before PR:

- Blanket "do not sign beforehand — the notary must watch you sign" corrected to the jurat/acknowledgment distinction (ORC 147.53 / Ohio SOS FAQ).
- quickAnswer "select retail stores" replaced with wording matching the body.
- Route claim "turn off Route 44 onto Fredle Drive" replaced with approved phrasing "just off Crile Road, minutes from SR-44 and I-90".

Sister-article errors noted for Frank (out of scope for this PR — different live pages):

- ohio-notary-services-guide.md and the-notary-runaround.md reportedly carry incorrect claims: $5 cap cited as "ORC 147.07 per signature" (correct: ORC 147.08, per act) and a UPS Store $10-per-signature claim (impossible under ORC 147.08's cap for in-person acts). Recommend a fix-up pass.

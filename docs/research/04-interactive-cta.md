# 04 · Interactive call to action: research behind "Discover why you are losing customers"

Date: 19 November 2026. Two research agents, 40+ sources. Most conversion benchmarks are vendor-reported and observational, so the figures below are planning ranges, not forecasts. None of the sources is Iraqi-specific, except where marked.

## 1. Why replace "Contact us"
- **Quiz vs form.** A static B2B contact form or "book a call" page converts roughly 2-5% of visitors (Unbounce median 6.6% across all landing pages). Across 1,063 quiz funnels, 7.85% of visitors became leads (ConvertFlow, Sep 2026), and quiz landing pages reached 11.28%.
- **The honest denominator.** Interact's often-quoted 40% counts only people who started the quiz. Plan with 8-11% of visitors.
- **CTA wording alone moves conversion.** "Book a demo" → "Talk to a human" (Mailmodo) and "Book a demo" → "Get started" (PartnerStack) each roughly doubled conversion. HubSpot reports +202% for personalised CTAs.
- **A quiz is not automatically a win.** One controlled store test was flat (+0.3% revenue per visitor). Measure from day one.

## 2. Design rules we applied (and the evidence)
| Rule | Evidence | Where in the build |
|---|---|---|
| 6-8 scored questions, about 60-90 s, one per screen, tap answers | LeadQuizzes and RevenueHunt see drop-off after Q6-8; Riddle's median completion is 86% for 1-5 questions; closed questions cause less drop-off than open ones | 9 one-tap questions; no free text |
| Start easy, put sensitive questions late, use ranges | Foot-in-the-door effect (5-15 points); placement is not decisive (Harvard working paper) | Industry first; "who disappears" in the middle with a "nobody sees this" hint; budget asked indirectly, after the reveal |
| Give a head start; make the progress bar fast then slow | Endowed progress: 34% vs 19% card completion (Nunes & Dreze 2006). Villar meta-analysis: fast-to-slow bars reduce drop-off; constant bars do not | Bar starts at 12% and moves fast early |
| Let people build something | IKEA effect: effort raises value, but only when the task is completed (Norton et al. 2012) | The planet is built from the answers; the visitor never hits an error before the result |
| Show the work honestly | Labour illusion: people prefer services that show their work (Buell & Norton 2011) | 3 real sub-steps of about 2.5 s in total. No fake delay |
| Echo the visitor's own answers; give them a type | Self-reference effect, average d ≈ .45 (Symons & Johnson 1997); identity labels drive sharing | 6 orbit types, each sentence filled with the visitor's answers |
| No Barnum text | Forer/Barnum: generic flattering text feels personal. That is the ethical line | Every result sentence depends on an answer; unit tests check that types and plans change with the inputs |
| Gate after the reveal, with a partial result free | Vendors converge on this pattern; Octane notes results-first raises trust | Type, score and headline number free; full report after WhatsApp |
| Phone as a trade, not a demand | A required phone field cut conversion 43% in one test | "Get your full report" plus "Not now", which still shows the WhatsApp button |
| Cost of inaction in money, not fear | Loss-framing effects are small and contested (Gal & Rucker 2018) | Value at stake shown as a range, with assumptions the visitor can edit |
| Benchmark peers only with real data | Social comparison works (Allcott 2011: -2%), but low performers can boomerang | No "ahead of X%" until 100+ real responses exist (brand rule: no invented numbers) |
| One strong peak and a clean ending | Peak-end rule (Kahneman 1993) | Peak: the score and planet reveal. End: a 3-step plan and one WhatsApp button |
| Reply fast | Leads contacted within 5 minutes are about 100x more likely to be reached (Oldroyd, MIT/InsideSales 2007). HBR 2011 audit: 42-hour average response | Telegram alert with a one-tap reply-on-WhatsApp button |

**Weak or unhelpful evidence.**
- **Zeigarnik effect:** fails to replicate (2025 meta-analysis).
- **Choice overload:** about zero effect (Scheibehenne 2010).

Neither was used as a design lever.

## 3. Iraq context
DataReportal Digital 2026, Iraq:
- 39.6M internet users (83.8%).
- Instagram ad reach 21.5M, now above Facebook's 20.8M.

Ipsos 2025 (search summary, not verified against the PDF): WhatsApp is used by about 74% of social media users and is the most preferred platform.

How SMEs sell and get paid:
- Selling runs mostly by hand through Instagram and WhatsApp.
- Cash on delivery dominates; ZainCash, Qi Card and FastPay are also used.

No Iraqi data was found on SME willingness to pay or attitudes to AI. The budget bands are our own judgement and must be checked against real sales calls.

## 4. Privacy and law
- Iraq has no comprehensive data protection law in force; the draft is unenacted as of 2026.
- The CMC's Digital Platforms Framework (Feb 2025) asks for "international best practices".

We adopted GDPR-style practice:
- an unticked consent box (contact consent separate from marketing consent);
- the consent text stored with a timestamp;
- 12-month retention;
- deletion on request;
- the IP address stored only as a salted hash;
- a `/privacy` page.

## 5. Formulas (stated on the page)
- **Monthly inquiries** = the middle of the daily range chosen × 26 working days.
- **Lost** = monthly inquiries × the share the visitor says disappear.
- **Won back with instant replies** = 12-55% of lost, depending on today's reply speed. This is conservative; the direction comes from the response-speed research, not its exact numbers.
- **Hours freed** = 40-60% of the reported repetitive hours. McKinsey puts about 45% of paid activities as automatable.
- **Value at stake** = won back × conversion × value of a new customer, using per-industry presets that the owner must confirm.

Every figure is shown as a range of -30% / +15% around the estimate.

## 6. What proves it works (not us)
| Measure | Target |
|---|---|
| Start → finish | ≥ 60% |
| Finish → WhatsApp number | ≥ 30% |
| Visitor → lead | ≥ 8% |

Also:
- Read `v_launch_funnel` for drop-off on each question, and shorten or reword any question that loses more than 10%.
- After about 50 leads: do A-graded leads close more often than C? If not, re-weight `leadScore`.
- Before the public launch: a hallway test with 5 Iraqi business owners.

## Main sources
- ConvertFlow, Lead generation quiz funnel benchmark, Sep 2026: https://www.convertflow.com/benchmark-reports/lead-generation-quiz-funnel-benchmark-september-2026
- Interact, Quiz conversion rate report: https://tryinteract.com/blog/quiz-conversion-rate-report/
- Riddle engagement report (via EIN Presswire): https://www.einpresswire.com/article/900164970/the-engagement-gap-most-websites-lose-users-after-just-56-seconds
- Villar et al., meta-analysis of progress indicators: https://research.google/pubs/where-am-i-a-meta-analysis-of-experiments-on-the-effects-of-progress-indicators-for-web-surveys/
- Buell & Norton 2011, labour illusion: https://pubsonline.informs.org/doi/fpi/10.1287/mnsc.1110.1376
- Norton, Mochon & Ariely 2012, IKEA effect: https://scholars.duke.edu/publication/861385
- Optional phone field test: https://disruptiveadvertising.com/landing-pages/optional-form-fields
- Speed-to-lead benchmark 2026: https://artemisgtm.ai/research/speed-to-lead-benchmark-2026/
- DataReportal, Digital 2026 Iraq: https://datareportal.com/reports/digital-2026-iraq
- Iraq digital platforms framework: https://www.legal500.com/intelligence/iraq/finance-and-banking/new-regulatory-framework-for-digital-platforms-and-services-in-iraq
- Zapier, State of business automation: https://zapier.com/blog/state-of-business-automation-report/

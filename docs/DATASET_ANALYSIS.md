# Dataset Analysis — HHGOA_IEEE

All figures below are measured directly from the actual CSV files in `data/` (full-file
scans, not samples), except where marked **PENDING** — those require `transactions.csv`
(~708 MB, 590,742 rows), which is still being uploaded in chunks. This document will be
completed once that file lands; nothing below substitutes for it.

## 1. `closed_cases_history.csv` — full-file analysis (5,565 rows)

**Outcome split:** 4,665 `confirmed_fraud` (83.8%) / 900 `cleared` (16.2%).

**Pattern distribution (all rows):**

| Pattern | Count | % of all cases | % of confirmed fraud |
|---|---:|---:|---:|
| `card_not_present_fraud` | 1,404 | 25.2% | 30.1% |
| `account_takeover` | 1,205 | 21.7% | 25.8% |
| `card_not_present_new_device` | 1,076 | 19.3% | 23.1% |
| `out_of_region_use` | 955 | 17.2% | 20.5% |
| `none` (cleared) | 900 | 16.2% | — |
| `card_testing` | 16 | 0.3% | 0.3% |
| `undocumented` | 9 | 0.2% | 0.2% |

**Total confirmed-fraud exposure across all closed cases:** $2,072,387.77.

**SAR-equivalent filing rate:** 397 of 5,565 (7.1%) have `report_filed = Yes` — i.e. only
~8.5% of confirmed-fraud cases were escalated to a filed report, consistent with the
policy's design that most cases never need one (report only when confirmed/strongly
suspected **and** exposure > $1,000 or a shared-element/coordinated pattern).

**Key finding — an undocumented pattern is really two patterns.** All 9 `undocumented`
rows were read in full (not sampled). They split cleanly into two distinct, describable
behaviors, neither matching any of the five documented patterns (full detail and
detection logic in `FRAUD_PATTERNS.md` §6):

- **Device-profile ring** (CC-2649, CC-2971, CC-2985, CC-3035): four different customers,
  each hit by 2–3 unauthorized online purchases from the exact same device signature —
  Samsung SM-G935F, Chrome for Android, behind `IP_PROXY:ANONYMOUS`, `id_15 = New` on
  every affected account. This is discoverable only by traversing the device-profile
  graph across customers, not by looking at any single card.
- **Sub-threshold structuring** (CC-3748, CC-3841, CC-3907, CC-4086, CC-4124): five
  different customers, each hit by exactly four online purchases within a 40-minute
  window, each individually priced just under $500 — the analyst notes explicitly
  observe this looks like deliberate structuring to stay under a $500 authorization
  ceiling.

This matters for the benchmark: if any of the 20 `case_pack.csv` cases show either
signature, the correct `pattern` value is `undocumented` with a `pattern_description`
naming the specific sub-type — not a forced fit into one of the five known patterns, and
not a generic "undocumented" with no description (which the answer format also
penalizes, since `pattern_description` is required content, not a formality).

## 2. `identity.csv` — full-file analysis (144,432 rows, online transactions only)

**`id_15` (device status):** `Found` 67,773 (46.9%) · `New` 61,754 (42.8%) · `Unknown`
11,653 (8.1%) · blank 3,252 (2.3%). Nearly as many online transactions come from a
device new to the account as from a recognized one — confirming the README's warning
that `id_15 = New` alone is a weak signal (otherwise ~43% of all online activity would
have to be treated as suspicious).

**`id_23` (proxy status):** overwhelmingly blank/none (139,144, 96.3%); `IP_PROXY:TRANSPARENT`
3,492 (2.4%); `IP_PROXY:ANONYMOUS` 1,185 (0.8%); `IP_PROXY:HIDDEN` 611 (0.4%). Proxy use
is rare enough (3.6% combined) to be a meaningfully aggravating signal when it coincides
with other anomalies (as it does in the device-ring cases above), unlike `id_15`.

**`DeviceType`:** `desktop` 85,204 (59%) · `mobile` 55,801 (39%) · blank 3,427 (2%).

**`DeviceInfo`:** 1,787 distinct values. Top values are generic OS/browser identifiers
(`Windows` 47,741; `iOS Device` 19,805; `MacOS` 12,579; `Trident/7.0` 7,446), meaning
`DeviceInfo` alone is not a useful entity key — it must be combined with `id_30` (OS),
`id_31` (browser), and `id_33` (screen resolution) into a composite `DeviceProfile`, per
the README's suggested schema, before it's specific enough to link accounts. The
device-ring finding above only became visible because `SAMSUNG SM-G935F Build/NRD90M`
(448 occurrences in `identity.csv`) is specific hardware, not a generic OS string.

## 3. `case_pack.csv` — the 20 benchmark cases (full-file analysis)

**Trigger type:** `risk_score` 11 (55%) · `customer_report` 8 (40%) · `analyst_request` 1
(5%, HHG-014 — explicitly an analyst noticing a shared device profile across several
cards, which should be investigated as a potential device-ring per §1 above, not a
single-card pattern).

**Risk score distribution (11 risk_score-triggered cases):** ranges 0.52–0.90, with a
roughly even spread across low-to-high — 0.52, 0.54, 0.55, 0.57, 0.61, 0.76, 0.77, 0.79,
0.87, 0.90, 0.90. Per the README, risk scores above 0.7 are frequently *wrong* (mostly
legitimate), so the four cases at 0.87–0.90 (HHG-007, HHG-010, HHG-019) are not
pre-judged as fraud — they still require full graph investigation.

**Amounts on flagged transactions:** span $30.02 (HHG-009) to $1,000.03 (HHG-010) — the
$1,000.03 case sits right at the SAR exposure threshold ($1,000) if confirmed alone,
before even considering connected cards.

**Customer-report cases (8):** HHG-003, 004, 006, 008, 009, 011, 016, 018 — all use
identical phrasing ("I never made this $X purchase"), meaning the *only* way to
differentiate a legitimate disputed-recurring-charge (policy R7) from real
card-not-present fraud (R1–R4) is graph evidence: transaction history, device, and region
context per card, since the trigger text itself carries no differentiating signal.

## 4. `transactions.csv` — PENDING

**PENDING (708 MB, 590,742 rows, 397 columns).** Once available, this section will be
completed with: `ProductCD` distribution and the `channel` split it implies; `card4`/`card6`
network/type distribution; `addr1`/`addr2` region distribution and which regions count as
"home" per customer; amount distribution and outliers; per-customer/per-card transaction
counts and velocity; join coverage against `identity.csv` (144,432 of 590,742 rows, ~24.5%,
should be online transactions — to be confirmed once `ProductCD` is visible); and, most
importantly, direct lookups of all 20 `case_pack.csv` `flagged_txn_id` values and their
surrounding card histories, which is the prerequisite for every downstream investigation,
pattern match, and answer file in this project.

No case investigation, fraud-pattern verdict, or benchmark output will be produced until
this file is loaded — per the project's evidence-over-hallucination principle, we do not
simulate or estimate transaction-level facts that this file alone can provide.

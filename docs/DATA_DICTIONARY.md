# Data Dictionary — HHGOA_IEEE Fraud Investigation Dataset

Source: `data/README.md` (the dataset's own documentation), plus direct inspection of
`data/identity.csv`, `data/closed_cases_history.csv`, and `data/case_pack.csv`.
`data/transactions.csv` (590,742 rows, 393 Vesta columns + 4 added columns, ~708 MB) is
the base IEEE-CIS Fraud Detection file; its column groups are documented below from the
README's own description. This dictionary will be updated with row counts and observed
value ranges once that file is available locally.

No column name, semantic, or value below is invented — everything here is either quoted
from the dataset's own README or measured directly from the CSV files. Where the README
says a column's individual meaning is not published by Vesta (the `V`, `C`, `D`, `M`, and
`id_0x` numeric groups), this dictionary says so explicitly rather than guessing.

---

## 1. `transactions.csv` (590,742 rows, 397 columns)

Base file: the IEEE-CIS Fraud Detection dataset (Vesta Corporation), fraud label
removed, four columns added. Joins to `identity.csv` on `TransactionID`. Amounts in USD.
`TransactionID`, `card1`, `TransactionDT`, and `TransactionAmt` were disguised (new IDs,
small time/amount offsets) — the underlying Kaggle files must not be used to reverse
this.

### 1a. Original Vesta columns (identity by group, per README)

| Group | Columns | Count | Meaning |
|---|---|---|---|
| Identifiers/amount | `TransactionID`, `TransactionDT`, `TransactionAmt` | 3 | Transaction ID; seconds elapsed from the dataset's start (`TransactionDT`); USD amount |
| Product | `ProductCD` | 1 | Product code: `W`, `C`, `H`, `R`, `S`. `W` = no identity record, treated as in-person (`channel = in_person`) |
| Card | `card1`–`card6` | 6 | `card4` = network (visa / mastercard / american express / discover); `card6` = type (credit / debit); `card1`, `card2`, `card3`, `card5` = issuer codes (individually unnamed) |
| Address | `addr1`, `addr2` | 2 | `addr1` = anonymized billing region code; `addr2` = billing country code (87 = home country) |
| Distance | `dist1`, `dist2` | 2 | Distances between two unnamed points, when known |
| Email | `P_emaildomain`, `R_emaildomain` | 2 | Purchaser / recipient email domain |
| Counts | `C1`–`C14` | 14 | Counts (e.g. addresses/phones associated with the card). Individually unnamed — use only as relative/aggregate signals |
| Time deltas | `D1`–`D15` | 15 | Time deltas in days (e.g. days since previous transaction on this card). Individually unnamed |
| Match flags | `M1`–`M9` | 9 | Match flags (e.g. name-on-card vs. address match) |
| Engineered features | `V1`–`V339` | 339 | Vesta's proprietary ranking/counting/relationship features. No individual names published — usable only as raw numeric signals, never asserted to mean something specific |

### 1b. Columns added for this hackathon

| Column | Type | Meaning |
|---|---|---|
| `customer_id` | string, e.g. `C01234` | Derived from the card-issuer field. One customer can hold several cards; card IDs in case data look like `C01234-K1`, `C01234-K2` |
| `ts` | `YYYY-MM-DD HH:MM:SS` | Real timestamp, July 2 – December 31, 2016, derived from `TransactionDT` |
| `channel` | `in_person` \| `online` | `in_person` = `ProductCD = W` (no identity record); `online` = all other product codes (identity record present when captured) |
| `risk_score` | float, 0–1 | Bank detection-model score. **An input signal, not a verdict** — per README, above 0.7 most flagged transactions are legitimate, and some fraud scores near zero |

---

## 2. `identity.csv` (144,432 rows, 41 columns)

Vesta's identity/device capture for **online transactions only** (joins to `transactions.csv`
on `TransactionID`). Verified by direct read of the file header and full-column scan.

| Column(s) | Count | Meaning |
|---|---|---|
| `TransactionID` | 1 | Join key to `transactions.csv` |
| `id_01`–`id_11` | 11 | Encoded numeric ratings: device rating, IP-domain rating, proxy rating, login counts, time on page. Individually unnamed except as noted below |
| `id_12`–`id_38` | 27 | Categorical identity fields, mostly unnamed. Readable ones per README, confirmed present in the file: |
| — `id_15` | | Device status: measured values `Found` (67,773), `New` (61,754), `Unknown` (11,653), blank (3,252) |
| — `id_23` | | Proxy status: measured values blank/none (139,144), `IP_PROXY:TRANSPARENT` (3,492), `IP_PROXY:ANONYMOUS` (1,185), `IP_PROXY:HIDDEN` (611) |
| — `id_30` | | OS string (e.g. `Android 7.0`, `Windows 10`) |
| — `id_31` | | Browser string (e.g. `chrome for android`, `samsung browser 6.2`) |
| — `id_33` | | Screen resolution (e.g. `2220x1080`) |
| — `id_34` | | Match status |
| `DeviceType` | 1 | Measured values: `desktop` (85,204), `mobile` (55,801), blank (3,427) |
| `DeviceInfo` | 1 | Free-text device/platform string, e.g. `SAMSUNG SM-G935F Build/NRD90M`, `Windows`, `iOS Device`, `MacOS`. 1,787 distinct values observed |

**DeviceProfile construction** (per README's suggested schema): `DeviceInfo + id_30 (OS) +
id_31 (browser) + id_33 (screen)` composed into one logical vertex, so that the same
physical device configuration used across different accounts is identifiable in the
graph. Confirmed useful: `SAMSUNG SM-G935F Build/NRD90M` on `Chrome for Android` behind
an anonymous proxy (`id_23 = IP_PROXY:ANONYMOUS`) recurs across at least four unrelated
customers in `closed_cases_history.csv` (see `DATASET_ANALYSIS.md` and `FRAUD_PATTERNS.md`).

---

## 3. `closed_cases_history.csv` (5,565 rows, 15 columns)

Confirmed by direct read. The bank's finished investigations, July–October 2016 — the
only source of ground truth in the dataset, and the seed for case memory (GraphRAG /
similar-case retrieval).

| Column | Type | Meaning |
|---|---|---|
| `case_id` | string, e.g. `CC-0001` | Closed-case identifier |
| `customer_id` | string | Cardholder |
| `card_id` | string | Card investigated |
| `opened_at` | timestamp | Case opened |
| `closed_at` | timestamp | Case closed |
| `outcome` | `confirmed_fraud` \| `cleared` | Ground-truth outcome. Measured: 4,665 confirmed_fraud / 900 cleared |
| `pattern` | enum | One of the five documented patterns, `undocumented`, or `none` (cleared cases only) |
| `first_fraud_txn_id` | string, may be empty | Where the fraud episode started (empty for cleared cases) |
| `txn_ids` | pipe-separated string | Every transaction in the episode |
| `n_txns` | int | Count of `txn_ids` |
| `exposure_usd` | float | Sum of absolute amounts of `txn_ids` |
| `connected_card_ids` | string, may be empty, pipe-separated | Other cards implicated in the same ring/device/compromise |
| `actions_taken` | pipe-separated string | Actions from the policy's action vocabulary (e.g. `CREATE_CASE\|BLOCK_CARD`) |
| `report_filed` | `Yes` \| `No` | Whether a SAR-equivalent was filed. Measured: 397 Yes / 5,168 No |
| `analyst_notes` | free text | Human-written case narrative — the actual evidentiary text; parsed for pattern grounding |

Measured pattern distribution (all rows): `card_not_present_fraud` 1,404,
`account_takeover` 1,205, `card_not_present_new_device` 1,076, `out_of_region_use` 955,
`none` (cleared) 900, `card_testing` 16, `undocumented` 9. Total confirmed-fraud exposure
across all closed cases: $2,072,387.77.

---

## 4. `case_pack.csv` (20 rows, 8 columns)

The exam: 20 alerts opened November–December 2016, no ground truth provided. Confirmed
by direct read.

| Column | Type | Meaning |
|---|---|---|
| `case_id` | string, `HHG-0xx` | Benchmark case identifier |
| `opened_at` | timestamp | When the alert was opened |
| `trigger_type` | `risk_score` \| `customer_report` \| `analyst_request` | Why the case exists |
| `trigger_text` | free text | The actual trigger message |
| `flagged_txn_id` | string | The transaction that fired the alert — not necessarily where fraud started, not necessarily fraud at all |
| `card_id` | string | Card on the flagged transaction |
| `customer_id` | string | Cardholder |
| `risk_score` | float or blank | Only populated for `risk_score`-triggered cases |

Measured: 11 `risk_score` triggers, 8 `customer_report` triggers, 1 `analyst_request`
trigger (HHG-014).

---

## 5. Fields that become graph entities vs. attributes

Per the README's suggested schema, validated against what's actually observable in the
data:

**Entities (vertices):**
- `Customer` (`customer_id`)
- `Card` (`card_id`, e.g. `C01234-K1`)
- `Transaction` (`TransactionID`)
- `DeviceProfile` (composite of `DeviceInfo` + `id_30` + `id_31` + `id_33`, online only)
- `EmailDomain` (`P_emaildomain`)
- `BillingRegion` (`addr1`)
- `ClosedCase` (`case_id` from closed_cases_history.csv)
- `Case` (cases this agent opens, written back to the graph as case memory)

**Attributes (stay on vertices/edges, not modeled as separate entities):** `TransactionAmt`,
`ts`, `channel`, `risk_score`, `ProductCD`, `card4`/`card6`, `addr2`, `dist1`/`dist2`,
`C1`–`C14`, `D1`–`D15`, `M1`–`M9`, `V1`–`V339`, `id_01`–`id_11`, `id_12`–`id_38` (except
those promoted into `DeviceProfile`). These are too numerous, too weakly named, and too
transaction-specific to be graph entities — they are evidence attached to the
`Transaction` vertex and read as features, never treated as claims with asserted meaning
beyond what the README documents.

**Historical case memory:** every row of `closed_cases_history.csv` becomes a `ClosedCase`
vertex connected to its `Card` and `Transaction`(s), retrievable by shared card, shared
device profile, shared billing region, or textual/pattern similarity — this is the case
memory the README requires new investigations to search and cite in `similar_prior_cases`.

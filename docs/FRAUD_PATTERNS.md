# Fraud Patterns — HHGOA_IEEE

Five patterns are documented by the bank's analysts (README). This dataset's own closed
cases also show fraud that the analysts themselves could not fit into those five — the
README calls this out explicitly and scores an agent for finding it. This document
defines both: the five documented patterns as detection logic (not just prose), and one
additional pattern this project identified directly from `closed_cases_history.csv`.

Every rule below is designed to run as a deterministic check against graph/attribute
evidence first; the LLM's job is to synthesize and explain these signals, not invent new
ones (per the engineering principle "evidence over hallucination").

---

## 1. Card testing (`card_testing`)

**README definition:** a stolen card number is checked before use: three or more tiny
online authorizations, often under $5, then a larger purchase. Confirmed by the sequence
itself. Policy R5.

**Detection logic:**
```
window = transactions on same card_id, channel = online, sorted by ts
for each sliding window W of ≤ 1 hour:
    small_txns = [t in W where TransactionAmt < 5]
    if len(small_txns) >= 3:
        following = transactions on same card_id within next few hours after small_txns
        if any(t.TransactionAmt > small_txns average by a large multiple for t in following):
            MATCH, confidence scales with:
              + count of small authorizations beyond 3
              + tightness of the time window
              + size of the following purchase relative to the small ones
```
**Evidence fields to cite:** `graph_paths` = the ordered txn sequence on the card;
`supporting_transactions` = the small-authorization IDs + the larger purchase ID.

**Base rate in closed cases:** 16 of 5,565 closed cases (all confirmed fraud) — the
rarest of the five documented patterns in this dataset, but the most mechanically
unambiguous. Example (CC-0137): 5 transactions, July 2–5, $402.43 total, "a run of very
small online authorizations followed by a larger purchase."

**Policy link:** R5 — decline + step-up auth; block card if a >$100 purchase already
cleared.

---

## 2. Card-not-present fraud (`card_not_present_fraud`)

**README definition:** the card number used online without the card. Amounts/products
that don't fit the cardholder's history, often in a burst of two to four within 48 hours.
One unusual online purchase alone is ambiguous — verify. Policy R1–R4.

**Detection logic:**
```
history = all prior transactions for this customer/card (channel, ProductCD, amount range, merchant-adjacent features)
flagged = the transaction under review
deviation_score = how far flagged's ProductCD / TransactionAmt / channel sits from that history's distribution
burst = count of online transactions on this card within 48h of flagged, each also deviating from history
if deviation_score is high AND burst >= 2:
    MATCH, confidence increases with burst size and deviation magnitude
elif deviation_score is high AND burst == 0 (single unusual txn):
    AMBIGUOUS -> do not assert fraud on this signal alone; recommend VERIFY_WITH_CUSTOMER (R1)
```
**Base rate in closed cases:** 1,404 of 5,565 — the most common confirmed pattern.

**Policy link:** R1 (verify before blocking on a single signal), R2 (customer denies →
block + case, + report if exposure > $1,000 or shared device/region), R3 (customer
confirms → close), R4 (no reply in 24h → monitor + decline pending auths).

---

## 3. Card-not-present fraud from a new device (`card_not_present_new_device`)

**README definition:** same as #2, plus the identity record marks the device `New` for
this account (`id_15 = New`), sometimes behind a proxy. Stronger signal, still not proof
— "people buy new phones."

**Detection logic:** same as pattern 2, plus:
```
if identity.id_15 == "New" for this account's device profile:
    confidence += fixed uplift
    if identity.id_23 in {IP_PROXY:ANONYMOUS, IP_PROXY:HIDDEN}:
        confidence += further uplift (proxy is a real aggravator; "New" alone is not incriminating)
```
Never treat `id_15 = New` alone as sufficient — the README explicitly warns against this
false-positive shape (legitimate new-phone purchases). Requires the same amount/history
deviation as pattern 2 to fire.

**Base rate in closed cases:** 1,076 of 5,565.

**Policy link:** same as pattern 2 (R1–R4), with the device signal cited as an
aggravating (not sufficient) piece of evidence.

---

## 4. Out-of-region use (`out_of_region_use`)

**README definition:** card-present purchases in a billing region (`addr1`) the
cardholder has no history in, while normal activity continues at home. Several days of
purchases in one new region reads as a trip, not a clone. Policy R2, R3.

**Detection logic:**
```
home_regions = set(addr1 values seen historically for this card, channel = in_person)
flagged_region = addr1 of the flagged transaction
if flagged_region not in home_regions:
    concurrent_home_activity = any in_person/online txns in home_regions within same window
    duration_in_new_region = span of days with activity in flagged_region
    if concurrent_home_activity and duration_in_new_region is short (1-2 days, not a multi-day travel pattern):
        MATCH, higher confidence
    elif duration_in_new_region spans many consecutive days with no concurrent home activity:
        LIKELY LEGITIMATE TRAVEL -> lower confidence, recommend VERIFY_WITH_CUSTOMER per R1
```
**Base rate in closed cases:** 955 of 5,565.

**Policy link:** R2/R3 depending on customer response to verification.

---

## 5. Account takeover (`account_takeover`)

**README definition:** mixed-channel activity inconsistent with the cardholder, often
with device and match-flag (`M1`–`M9`) anomalies, pointing to stolen credentials rather
than a stolen card number.

**Detection logic:**
```
channel_mix = set of channels (in_person, online) used in the suspicious window
if channel_mix has both channels in a way inconsistent with the customer's historical channel mix,
   AND match flags (M1-M9) show anomalies (mismatches not typically seen on this account),
   AND device/identity signals also look inconsistent (new device, proxy, or both):
    MATCH — this is the pattern with the most combined signal types, and typically the
    hardest to reduce to a single rule; treat it as a synthesis of the above rather than
    one deterministic check
```
**Base rate in closed cases:** 1,205 of 5,565 — second most common.

**Policy link:** treated like R2 once confirmed (customer denial → block + case,
+ report per shared-element rules); R10 governs whether `BLOCK_ALL_CARDS` is warranted
(only when ≥2 cards show confirmed fraud or credentials are confirmed compromised).

---

## 6. Undocumented pattern found in this dataset: device-profile fraud rings

The README states plainly that some confirmed-fraud closed cases don't fit any of the
five patterns above, and that finding and describing such activity in your own words is
scored. Reading all 9 `undocumented`-pattern closed cases directly
(`data/closed_cases_history.csv`) surfaces **two distinct undocumented behaviors**, not
one:

### 6a. Shared-device ring (CC-2649, CC-2971, CC-2985, CC-3035)

Four unrelated cardholders (`C03528`, `C09998`, `C06617`, `C09733`) each reported 2–3
online purchases they didn't make. In every case the analyst notes name the **same**
device profile: a Samsung SM-G935F running Chrome for Android, behind an anonymous proxy
(`id_23 = IP_PROXY:ANONYMOUS`), a device never seen before on any of the affected
accounts (`id_15 = New` on all of them). None of the five documented patterns capture
this because the defining evidence isn't the transaction sequence or the region — it's a
single physical device configuration transacting across multiple, otherwise unconnected
customers in the same period. This is a fraud ring operating through one compromised (or
deliberately reused) device, and it can only be found by traversing
`DeviceProfile → Transaction → Card → Customer` across the whole graph, not by looking at
any one card in isolation.

**Detection logic:**
```
group all online transactions by DeviceProfile (DeviceInfo + id_30 + id_31 + id_33)
for each DeviceProfile used by >= 2 distinct customer_ids within a short window (e.g. same month):
    if id_15 == "New" for each account AND id_23 indicates a proxy:
        FLAG as a device-ring candidate for every card touched by that device profile
    cross-check against ClosedCase history: has this exact DeviceProfile appeared on a
    prior confirmed_fraud case? If so, treat every new card seen on it as high-priority.
```

### 6b. Sub-threshold structuring (CC-3748, CC-3841, CC-3907, CC-4086, CC-4124)

Five unrelated cardholders each reported four online purchases within a 40-minute
window, each individually just under $500. The analyst notes explicitly infer that "amounts
appear chosen to stay under a $500 authorization threshold" — i.e., structuring, the same
logic as card testing but with each transaction sized to *evade a specific dollar
control* rather than to be small and unnoticed. This differs from card testing (pattern
1) because the amounts are not tiny probing charges — they're near-maximal purchases
clustered just below a known limit, and from pattern 2 because the burst is unusually
tight (40 minutes, not up to 48 hours) with no size ambiguity to verify.

**Detection logic:**
```
window = transactions on same card, channel = online, within 40-60 minutes
if len(window) >= 3 and all(t.TransactionAmt for t in window are within a narrow band just below a round-number threshold, e.g. 450-499.99):
    FLAG as sub-threshold structuring (undocumented pattern)
```

**Reporting these:** per policy R9, when activity fits neither documented pattern but
shows coordinated/repeated abuse, the case output uses `pattern = "undocumented"` with a
`pattern_description` explaining which of 6a/6b (or a new variant) applies, and
recommends `CREATE_CASE`, `FILE_REPORT`, and `ESCALATE_TO_ANALYST` per R9 — never forcing
it into one of the five named categories.

---

## Detection engine output contract

Every pattern check (documented or undocumented) emits a uniform result so the risk
model and next-best-action engine can consume them identically:

```json
{
  "pattern": "card_testing",
  "matched": true,
  "confidence": 0.84,
  "evidence": ["3 authorizations under $5 within 22 minutes on card C0xxxx-K1, followed by a $259 purchase"],
  "graph_paths": ["Card -> MADE -> T1 -> NEXT -> T2 -> NEXT -> T3 -> NEXT -> T4"],
  "supporting_transactions": ["T1", "T2", "T3", "T4"]
}
```
`pattern_description` is populated only when `pattern = "undocumented"`, per the answer
format's schema.

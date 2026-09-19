# Policy Model — HHGOA_IEEE Fraud Policy, Formalized

This is a machine-readable restatement of the Fraud Policy in `data/README.md`
(Version 1.0). Every action name, approval route, and rule ID below is copied verbatim
from that policy — the engine must reproduce these identifiers exactly, since the answer
format requires them exact-match.

The policy engine is deterministic and separate from the LLM. The LLM proposes; this
engine decides what's *permitted*, who must approve it, and which rule licenses it. The
LLM may not override a policy decision.

---

## 1. Action vocabulary

| Action | Effect | Customer impact |
|---|---|---|
| `ALLOW_TRANSACTION` | Let the flagged transaction stand | None |
| `DECLINE_TRANSACTION` | Decline the flagged authorization only; card stays active | Low |
| `MONITOR_CARD` | Card active; raised monitoring for 72h | None |
| `MONITOR_CONNECTED_CARDS` | Monitor other cards linked by device profile, region cluster, or ring | None |
| `WARN_CUSTOMER` | Informational message only | None |
| `VERIFY_WITH_CUSTOMER` | Ask cardholder to confirm; card stays active pending reply | Low |
| `STEP_UP_AUTH` | Require OTP/app confirmation | Low |
| `BLOCK_CARD` | Block this card, reissue | High |
| `BLOCK_ALL_CARDS` | Block every card the customer holds | Very high |
| `GENERATE_REPORT` | Internal write-up, no case opened | None |
| `CREATE_CASE` | Open internal case, write to graph | None |
| `FILE_REPORT` | File SAR with regulator | None |
| `ESCALATE_TO_ANALYST` | Hand to human analyst with evidence | None |
| `CLOSE_NO_FRAUD` | Close alert as legitimate | None |

Multiple actions may be recommended for one case; order them by what happens first.

## 2. Approval routing

```
AUTO_ROUTE = {ALLOW_TRANSACTION, MONITOR_CARD, MONITOR_CONNECTED_CARDS, WARN_CUSTOMER,
              VERIFY_WITH_CUSTOMER, STEP_UP_AUTH, GENERATE_REPORT, CREATE_CASE,
              ESCALATE_TO_ANALYST, CLOSE_NO_FRAUD}

L1_ROUTE (team lead) = {DECLINE_TRANSACTION,
                         BLOCK_CARD if exposure_usd <= 2500}

L2_ROUTE (fraud manager) = {BLOCK_CARD if exposure_usd > 2500,
                             BLOCK_ALL_CARDS,   # always
                             FILE_REPORT}       # always
```

**Execution rule:** only `auto`-routed actions may actually be executed (simulated) by
the agent. `L1`/`L2` actions are recommended, with the route stated, and wait for a
human — the system must never claim an `L1`/`L2` action was executed.

## 3. Rules (verbatim intent, formalized as conditions → actions)

| Rule | Condition | Action(s) |
|---|---|---|
| **R1** | Single signal only (incl. risk score alone) AND `fraud_probability < 0.70` | `VERIFY_WITH_CUSTOMER` or `STEP_UP_AUTH` before any block |
| **R2** | Customer denies the transaction | `BLOCK_CARD` + `CREATE_CASE`; add `FILE_REPORT` if `exposure_usd > 1000` OR shared device profile/other card's fraud |
| **R3** | Customer confirms the transaction | `CLOSE_NO_FRAUD`, note confirmation |
| **R4** | No reply within 24h | `MONITOR_CARD` + `DECLINE_TRANSACTION` (pending auths); escalate if `exposure_usd > 500` |
| **R5** | ≥3 small online auths on one card within 1h, then a larger purchase | `DECLINE_TRANSACTION` + `STEP_UP_AUTH`; if a >$100 purchase already cleared, `BLOCK_CARD` |
| **R6** | Several cards show fraud from same device profile / billing region / recipient email in one window | Name the shared element; `CREATE_CASE` + `FILE_REPORT`; `MONITOR_CONNECTED_CARDS` for every card sharing it |
| **R7** | Customer disputes a charge matching their own recurring pattern (same merchant/amount/monthly) | `CREATE_CASE` + `VERIFY_WITH_CUSTOMER` + `WARN_CUSTOMER`. Do not block |
| **R8** | `verdict = uncertain` AND `exposure_usd > 500`, OR evidence conflicts | `ESCALATE_TO_ANALYST` |
| **R9** | Fits no known pattern but shows coordinated/repeated abuse across customers | `CREATE_CASE` + `FILE_REPORT` + `ESCALATE_TO_ANALYST`; describe pattern in own words (`pattern = undocumented`) |
| **R10** | `BLOCK_ALL_CARDS` is being considered | Only allowed if ≥2 cards show confirmed fraud OR credentials confirmed compromised |

**Implementation note:** rules are not mutually exclusive and not evaluated as an
if/elif chain — multiple rules can fire for the same case (e.g. R2 and R6 together, per
the worked example in the README: customer denial *and* a shared device profile). The
engine evaluates every rule against current case state and unions the resulting actions,
then de-duplicates and orders by "what happens first."

## 4. Case vs. report (section 3a)

- **`CREATE_CASE`** — open whenever `fraud_probability >= 0.30`, whenever evidence is
  requested, or whenever a customer disputes a charge. Always written to the graph
  (`written_to_graph = true`, with a `graph_case_id`) so future investigations can
  retrieve it as memory.
- **`FILE_REPORT`** — only when fraud is confirmed or strongly suspected **and** at least
  one holds: `exposure_usd > 1000`; connects to a shared device profile / region cluster
  / another customer's fraud; pattern is coordinated or undocumented (R9). A report
  always has a case behind it.

## 5. Next-best-action evolution (section 3b)

The engine must track two snapshots, not one:
- `initial` — computed from evidence available before any evidence request
- `final` — recomputed after simulated evidence-request responses are folded into case
  state

`what_changed` is a required, short, causal explanation (e.g. "customer denial raised
probability from 0.72 to 0.86 and confirmed the block").

## 6. Exposure

```
exposure_usd = sum(abs(TransactionAmt) for txn in affected_txn_ids)
```
Includes the flagged transaction whenever it is judged part of the fraud episode.

## 7. Evidence gathering (section 5)

Permitted without approval: `customer_validation`, `step_up_auth`, `analyst_info`
requests. Since no real responses are available in this benchmark, the engine simulates
one deterministic, evidence-consistent assumed response per request and records it in
`evidence_requests[].assumed_response` — never fabricated beyond what the surrounding
evidence supports (e.g. don't assume "customer confirms" when every other signal points
to fraud).

## 8. Stopping criteria (section 6)

Stop investigating when **any** of:
```
fraud_probability >= 0.85  AND  >= 2 independent evidence sources, OR
fraud_probability <= 0.15  AND  >= 2 independent evidence sources, OR
a verification response settles the question, OR
further steps are judged unlikely to change the decision (state why in stop_reason)
```
This is the same test used by the Uncertainty Engine's `ACT_NOW` vs.
`REQUEST_MORE_EVIDENCE` decision — see the agent implementation.

## 9. Explaining (section 7)

Every recommendation must state: which evidence was used, why more evidence was
requested (if it was), and which rule number licenses each recommended action. No
recommendation is emitted without a rule citation.

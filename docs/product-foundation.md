# Product Foundation

## Product Name

Insurtech Policy Gap Analysis

## Working Concept

An insurance gap analysis platform that evaluates policy wording, coverage structure, limits, exclusions, and endorsements to uncover protection gaps and recommend corrective actions.

## Mission

Help organizations and advisors make insurance decisions with more clarity, consistency, and risk awareness.

## Product Outcome

The system should produce a practical and defensible answer to this question:

"Given the current policy set and the insured's risk profile, what is not adequately covered and what should be changed?"

## Primary Jobs To Be Done

### 1. Analyze Existing Coverage

Parse the policy structure and identify:

- Covered perils
- Exclusions
- Coverage limits
- Sublimits
- Deductibles
- Waiting periods
- Conditions and warranties
- Endorsements

### 2. Map Exposure To Coverage

Compare business risk exposures to actual policy terms, including:

- Property exposure
- Liability exposure
- Cyber exposure
- Business interruption exposure
- Professional services exposure
- Regulatory and compliance exposure
- Operational dependency risk

### 3. Detect Gaps

Identify issues such as:

- Missing coverage
- Inadequate limits
- Restrictive exclusions
- Misaligned territorial scope
- Conflicting endorsements
- Coverage triggers that do not match the real risk
- Silent or ambiguous coverage

### 4. Recommend Actions

Output recommendations such as:

- Add missing coverage line
- Increase limits
- Reduce deductible mismatch
- Add endorsement
- Replace wording
- Clarify ambiguous clauses
- Reassess retention strategy

## First Version Scope

The first version should work as a structured decision-support instrument, not as a full autonomous underwriting system.

### Included

- Policy data model
- Risk exposure model
- Gap detection rules
- Recommendation framework
- Human-readable analysis report

### Excluded For Now

- Carrier integrations
- Quote binding
- Live rating
- Claims workflows
- Full legal document automation

## Suggested Domain Model

### Entities

- `Policy`
- `InsuredEntity`
- `CoverageLine`
- `CoverageClause`
- `Exclusion`
- `Endorsement`
- `Limit`
- `Deductible`
- `RiskExposure`
- `GapFinding`
- `Recommendation`
- `AnalysisReport`

## Example Gap Findings

- No cyber extortion coverage despite ransomware exposure.
- Business interruption coverage exists but indemnity period is too short.
- Territorial scope excludes countries where the insured operates.
- Professional liability policy excludes subcontractor work.
- Property coverage does not include equipment breakdown.

## Output Principles

Analysis output should be:

- Clear
- Auditable
- Actionable
- Explainable
- Suitable for broker or risk manager review

## Design Principles

- Domain-first before automation-first
- Explainability before complexity
- Structured rules before opaque scoring
- Human review as part of the workflow
- Modular architecture so coverage lines can be added incrementally

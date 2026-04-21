# Domain Model

## Purpose

This document defines the minimum viable domain schema for the first version of the Insurance Policy Gap Analysis engine. The model is designed to support structured policy review, exposure mapping, explainable gap detection, and recommendation generation.

## Modeling Principles

- Keep the first version explicit and auditable.
- Model insurance concepts in business language first.
- Preserve traceability from finding back to policy evidence.
- Allow rules to evaluate both missing coverage and insufficient coverage.
- Support multiple policies for the same insured account.

## Core Objects

## `InsuredEntity`

Represents the organization or legal entity whose risk is being analyzed.

### Key Fields

- `id`: Stable identifier.
- `name`: Legal or operating name.
- `industry`: Industry classification or plain-language industry.
- `regionsOfOperation`: Countries or regions where operations exist.
- `annualRevenue`: Revenue value and currency.
- `employeeCount`: Number of employees.
- `businessActivities`: Core activities that drive exposure.
- `criticalDependencies`: Vendors, systems, facilities, or processes that materially affect operations.

## `Policy`

Represents a policy or contract in force or under review.

### Key Fields

- `id`: Stable identifier.
- `policyNumber`: Carrier-issued policy reference.
- `carrierName`: Insurance carrier.
- `coverageType`: High-level line such as property, cyber, general liability, or professional liability.
- `status`: Draft, quoted, bound, expired, or under review.
- `effectiveDate`: Start date.
- `expirationDate`: End date.
- `territory`: Covered territorial scope.
- `insuredEntityId`: Reference to the insured.
- `coverageLines`: Structured coverage components within the policy.
- `endorsements`: Endorsements that extend, restrict, or clarify coverage.
- `sourceDocument`: Origin of the structured data.

## `CoverageLine`

Represents a coverage grant or insuring agreement.

### Key Fields

- `id`: Stable identifier.
- `name`: Coverage name.
- `category`: Coverage classification.
- `coveredExposures`: Exposures that this line is intended to address.
- `limits`: Policy limits and sublimits.
- `deductibles`: Retentions and deductibles.
- `clauses`: Conditions, warranties, triggers, and wording references.
- `exclusions`: Coverage carve-outs specific to this line.
- `waitingPeriods`: Delays before coverage applies.
- `status`: Included, excluded, silent, conditional, or unknown.

## `Exclusion`

Represents a clause that removes or restricts coverage.

### Key Fields

- `id`: Stable identifier.
- `title`: Exclusion name.
- `description`: Plain-language summary.
- `appliesToExposureTypes`: Exposure categories impacted.
- `severity`: Operational importance if triggered.
- `sourceReference`: Clause or page reference.

## `Endorsement`

Represents a policy amendment.

### Key Fields

- `id`: Stable identifier.
- `code`: Endorsement code when available.
- `title`: Endorsement name.
- `impactType`: Expands, restricts, clarifies, or replaces.
- `summary`: Plain-language description.
- `affectedCoverageLineIds`: Related coverage lines.
- `sourceReference`: Clause or page reference.

## `RiskExposure`

Represents an insurable exposure identified from the insured profile.

### Key Fields

- `id`: Stable identifier.
- `type`: Exposure category such as cyber, property, liability, or business interruption.
- `title`: Short label.
- `description`: Plain-language description.
- `businessDriver`: Why the exposure exists.
- `regionsImpacted`: Locations affected.
- `severity`: Low, medium, high, or critical.
- `likelihood`: Low, medium, high, or unknown.
- `recommendedCoverageTypes`: Coverage lines usually expected to respond.
- `minimumControlRequirements`: Operational controls relevant to insurability.

## `GapFinding`

Represents a detected issue between exposure and current insurance structure.

### Key Fields

- `id`: Stable identifier.
- `findingType`: Missing coverage, insufficient limit, exclusion conflict, territorial mismatch, deductible mismatch, wording ambiguity, or endorsement conflict.
- `severity`: Low, medium, high, or critical.
- `title`: Short issue summary.
- `description`: Explainable finding text.
- `exposureIds`: Exposures affected.
- `policyIds`: Policies involved in the finding.
- `evidence`: Policy references and rule outputs supporting the finding.
- `financialImpactEstimate`: Optional quantified risk signal.
- `confidence`: Confidence score for the finding.

## `Recommendation`

Represents an action proposed to reduce or remove a gap.

### Key Fields

- `id`: Stable identifier.
- `findingId`: Related gap finding.
- `actionType`: Add coverage, increase limit, amend wording, add endorsement, adjust retention, request clarification, or escalate for manual review.
- `priority`: Low, medium, high, or urgent.
- `rationale`: Why this action is recommended.
- `expectedOutcome`: Result if implemented.
- `suggestedCoverageType`: Coverage category involved.
- `implementationNotes`: Extra context for broker or risk advisor review.

## `AnalysisReport`

Represents the complete output for one account review.

### Key Fields

- `id`: Stable identifier.
- `insuredEntityId`: Reviewed insured.
- `analysisDate`: Report generation date.
- `policiesReviewed`: Policies included in scope.
- `exposuresReviewed`: Exposures considered.
- `findings`: Gap findings generated.
- `recommendations`: Actions proposed.
- `executiveSummary`: Short summary for decision-makers.
- `methodologyNotes`: Explanation of how the result was produced.

## Rule Evaluation View

The first rules engine should evaluate the following comparisons:

1. Expected exposure vs. existing coverage presence.
2. Expected geographic scope vs. insured operating territory.
3. Expected limit adequacy vs. actual policy limit.
4. Expected trigger or wording vs. restrictive clause or exclusion.
5. Expected continuity of protection vs. waiting period, deductible, or endorsement conflict.

## First Coverage Types

The initial set of coverage types should be:

- Property
- Business Interruption
- General Liability
- Professional Liability
- Cyber
- Directors and Officers

## Output Requirements

Every gap finding should be able to answer:

- What exposure is at risk?
- Which policy element caused the issue?
- Why does that matter operationally or financially?
- What action should be considered next?

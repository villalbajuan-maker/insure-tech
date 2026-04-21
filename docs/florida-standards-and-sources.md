# Florida Standards And Sources

## Purpose

This document defines the initial standards-source strategy for Florida homeowners insurance gap analysis. The goal is to ensure that the rules engine is grounded in authoritative materials and that every finding can be traced back to a source category.

## Important Boundary

This standards library supports decision assistance. It does not replace legal advice, policy interpretation by licensed counsel, or direct carrier confirmation of coverage.

## Standards Layers

### 1. Statutory And Regulatory Sources

These sources define mandatory or formally recognized coverage concepts and disclosure-related expectations.

Initial sources:

- Florida Statutes
- Florida Office of Insurance Regulation guidance and approved forms processes
- Florida Department of Financial Services consumer guidance

### 2. Program Sources

These sources define separate but relevant companion coverage frameworks.

Initial sources:

- FEMA and NFIP materials for flood coverage

### 3. Best-Practice Sources

These sources inform non-mandatory but prudent recommendations.

Initial sources:

- Internal rule authoring by licensed insurance domain experts
- Future broker or advisor review panels

## First MVP Standards Themes

The MVP should tag findings under one of these themes:

- Statutory expectation
- Florida market practice
- Companion coverage recommendation
- Risk-management best practice
- Ambiguous wording that requires manual review

## Source-Backed Rule Candidates

### Ordinance-Or-Law Coverage

Florida Statute 627.7011 says homeowners insurers must offer replacement cost coverage and law-and-ordinance coverage options, including a default deemed inclusion of 25% law-and-ordinance coverage unless properly refused, with 50% also offered.

Implication for the engine:

- Inspect whether ordinance-or-law coverage is present.
- Flag absence or ambiguous treatment.
- Flag low ordinance-or-law limits as a potential issue.

### Windstorm Coverage

The Florida homeowners insurance toolkit says virtually all homeowners policies are required to cover damage caused by windstorms, hurricanes, and hail unless the insured signs a dated statement requesting exclusion, and warns that separate wind coverage may be needed in the Wind-Pool Area.

Implication for the engine:

- Detect whether windstorm coverage is included or excluded.
- Detect whether a separate wind-only policy may be required.
- Flag when the policy wording suggests a homeowner may mistakenly think wind is included.

### Flood Coverage

The Florida homeowners insurance toolkit says most homeowners policies exclude flood damage and notes that flood insurance is available through NFIP or private insurers. FEMA also states that most homeowners insurance does not cover flood damage and that flood insurance is typically separate.

Implication for the engine:

- Detect flood exclusion language.
- Flag missing companion flood coverage as a recommendation, not as a statutory failure.
- Consider timing and waiting-period messaging when flood coverage is absent.

### Sinkhole And Catastrophic Ground Cover Collapse

Florida Statute 627.706 says every authorized property insurer must provide catastrophic ground cover collapse coverage and must make sinkhole loss coverage available for additional premium.

Implication for the engine:

- Detect whether the policy includes only catastrophic ground cover collapse coverage.
- Distinguish that from broader sinkhole loss coverage.
- Explain the gap in plain English without overstating what the law requires.

### Replacement Cost Versus Actual Cash Value

Florida Statute 627.7011 and the Florida homeowners toolkit both make replacement cost treatment material to homeowners policy understanding.

Implication for the engine:

- Detect whether coverage is replacement cost or actual cash value.
- Flag mismatches between expected rebuilding protection and actual loss settlement basis.

## Standards Registry Design

Each rule in the system should carry:

- `ruleId`
- `jurisdiction`
- `productLine`
- `theme`
- `sourceType`
- `sourceCitation`
- `sourceUrl`
- `effectiveDate`
- `status`
- `ruleLogicSummary`
- `userFacingExplanation`
- `severityGuidance`

## Rule Authoring Guidance

- Keep statutory rules conservative and literal.
- Keep recommendation rules clearly labeled as best practice.
- Never imply a coverage guarantee from incomplete evidence.
- When source evidence is weak, downgrade confidence and require manual-review language.

## MVP Source Inventory

The following source set is sufficient to begin MVP rule authoring:

- Florida Statute 627.7011
- Florida Statute 627.706
- Florida Department of Financial Services Homeowners Insurance Toolkit
- FEMA NFIP flood guidance

## Initial Reference URLs

- Florida Statute 627.7011:
  https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0600-0699%2F0627%2FSections%2F0627.7011.html
- Florida Statute 627.706:
  https://www.leg.state.fl.us/Statutes/index.cfm/Ch0465/index.cfm?App_mode=Display_Statute&Search_String=&URL=0600-0699%2F0627%2FSections%2F0627.706.html
- Florida DFS Homeowners Insurance Toolkit:
  https://myfloridacfo.com/docs-sf/consumer-services-libraries/consumerservices-documents/understanding-coverage/consumer-guides/english---homeowners-insurance-toolkit.pdf
- FEMA Flood Insurance:
  https://www.fema.gov/flood-insurance

## Maintenance Plan

- Version every rule.
- Store effective dates.
- Review source changes at least quarterly.
- Re-run regression tests when the standards library changes.

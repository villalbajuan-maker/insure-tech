# Florida Homeowners Gap Analysis PRD

## Product Summary

This product is a paid self-service insurance policy review tool for Florida homeowners and property managers. A user uploads one or more policy documents, the system analyzes the coverage against a Florida-focused standards library, and the user receives a structured gap analysis report.

## Working Offer

- Product: Florida Homeowners Insurance Gap Analysis
- Price: $49 per analysis
- Delivery: Web-based upload and report experience
- Primary output: Human-readable report with structured gap findings and recommendations

## Primary User Segments

### Homeowner

The homeowner wants to know whether their current insurance leaves them exposed before renewal, storm season, closing, or a claim event.

### Property Manager

The property manager wants a repeatable and fast way to screen policies across multiple homes or small portfolios and identify missing or weak protection.

## Problem

Most policyholders do not understand the practical implications of exclusions, deductibles, endorsements, sublimits, territorial restrictions, waiting periods, or missing companion policies. In Florida, this problem is amplified by hurricane, flood, ordinance-or-law, and sinkhole-related considerations.

## Product Goal

Allow a non-expert user to upload their policy package and receive a clear answer to:

"What important protections are missing, weak, excluded, or misaligned with my Florida residential property risk?"

## Core User Journey

1. User arrives on the landing page.
2. User sees the offer, scope, and disclaimer.
3. User uploads policy documents and answers a short property profile questionnaire.
4. User pays $49.
5. System ingests the files, extracts policy content, normalizes it, and runs gap analysis.
6. System generates a report with findings, severity, rationale, and suggested next actions.
7. User views the report in the app and can download a formatted PDF.

## Inputs

### Required

- One or more insurance policy documents, usually PDF.
- Property state: Florida.
- Property type.
- Occupancy profile.
- Address or ZIP code.

### Recommended

- Declarations page.
- Full policy wording.
- Endorsements.
- Flood policy, if any.
- Wind-only policy, if separate.
- Inspection or mitigation information, if available.

## Output

The first version should produce:

- Executive summary
- Coverage inventory
- Gap findings
- Confidence and evidence references
- Suggested actions to discuss with an agent, broker, or advisor
- Plain-language disclaimer that the tool is decision support, not legal advice or coverage confirmation

## First-MVP Gap Categories

- Missing flood coverage
- Missing or reduced windstorm coverage
- Missing or inadequate ordinance-or-law coverage
- Missing sinkhole coverage where relevant, or presence of only catastrophic ground cover collapse coverage
- High deductible mismatch
- Replacement cost vs. actual cash value mismatch
- Material exclusions or endorsements that reduce expected protection
- Missing companion policy when the main homeowners policy does not respond

## Florida Design Assumptions

The first version should explicitly model the following Florida-specific concerns:

- Windstorm and hurricane treatment
- Flood exclusion and separate flood coverage
- Ordinance-or-law coverage
- Sinkhole and catastrophic ground cover collapse distinctions
- Deductible presentation and impact

## Product Boundaries

### Included In MVP

- Florida residential property use case
- Homeowners and related residential property policy review
- PDF upload
- AI-assisted document extraction
- Rule-based gap classification
- In-app report plus downloadable report
- Stripe checkout for a flat $49 fee

### Excluded From MVP

- Binding coverage
- Carrier integration
- Policy issuance
- Claims handling
- Real-time legal advice
- Fully automated legal interpretation without human caveats

## Report Design Principles

- Explain what was found in plain English.
- Cite the policy section or evidence when possible.
- Distinguish clearly between confirmed findings and inferred risk signals.
- Avoid overstating certainty when source wording is incomplete or ambiguous.
- Separate regulatory standards from best-practice recommendations.

## Success Criteria

- User can upload a policy package in under 5 minutes.
- Report is delivered within a reasonable asynchronous processing window.
- Findings are understandable to non-experts.
- The system can justify each material finding with source evidence.
- Unit economics support a $49 price point.

## Key Risks

- Low-quality scans may reduce extraction accuracy.
- Policy wording may be incomplete if the user only uploads declarations pages.
- Florida insurance rules can change and require a maintained standards library.
- The report must not imply legal advice or guaranteed coverage interpretation.

## MVP Recommendation

The best first release is a Florida-only homeowner and property-manager policy review workflow with an opinionated standards library and conservative output language. That is narrow enough to build well and strong enough to validate willingness to pay at $49.

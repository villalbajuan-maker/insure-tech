# Insurtech Policy Gap Analysis

This repository defines the foundation for an insurance policy gap analysis product focused on identifying coverage weaknesses, policy inconsistencies, and unmanaged risks.

## Vision

Build an intelligent analysis instrument that can review insurance policies, compare them against expected risk exposures, detect gaps in coverage, and recommend actions that reduce operational and financial risk.

## Problem Statement

Insurance buyers often hold policies that appear complete on paper but still leave critical risks uninsured, underinsured, excluded, or misaligned with the insured's actual exposure profile. Manual review is slow, inconsistent, and difficult to scale across multiple policies, endorsements, and renewal cycles.

## Initial Product Goal

Create a structured gap analysis engine that can:

1. Ingest policy information and coverage details.
2. Normalize policy language into analyzable coverage components.
3. Compare current coverage against expected risk requirements.
4. Detect coverage gaps, exclusions, conflicts, and insufficiencies.
5. Generate clear recommendations to mitigate uncovered risk.

## Core Use Cases

- Review a single policy for missing or insufficient coverage.
- Compare multiple policies to identify overlapping or missing protection.
- Detect exclusions that materially affect risk transfer.
- Flag policy limits, deductibles, waiting periods, and endorsements that create exposure.
- Produce a structured report with actionable recommendations.

## Target Users

- Insurance brokers
- Risk advisors
- Underwriters
- Corporate risk managers
- Compliance and internal audit teams

## Initial Scope

The first phase will focus on a repeatable analysis workflow rather than carrier-specific automation. The priority is to create a robust domain model for policy review, gap detection, and recommendation generation.

See [docs/product-foundation.md](/Users/juanvillalba/Documents/insure-tech/docs/product-foundation.md) for the first product definition and [docs/roadmap.md](/Users/juanvillalba/Documents/insure-tech/docs/roadmap.md) for phased delivery planning.

## Current Artifacts

- [docs/domain-model.md](/Users/juanvillalba/Documents/insure-tech/docs/domain-model.md) defines the first domain schema.
- [src/domain/policy-gap-analysis.types.ts](/Users/juanvillalba/Documents/insure-tech/src/domain/policy-gap-analysis.types.ts) provides starter TypeScript types for implementation.
- [examples/sample-manufacturing-account.json](/Users/juanvillalba/Documents/insure-tech/examples/sample-manufacturing-account.json) contains a realistic sample account and expected gap signals.
- [docs/florida-homeowners-gap-analysis-prd.md](/Users/juanvillalba/Documents/insure-tech/docs/florida-homeowners-gap-analysis-prd.md) defines the Florida-focused MVP and $49 offer.
- [docs/technical-architecture.md](/Users/juanvillalba/Documents/insure-tech/docs/technical-architecture.md) describes the recommended OCR, OpenAI, backend, frontend, and billing architecture.
- [docs/florida-standards-and-sources.md](/Users/juanvillalba/Documents/insure-tech/docs/florida-standards-and-sources.md) defines the initial source-of-truth strategy for Florida rules.

## Application Prototype

This repository now includes a Next.js MVP skeleton for the Florida homeowner gap-analysis workflow.

### Included

- Intake landing page and upload form
- Prototype Stripe checkout flow with demo fallback
- In-memory analysis request store
- Florida standards registry
- Deterministic rules engine for first Florida gap categories
- Report page with findings, recommendations, and methodology notes

### Key Paths

- [app/page.tsx](/Users/juanvillalba/Documents/insure-tech/app/page.tsx)
- [app/analyses/[id]/page.tsx](/Users/juanvillalba/Documents/insure-tech/app/analyses/[id]/page.tsx)
- [app/api/analyses/route.ts](/Users/juanvillalba/Documents/insure-tech/app/api/analyses/route.ts)
- [src/lib/standards/florida-standards-registry.ts](/Users/juanvillalba/Documents/insure-tech/src/lib/standards/florida-standards-registry.ts)
- [src/lib/analysis/florida-rules-engine.ts](/Users/juanvillalba/Documents/insure-tech/src/lib/analysis/florida-rules-engine.ts)

### Setup

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env.local`
3. Run `npm run dev`

If Stripe or OpenAI keys are missing, the prototype still works with demo-safe fallbacks for checkout and mock extraction.

# Technical Architecture

## Objective

Design a production-oriented MVP that accepts residential insurance policy files, extracts relevant coverage information, performs Florida-focused gap analysis, generates a report, and charges $49 per completed analysis.

## Recommended Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Server Actions or route handlers for upload and job initiation

### Backend

- Next.js backend for MVP orchestration
- PostgreSQL for primary relational storage
- Object storage for uploaded files and generated reports
- Background job processing for extraction and analysis

### Payments

- Stripe Checkout for the $49 one-time payment

### AI and Document Analysis

- OpenAI Responses API for document understanding and analysis
- Structured Outputs for deterministic extraction payloads
- PDF file inputs for direct policy ingestion
- Prompt caching for repeated extraction and analysis instructions

### OCR and Preprocessing

- Direct PDF ingestion through OpenAI for MVP
- Supplemental OCR fallback for poor scans, image cleanup, or rotated pages
- Recommended fallback options: `ocrmypdf` plus `tesseract`

## Why This Shape Fits The MVP

- One codebase reduces early complexity.
- Asynchronous jobs prevent upload timeouts on large policy files.
- Structured extraction reduces brittle string parsing.
- A rules layer keeps the product explainable and auditable.
- Stripe keeps monetization simple from day one.

## System Flow

1. User uploads files and submits a short intake form.
2. System creates an `analysis_request`.
3. User completes Stripe payment.
4. Files are stored and queued for processing.
5. Document pipeline extracts structured policy data.
6. Gap engine compares normalized policy data against the Florida standards library.
7. Report generator produces JSON plus formatted HTML and PDF outputs.
8. User receives an in-app result page and optional email notification.

## Core Services

### 1. Intake Service

Responsibilities:

- Accept file uploads
- Validate file type and size
- Capture property profile questionnaire
- Create analysis job record

### 2. Document Processing Service

Responsibilities:

- Classify uploaded files
- Run OCR fallback when needed
- Chunk and route policy content for extraction
- Preserve page-level evidence references

### 3. Policy Extraction Service

Responsibilities:

- Extract declarations, deductibles, limits, coverage grants, exclusions, endorsements, and special forms
- Normalize results into the domain model
- Return confidence metadata and missing-data flags

Recommended approach:

- Use OpenAI file inputs for PDFs.
- Use a structured schema per extraction stage.
- Split extraction into passes:
  - document classification
  - declarations extraction
  - endorsements and exclusions extraction
  - gap-relevant summary extraction

### 4. Gap Analysis Engine

Responsibilities:

- Compare policy structure against the Florida standards library
- Score and classify findings
- Generate actionable recommendations
- Separate statutory findings from best-practice findings

This layer should be mostly deterministic and rule-based. Model output should inform normalization and ambiguity handling, not replace the actual rules engine.

### 5. Report Generation Service

Responsibilities:

- Create structured report JSON
- Render user-facing HTML
- Export printable PDF
- Record evidence references for each finding

### 6. Billing and Access Control

Responsibilities:

- Confirm successful payment
- Unlock report generation or delivery
- Prevent unpaid access to the finished analysis

## Recommended OpenAI Usage

## API Surface

Use the Responses API as the default integration layer because it is the current general-purpose API surface for multimodal structured workflows.

## Model Strategy

Recommended production split:

- `gpt-5.4-mini` for document extraction and normalization passes
- `gpt-5.4` for final synthesis, ambiguity resolution, and report narrative

Reasoning:

- OpenAI’s current model guidance says to start with `gpt-5.4` when unsure and to use `gpt-5.4-mini` for lower latency and cost.
- OpenAI’s file-input guide says PDF parsing with extracted text plus page images requires vision-capable models such as `gpt-4o` and later models.
- Inference: `gpt-5.4` and `gpt-5.4-mini` are appropriate for this workflow because the current models page says the latest models support text and image input, while the file-input guide references `gpt-4o` as the floor rather than the ceiling.

## Prompting Strategy

- Keep the extraction prompt stable and reusable.
- Put static standards and extraction instructions first to benefit from prompt caching.
- Use Structured Outputs for every extraction step that feeds the rules engine.
- Use free-text generation only for the final user report narrative.

## Cost Controls

- Use `gpt-5.4-mini` for high-volume extraction passes.
- Reserve `gpt-5.4` for one final synthesis pass.
- Use prompt caching aggressively by keeping prefixes stable.
- Consider Batch processing for non-urgent or overnight queues.

## Data Model Additions

Add these new entities beyond the current domain model:

- `AnalysisRequest`
- `UploadedDocument`
- `DocumentPage`
- `ExtractionRun`
- `ExtractionArtifact`
- `StandardsRule`
- `RuleEvaluation`
- `PaymentRecord`
- `GeneratedReportArtifact`

## Suggested Database Tables

- `users`
- `properties`
- `analysis_requests`
- `uploaded_documents`
- `document_pages`
- `extraction_runs`
- `normalized_policies`
- `risk_profiles`
- `gap_findings`
- `recommendations`
- `reports`
- `payments`
- `standards_rules`
- `rule_versions`

## Trust and Safety Requirements

- Encrypt uploaded files at rest.
- Use signed URLs for document access.
- Keep raw uploads and extracted artifacts separate.
- Record rule version and prompt version used for each report.
- Add an explicit disclaimer that the product is not a law firm and not an insurer.
- Require user acknowledgment before checkout and again on the report page.

## MVP Processing Mode

The first version should be asynchronous:

- User uploads and pays
- Analysis runs in background
- User sees processing state
- User receives result when complete

This is safer than trying to guarantee an immediate synchronous response for long policy packages.

## Future Expansion

- Multi-property portfolio analysis
- Human reviewer escalation workflow
- Carrier-specific pattern libraries
- Inspection integration
- Renewal comparison reports
- Broker white-label portal

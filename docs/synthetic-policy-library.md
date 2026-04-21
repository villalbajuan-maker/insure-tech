# Synthetic Policy Library

## Purpose

This library provides high-quality synthetic Florida residential policy scenarios for demos, regression analysis, extraction benchmarking, and rules-engine development.

## Design Goals

- Resemble plausible west-coast Florida homeowner policy structures.
- Stay fully synthetic with no real policyholder personal data.
- Cover coastal, inland, vacancy, seasonal, and sinkhole-sensitive scenarios.
- Include enough declarations realism to exercise deductible, ordinance-or-law, flood, wind, replacement-cost, and sinkhole logic.

## Geographic Corridor

The scenarios focus on west-coast Florida counties and adjacent markets such as:

- Hernando
- Hillsborough
- Sarasota
- Lee
- Collier

## What Each Scenario Contains

- Property profile
- Declarations-level coverages and deductibles
- Optional coverages
- Endorsement list
- Plain-language policy notes
- A normalized analysis snapshot for the current rules engine
- Expected findings baseline

## Why Synthetic Instead Of Real Policies

- No privacy exposure from real insured data
- No consent-management burden for early product work
- Easier to version, share, and regression-test
- Safer for demos, product reviews, and prompt iteration

## Current Files

- Master library:
  [data/synthetic/florida-west-coast/library.json](/Users/juanvillalba/Documents/insure-tech/data/synthetic/florida-west-coast/library.json)
- Generator:
  [scripts/build_synthetic_library.py](/Users/juanvillalba/Documents/insure-tech/scripts/build_synthetic_library.py)
- Browser view:
  [app/synthetic-library/page.tsx](/Users/juanvillalba/Documents/insure-tech/app/synthetic-library/page.tsx)

## Usage

1. Edit the master library JSON when you want to add or refine scenarios.
2. Run `python3 scripts/build_synthetic_library.py` to generate per-scenario packets.
3. Open `/synthetic-library` in the local app to review how the current rules engine interprets the cases.

## Next Improvements

- Add synthetic full-form policy wording sections, not just declarations realism.
- Create OCR-noisy variants to test extraction robustness.
- Add paired flood and wind companion-policy documents.
- Build golden regression assertions that compare actual vs. expected findings automatically.

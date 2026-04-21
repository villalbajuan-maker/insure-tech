import path from "node:path";
import type {
  FloridaPolicySnapshot,
  IntakeFormData
} from "@/src/domain/florida-homeowners.types";
import type { SourceReference } from "@/src/domain/policy-gap-analysis.types";
import type { ExtractedPdfDocument } from "@/src/lib/extraction/pdf-text-extractor";

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function findSnippet(text: string, pattern: RegExp): string | undefined {
  const match = text.match(pattern);
  if (!match || !match.index) {
    if (match?.index === 0) {
      return normalizeWhitespace(text.slice(0, 220));
    }
    return undefined;
  }

  const start = Math.max(0, match.index - 80);
  const end = Math.min(text.length, match.index + 160);
  return normalizeWhitespace(text.slice(start, end));
}

function extractPercent(text: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const raw = match?.[1];
    if (raw) {
      return Number(raw);
    }
  }
  return undefined;
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function buildEvidence(documentName: string, snippet: string | undefined): SourceReference | null {
  if (!snippet) {
    return null;
  }

  return {
    documentName,
    excerpt: snippet
  };
}

export function normalizeFloridaPolicySnapshot(params: {
  intake: IntakeFormData;
  documents: ExtractedPdfDocument[];
}): FloridaPolicySnapshot {
  const joinedText = params.documents
    .map((document) => document.text)
    .join("\n\n")
    .toLowerCase();

  const homeownersForms = /(ho-3|ho3|ho-8|ho8|dp-3|dp3|homeowners|dwelling property)/i;
  const windExclusionPattern = /(windstorm or hail exclusion|windstorm exclusion|wind-only policy required|wind damage excluded)/i;
  const windIncludedPattern = /(windstorm coverage|hurricane deductible|wind and hail coverage|covers windstorm)/i;
  const floodPolicyPattern = /(separate nfip flood policy referenced|flood coverage included|separate flood policy referenced|flood insurance policy number|national flood insurance program policy)/i;
  const noFloodPolicyPattern = /(no separate flood policy|flood insurance not scheduled|flood coverage not included|flood not included)/i;
  const noSeparateWindPolicyPattern = /(no separate wind-only policy|no separate wind policy|wind-only policy listed\.\s*-\s*no)/i;
  const actualCashValuePattern = /(actual cash value|acv)/i;
  const replacementCostPattern = /(replacement cost)/i;
  const sinkholeIncludedPattern = /(sinkhole loss endorsement|sinkhole: included|sinkhole coverage elected|sinkhole included)/i;
  const cgccPattern = /(catastrophic ground cover collapse|sinkhole: not included|sinkhole status: not included|sinkhole not included)/i;

  const hasHomeownersPolicy = homeownersForms.test(joinedText) || params.documents.length > 0;
  const hasSeparateWindPolicy = hasAny(joinedText, [
    /(separate wind coverage package referenced)/i,
    /(wind-only policy)/i,
    /(hw-2|hw2)/i
  ]) && !noSeparateWindPolicyPattern.test(joinedText);
  const excludesWindstorm = windExclusionPattern.test(joinedText);
  const coversWindstorm =
    hasSeparateWindPolicy ||
    (!excludesWindstorm && (windIncludedPattern.test(joinedText) || hasHomeownersPolicy));

  const hasFloodPolicy =
    floodPolicyPattern.test(joinedText) && !noFloodPolicyPattern.test(joinedText);
  const excludesFlood =
    hasHomeownersPolicy && !hasFloodPolicy;

  const ordinanceOrLawLimitPercent = extractPercent(joinedText, [
    /ordinance(?:\s+or|\s*[-/]\s*| and )law[\s\S]{0,40}?(\d+)%/i,
    /ordinance(?:\s+or|\s*[-/]\s*| and )law(?:\s*\(as a percentage of coverage a\))?[\s\S]{0,40}?(\d+)%/i,
    /(\d+)%\s+of\s+coverage\s+a/i
  ]);

  const hurricaneDeductiblePercent = extractPercent(joinedText, [
    /hurricane(?: deductible)?[:\s]+(\d+)%/i
  ]);

  const allOtherPerilDeductiblePercent = extractPercent(joinedText, [
    /all other perils[^%\n]{0,40}(\d+)%/i
  ]);

  const includesReplacementCost = replacementCostPattern.test(joinedText);
  const actualCashValueApplies = actualCashValuePattern.test(joinedText);
  const includesSinkholeCoverage = sinkholeIncludedPattern.test(joinedText);
  const includesCatastrophicGroundCoverCollapseOnly =
    !includesSinkholeCoverage &&
    (cgccPattern.test(joinedText) || /sinkhole/i.test(joinedText));

  const evidence: SourceReference[] = params.documents
    .flatMap((document) => {
      const documentName = path.basename(document.path);
      return [
        buildEvidence(
          documentName,
          findSnippet(document.text, /ordinance(?:\s+or|\s*[-/]\s*| and )law/i)
        ),
        buildEvidence(documentName, findSnippet(document.text, /hurricane/i)),
        buildEvidence(documentName, findSnippet(document.text, /flood/i)),
        buildEvidence(documentName, findSnippet(document.text, /actual cash value|replacement cost/i)),
        buildEvidence(documentName, findSnippet(document.text, /sinkhole|catastrophic ground cover collapse/i)),
        buildEvidence(documentName, findSnippet(document.text, /windstorm|wind-only|wind and hail/i))
      ].filter(Boolean) as SourceReference[];
    })
    .slice(0, 10);

  return {
    hasHomeownersPolicy,
    hasFloodPolicy,
    hasSeparateWindPolicy,
    coversWindstorm,
    excludesWindstorm,
    excludesFlood,
    hasOrdinanceOrLawCoverage:
      typeof ordinanceOrLawLimitPercent === "number" ||
      /ordinance(?:\s+or|\s*[-/]\s*| and )law/i.test(joinedText),
    ordinanceOrLawLimitPercent,
    includesReplacementCost,
    actualCashValueApplies,
    includesSinkholeCoverage,
    includesCatastrophicGroundCoverCollapseOnly,
    allOtherPerilDeductiblePercent,
    hurricaneDeductiblePercent,
    evidence: evidence.length
      ? evidence
      : [
          {
            documentName: "Uploaded policy package",
            excerpt:
              "Coverage snapshot inferred from uploaded PDF text. Manual review is recommended for ambiguous wording."
          }
        ]
  };
}

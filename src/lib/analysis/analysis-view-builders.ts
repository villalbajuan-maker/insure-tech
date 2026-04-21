import type {
  AnalysisRequest,
  FullAnalysisView,
  ReportSummaryCard,
  SnapshotAnalysisView,
  SnapshotFindingView,
  SnapshotScenarioView
} from "@/src/domain/florida-homeowners.types";
import type {
  GapFinding,
  ScenarioExposureEstimate
} from "@/src/domain/policy-gap-analysis.types";
import { buildSummaryCards } from "@/src/lib/analysis/florida-rules-engine";
import { extractAddressFromText } from "@/src/lib/analysis/analysis-experience";

const severityRank: Record<GapFinding["severity"], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

function sortFindings(findings: GapFinding[]): GapFinding[] {
  return [...findings].sort((a, b) => {
    const severityDelta = severityRank[b.severity] - severityRank[a.severity];
    if (severityDelta !== 0) {
      return severityDelta;
    }

    const impactA = a.financialImpactEstimate?.amount ?? 0;
    const impactB = b.financialImpactEstimate?.amount ?? 0;
    return impactB - impactA;
  });
}

function getHighestImpactScenario(
  scenarios: ScenarioExposureEstimate[]
): SnapshotScenarioView | null {
  if (!scenarios.length) {
    return null;
  }

  const scenario = [...scenarios].sort(
    (a, b) => b.estimatedImpact.amount - a.estimatedImpact.amount
  )[0];

  return {
    id: scenario.id,
    label: scenario.label,
    basis: scenario.basis,
    estimatedImpact: scenario.estimatedImpact
  };
}

function getTopFindings(findings: GapFinding[]): SnapshotFindingView[] {
  return sortFindings(findings).slice(0, 2).map((finding) => ({
    id: finding.id,
    severity: finding.severity,
    title: finding.title,
    description: finding.description
  }));
}

function deriveAddress(request: AnalysisRequest): string | null {
  const combinedText = request.uploadedDocuments
    .map((document) => document.extractedText ?? "")
    .join("\n\n");

  return extractAddressFromText(combinedText);
}

export function buildSnapshotView(
  request: AnalysisRequest
): SnapshotAnalysisView | null {
  const report = request.report;
  if (!report) {
    return null;
  }

  return {
    kind: "snapshot",
    analysisId: request.id,
    status: request.status,
    totalExposureEstimate: report.totalExposureEstimate,
    highestImpactScenario: getHighestImpactScenario(report.scenarioExposures),
    topFindings: getTopFindings(report.findings),
    derivedAddress: deriveAddress(request),
    incompleteNotice:
      "This estimate is incomplete and does not yet include property-specific factors."
  };
}

export function buildFullView(request: AnalysisRequest): FullAnalysisView | null {
  const report = request.report;
  if (!report) {
    return null;
  }

  const summaryCards: ReportSummaryCard[] = buildSummaryCards(report);

  return {
    kind: "full",
    request,
    summaryCards
  };
}

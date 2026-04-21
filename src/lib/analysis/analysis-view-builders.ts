import type {
  AnalysisRequest,
  ComprehensiveAnalysisView,
  ExecutionAnalysisView,
  ExecutionInspectionOffer,
  PropertyGateView,
  ReportSummaryCard,
  StarterAnalysisView,
  StarterFindingView,
  StarterScenarioView
} from "@/src/domain/florida-homeowners.types";
import type {
  GapFinding,
  ScenarioExposureEstimate
} from "@/src/domain/policy-gap-analysis.types";
import { buildSummaryCards } from "@/src/lib/analysis/florida-rules-engine";
import {
  computeLocationFactor,
  extractAddressFromText
} from "@/src/lib/analysis/analysis-experience";
import { buildComprehensiveSynthesis } from "@/src/lib/analysis/comprehensive-synthesis";

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

function toStarterScenario(
  scenarios: ScenarioExposureEstimate[]
): StarterScenarioView | null {
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

function toStarterFindings(findings: GapFinding[]): StarterFindingView[] {
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

function computeDisplayExposure(request: AnalysisRequest) {
  const baseExposure = request.report?.totalExposureEstimate;
  if (!baseExposure) {
    return undefined;
  }

  const address = request.propertyDetails?.address;
  if (!address) {
    return baseExposure;
  }

  return {
    amount: Math.round(baseExposure.amount * computeLocationFactor(address)),
    currency: baseExposure.currency
  };
}

export function buildStarterView(
  request: AnalysisRequest
): StarterAnalysisView | null {
  const report = request.report;
  if (!report) {
    return null;
  }

  return {
    kind: "starter",
    analysisId: request.id,
    status: request.status,
    waivedOfferLabel: "Normally $49. Waived for selected properties for a limited time.",
    totalExposureEstimate: report.totalExposureEstimate,
    primaryScenario: toStarterScenario(report.scenarioExposures),
    topFindings: toStarterFindings(report.findings),
    meaningSummary:
      "Based on your uploaded policy documents, we found an initial exposure signal that may leave your property financially vulnerable in at least one meaningful loss scenario.",
    incompleteNotice:
      "This preview does not yet include property-specific factors such as location, home characteristics, replacement assumptions, and a deeper financial breakdown.",
    prefilledAddress: deriveAddress(request),
    nextStepLabel: "Continue to full property analysis"
  };
}

export function buildPropertyGateView(
  request: AnalysisRequest
): PropertyGateView | null {
  const report = request.report;
  if (!report) {
    return null;
  }

  return {
    kind: "property_gate",
    analysisId: request.id,
    starterExposure: report.totalExposureEstimate,
    starterPrimaryScenario: toStarterScenario(report.scenarioExposures),
    prefilledAddress: deriveAddress(request),
    propertyDetails: request.propertyDetails ?? null,
    unlockValueBullets: [
      "A fuller economic exposure estimate",
      "A broader scenario breakdown",
      "Property-specific risk interpretation",
      "Recommended next actions to reduce exposure"
    ],
    price: 99,
    ctaLabel: "Unlock full analysis for $99"
  };
}

export function buildComprehensiveView(
  request: AnalysisRequest
): ComprehensiveAnalysisView | null {
  const report = request.report;
  if (!report) {
    return null;
  }

  const summaryCards: ReportSummaryCard[] = buildSummaryCards(report);

  return {
    kind: "comprehensive",
    request,
    summaryCards,
    displayExposure: computeDisplayExposure(request),
    synthesis: buildComprehensiveSynthesis(request)
  };
}

export function buildExecutionView(
  request: AnalysisRequest
): ExecutionAnalysisView | null {
  const comprehensive = buildComprehensiveView(request);
  if (!comprehensive) {
    return null;
  }

  const inspectionOffer: ExecutionInspectionOffer = {
    headline: "Schedule a property inspection",
    body:
      "An inspection helps verify current property conditions, reduce uncertainty in the analysis, identify preventable issues, and support stronger alignment between your home and your coverage.",
    includedItems: [
      "On-site property review",
      "Roof and exterior condition validation",
      "Identification of visible preventable risk factors",
      "Documentation support for pre-claim condition",
      "Guidance for the next policy and mitigation decisions"
    ],
    priceRangeLabel: "Inspection pricing typically ranges from $199 to $399 depending on property scope.",
    ctaLabel: "Schedule inspection"
  };

  return {
    kind: "execution",
    analysisId: request.id,
    actionSummary: comprehensive.synthesis.actionSummary,
    verificationItems: comprehensive.synthesis.verificationItems,
    policySideActions: comprehensive.synthesis.policySideActions,
    propertySideActions: comprehensive.synthesis.propertySideActions,
    inspectionOffer,
    postInspectionPath: comprehensive.synthesis.postInspectionPath
  };
}

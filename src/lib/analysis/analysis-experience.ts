import type {
  GapFinding,
  ScenarioExposureEstimate
} from "@/src/domain/policy-gap-analysis.types";
import type { CompletedAnalysisView } from "@/src/domain/florida-homeowners.types";

export type AnalysisViewMode = "snapshot" | "refine" | "full";
export type AnalysisRefineStage = "entry" | "recalc";

export interface AnalysisSessionState {
  address: string | null;
  addressSource: "pdf" | "user" | null;
  refinementApplied: boolean;
  baseExposure: number;
  refinedExposure: number | null;
}

const severityRank: Record<GapFinding["severity"], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

export function extractAddressFromText(text: string): string | null {
  const addressPattern =
    /\b\d{1,6}\s+[A-Za-z0-9.'#/\-\s]+,\s*[A-Za-z.'\-\s]+,\s*FL\s+\d{5}(?:-\d{4})?\b/i;
  const match = text.match(addressPattern);
  return match?.[0]?.replace(/\s+/g, " ").trim() ?? null;
}

export function computeLocationFactor(address: string): number {
  const normalized = address.toLowerCase();

  if (
    normalized.includes("panama city") ||
    normalized.includes("miami") ||
    normalized.includes("tampa") ||
    normalized.includes("naples") ||
    normalized.includes("fort myers")
  ) {
    return 1.25;
  }

  const zipMatch = normalized.match(/\b(32\d{3}|33\d{3}|\d{5})(?:-\d{4})?\b/);
  const zip = zipMatch?.[1];
  if (zip?.startsWith("32") || zip?.startsWith("33")) {
    return 1.15;
  }

  return 0.95;
}

export function getBaseExposure(analysis: CompletedAnalysisView): number {
  return analysis.request.report?.totalExposureEstimate?.amount ?? 0;
}

export function getHighestImpactScenario(
  analysis: CompletedAnalysisView
): ScenarioExposureEstimate | null {
  const scenarios = analysis.request.report?.scenarioExposures ?? [];
  if (!scenarios.length) {
    return null;
  }

  return [...scenarios].sort(
    (a, b) => b.estimatedImpact.amount - a.estimatedImpact.amount
  )[0];
}

export function getTopScenarios(
  analysis: CompletedAnalysisView,
  limit: number
): ScenarioExposureEstimate[] {
  return [...(analysis.request.report?.scenarioExposures ?? [])]
    .sort((a, b) => b.estimatedImpact.amount - a.estimatedImpact.amount)
    .slice(0, limit);
}

export function getTopFindings(
  analysis: CompletedAnalysisView,
  limit: number
): GapFinding[] {
  return [...(analysis.request.report?.findings ?? [])]
    .sort((a, b) => {
      const severityDelta = severityRank[b.severity] - severityRank[a.severity];
      if (severityDelta !== 0) {
        return severityDelta;
      }

      const impactA = a.financialImpactEstimate?.amount ?? 0;
      const impactB = b.financialImpactEstimate?.amount ?? 0;
      return impactB - impactA;
    })
    .slice(0, limit);
}

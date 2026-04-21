import type {
  AnalysisReport,
  GapFinding,
  MoneyAmount,
  Recommendation,
  RecommendationActionType,
  ScenarioExposureEstimate,
  SourceReference
} from "@/src/domain/policy-gap-analysis.types";
import type {
  FloridaPolicySnapshot,
  IntakeFormData,
  ReportSummaryCard,
  StandardsRule
} from "@/src/domain/florida-homeowners.types";
import { floridaStandardsRegistry } from "@/src/lib/standards/florida-standards-registry";

interface BuildReportInput {
  analysisId: string;
  intake: IntakeFormData;
  snapshot: FloridaPolicySnapshot;
  evaluatedAt: string;
}

function buildEvidence(rule: StandardsRule, snapshot: FloridaPolicySnapshot) {
  return [
    {
      ruleId: rule.ruleId,
      summary: rule.userFacingExplanation,
      sourceReferences: snapshot.evidence
    }
  ];
}

function createFinding(params: {
  id: string;
  title: string;
  description: string;
  severity: GapFinding["severity"];
  type: GapFinding["findingType"];
  rule: StandardsRule;
  snapshot: FloridaPolicySnapshot;
  financialImpactEstimate?: MoneyAmount;
}): GapFinding {
  return {
    id: params.id,
    findingType: params.type,
    severity: params.severity,
    title: params.title,
    description: params.description,
    exposureIds: [],
    policyIds: [],
    evidence: buildEvidence(params.rule, params.snapshot),
    financialImpactEstimate: params.financialImpactEstimate,
    confidence: 0.82
  };
}

function createRecommendation(params: {
  id: string;
  findingId: string;
  actionType: RecommendationActionType;
  priority: Recommendation["priority"];
  rationale: string;
  expectedOutcome: string;
  notes?: string;
}): Recommendation {
  return {
    id: params.id,
    findingId: params.findingId,
    actionType: params.actionType,
    priority: params.priority,
    rationale: params.rationale,
    expectedOutcome: params.expectedOutcome,
    implementationNotes: params.notes
  };
}

function getRule(ruleId: string): StandardsRule {
  const rule = floridaStandardsRegistry.find((item) => item.ruleId === ruleId);
  if (!rule) {
    throw new Error(`Missing standards rule: ${ruleId}`);
  }
  return rule;
}

function createUsdAmount(amount: number): MoneyAmount {
  return {
    amount: Math.round(amount),
    currency: "USD"
  };
}

function calculatePercentExposure(
  replacementValue: number,
  percent: number
): MoneyAmount {
  return createUsdAmount(replacementValue * (percent / 100));
}

function createScenarioExposure(params: {
  id: string;
  label: string;
  basis: string;
  percentOfReplacementValue?: number;
  explicitAmount?: MoneyAmount;
  triggerFindingId: string;
  replacementValue: number;
}): ScenarioExposureEstimate {
  const estimatedImpact =
    params.explicitAmount ??
    calculatePercentExposure(
      params.replacementValue,
      params.percentOfReplacementValue ?? 0
    );

  return {
    id: params.id,
    label: params.label,
    basis: params.basis,
    estimatedImpact,
    triggerFindingId: params.triggerFindingId
  };
}

export function evaluateFloridaHomeownersGapAnalysis(
  input: BuildReportInput
): AnalysisReport {
  const findings: GapFinding[] = [];
  const recommendations: Recommendation[] = [];
  const scenarioExposures: ScenarioExposureEstimate[] = [];
  const snapshot = input.snapshot;
  const replacementValue = snapshot.estimatedReplacementValue.amount;

  if (snapshot.excludesFlood && !snapshot.hasFloodPolicy) {
    const rule = getRule("fl-dfs-flood-companion-policy");
    const financialImpactEstimate = calculatePercentExposure(replacementValue, 40);
    const finding = createFinding({
      id: "finding-flood-gap",
      type: "missing_coverage",
      severity: "high",
      title: "Flood coverage appears to be missing",
      description:
        "The available policy package appears to exclude flood damage, and no separate flood policy was identified in the uploaded documents.",
      rule,
      snapshot,
      financialImpactEstimate
    });

    findings.push(finding);
    scenarioExposures.push(
      createScenarioExposure({
        id: "scenario-flood-gap",
        label: "Flood loss scenario",
        basis: `40% of estimated replacement value ($${replacementValue.toLocaleString()}) because flood coverage appears to be missing.`,
        percentOfReplacementValue: 40,
        triggerFindingId: finding.id,
        replacementValue
      })
    );
    recommendations.push(
      createRecommendation({
        id: "rec-flood-gap",
        findingId: finding.id,
        actionType: "add_coverage",
        priority: "high",
        rationale:
          "Florida residential properties often need a separate flood policy because homeowners policies commonly exclude rising-water damage.",
        expectedOutcome:
          "The homeowner can evaluate NFIP or private flood options before a loss event.",
        notes:
          "Label this as a companion-coverage recommendation, not a statutory failure."
      })
    );
  }

  if (!snapshot.coversWindstorm || snapshot.excludesWindstorm) {
    const rule = getRule("fl-dfs-windstorm-treatment");
    const financialImpactEstimate = calculatePercentExposure(replacementValue, 30);
    const finding = createFinding({
      id: "finding-wind-gap",
      type: "missing_coverage",
      severity: "critical",
      title: "Windstorm treatment appears incomplete or excluded",
      description:
        "The current policy snapshot suggests windstorm, hurricane, or hail protection may not be fully included in the main homeowners package.",
      rule,
      snapshot,
      financialImpactEstimate
    });

    findings.push(finding);
    scenarioExposures.push(
      createScenarioExposure({
        id: "scenario-wind-gap",
        label: "Wind damage scenario",
        basis: `30% of estimated replacement value ($${replacementValue.toLocaleString()}) because windstorm treatment appears incomplete or excluded.`,
        percentOfReplacementValue: 30,
        triggerFindingId: finding.id,
        replacementValue
      })
    );
    recommendations.push(
      createRecommendation({
        id: "rec-wind-gap",
        findingId: finding.id,
        actionType: "request_clarification",
        priority: "urgent",
        rationale:
          "A Florida homeowner should understand whether wind damage is included in the homeowners policy or carved out into a separate wind-only policy.",
        expectedOutcome:
          "The insured can confirm whether the current package actually protects against major wind and hurricane loss."
      })
    );
  }

  if (
    !snapshot.hasOrdinanceOrLawCoverage ||
    (snapshot.ordinanceOrLawLimitPercent ?? 0) < 25
  ) {
    const rule = getRule("fl-627-7011-ordinance-or-law");
    const financialImpactEstimate = calculatePercentExposure(replacementValue, 15);
    const finding = createFinding({
      id: "finding-ordinance-gap",
      type: "insufficient_limit",
      severity: "high",
      title: "Ordinance-or-law coverage appears missing or weak",
      description:
        "The extracted policy snapshot does not clearly show adequate ordinance-or-law treatment, which can matter when rebuilding must comply with updated code requirements.",
      rule,
      snapshot,
      financialImpactEstimate
    });

    findings.push(finding);
    scenarioExposures.push(
      createScenarioExposure({
        id: "scenario-ordinance-gap",
        label: "Code-upgrade scenario",
        basis: `15% of estimated replacement value ($${replacementValue.toLocaleString()}) because ordinance-or-law coverage appears missing or weak.`,
        percentOfReplacementValue: 15,
        triggerFindingId: finding.id,
        replacementValue
      })
    );
    recommendations.push(
      createRecommendation({
        id: "rec-ordinance-gap",
        findingId: finding.id,
        actionType: "add_endorsement",
        priority: "high",
        rationale:
          "Code-upgrade costs can create a meaningful out-of-pocket gap after a major loss if ordinance-or-law treatment is absent or minimal.",
        expectedOutcome:
          "The homeowner can confirm the ordinance-or-law endorsement and evaluate whether the limit is adequate."
      })
    );
  }

  if (
    snapshot.includesCatastrophicGroundCoverCollapseOnly &&
    !snapshot.includesSinkholeCoverage
  ) {
    const rule = getRule("fl-627-706-sinkhole-distinction");
    const finding = createFinding({
      id: "finding-sinkhole-gap",
      type: "wording_ambiguity",
      severity: "medium",
      title: "Sinkhole protection appears narrower than a homeowner may expect",
      description:
        "The current wording suggests the policy includes catastrophic ground cover collapse coverage but does not show broader sinkhole loss coverage.",
      rule,
      snapshot
    });

    findings.push(finding);
    recommendations.push(
      createRecommendation({
        id: "rec-sinkhole-gap",
        findingId: finding.id,
        actionType: "request_clarification",
        priority: "medium",
        rationale:
          "Florida homeowners can mistake catastrophic ground cover collapse coverage for broader sinkhole protection.",
        expectedOutcome:
          "The homeowner can decide whether broader sinkhole coverage should be added for an extra premium."
      })
    );
  }

  if (!snapshot.includesReplacementCost || snapshot.actualCashValueApplies) {
    const rule = getRule("fl-627-7011-replacement-cost");
    const financialImpactEstimate = calculatePercentExposure(replacementValue, 25);
    const finding = createFinding({
      id: "finding-replacement-cost-gap",
      type: "wording_ambiguity",
      severity: "high",
      title: "Loss settlement may be actual cash value instead of replacement cost",
      description:
        "The extracted wording suggests the dwelling or related components may settle on an actual cash value basis rather than full replacement cost.",
      rule,
      snapshot,
      financialImpactEstimate
    });

    findings.push(finding);
    scenarioExposures.push(
      createScenarioExposure({
        id: "scenario-replacement-cost-gap",
        label: "Actual cash value settlement scenario",
        basis: `25% of estimated replacement value ($${replacementValue.toLocaleString()}) because loss settlement may be actual cash value instead of replacement cost.`,
        percentOfReplacementValue: 25,
        triggerFindingId: finding.id,
        replacementValue
      })
    );
    recommendations.push(
      createRecommendation({
        id: "rec-replacement-cost-gap",
        findingId: finding.id,
        actionType: "amend_wording",
        priority: "high",
        rationale:
          "Actual cash value treatment can materially reduce funds available to rebuild after depreciation is applied.",
        expectedOutcome:
          "The homeowner can confirm replacement cost treatment for the dwelling and other critical property categories."
      })
    );
  }

  if (
    (snapshot.hurricaneDeductiblePercent ?? 0) >= 5 ||
    (snapshot.allOtherPerilDeductiblePercent ?? 0) >= 3
  ) {
    const rule = getRule("fl-best-practice-deductible-pressure");
    const deductiblePercent = Math.max(
      snapshot.hurricaneDeductiblePercent ?? 0,
      snapshot.allOtherPerilDeductiblePercent ?? 0
    );
    const financialImpactEstimate = calculatePercentExposure(
      replacementValue,
      deductiblePercent
    );
    const finding = createFinding({
      id: "finding-deductible-pressure",
      type: "deductible_mismatch",
      severity: "medium",
      title: "Deductible pressure may create a practical coverage gap",
      description:
        "The policy appears to include deductibles large enough to create meaningful out-of-pocket exposure after a loss.",
      rule,
      snapshot,
      financialImpactEstimate
    });

    findings.push(finding);
    scenarioExposures.push(
      createScenarioExposure({
        id: "scenario-deductible-pressure",
        label: "Deductible retention scenario",
        basis: `${deductiblePercent}% of estimated replacement value ($${replacementValue.toLocaleString()}) based on the highest detected deductible percentage.`,
        explicitAmount: financialImpactEstimate,
        triggerFindingId: finding.id,
        replacementValue
      })
    );
    recommendations.push(
      createRecommendation({
        id: "rec-deductible-pressure",
        findingId: finding.id,
        actionType: "adjust_retention",
        priority: "medium",
        rationale:
          "High deductibles can leave the policyholder functionally underprotected even when the coverage grant exists.",
        expectedOutcome:
          "The homeowner can evaluate a lower deductible option or plan specifically for retained loss."
      })
    );
  }

  const totalExposureEstimate =
    scenarioExposures.length > 0
      ? scenarioExposures.reduce((max, scenario) =>
          scenario.estimatedImpact.amount > max.amount ? scenario.estimatedImpact : max
        , scenarioExposures[0].estimatedImpact)
      : undefined;

  const summaryParts = [
    `We reviewed ${input.intake.documentCount} uploaded document${input.intake.documentCount === 1 ? "" : "s"} from the submitted policy package.`,
    findings.length === 0
      ? "No material Florida-focused coverage gaps were detected in this prototype review."
      : `The prototype identified ${findings.length} Florida-focused gap ${findings.length === 1 ? "finding" : "findings"} that should be reviewed with a licensed insurance professional.`
  ];

  return {
    id: `report-${input.analysisId}`,
    insuredEntityId: input.analysisId,
    analysisDate: input.evaluatedAt,
    policiesReviewed: [],
    exposuresReviewed: [],
    findings,
    recommendations,
    scenarioExposures,
    totalExposureEstimate,
    executiveSummary: summaryParts.join(" "),
    assumptionsUsed: [
      snapshot.estimatedReplacementValueAssumption,
      "Scenario exposure estimates are deterministic heuristics based on the current rules engine, not claims predictions or actuarial models.",
      "Total exposure estimate is the maximum single scenario exposure, not the sum of all scenarios."
    ],
    methodologyNotes: [
      "This report is based on structured extraction, a Florida standards registry, and a deterministic rules engine.",
      "Economic exposure estimates use fixed scenario percentages tied to the triggered coverage gaps.",
      "The report is decision support and not legal advice or coverage confirmation.",
      "Ambiguous policy wording should be escalated for licensed review."
    ]
  };
}

export function buildSummaryCards(report: AnalysisReport): ReportSummaryCard[] {
  const criticalCount = report.findings.filter(
    (finding) => finding.severity === "critical"
  ).length;
  const highCount = report.findings.filter(
    (finding) => finding.severity === "high"
  ).length;

  return [
    {
      label: "Status",
      value: report.findings.length === 0 ? "Low concern" : "Needs review",
      tone: report.findings.length === 0 ? "positive" : "warning"
    },
    {
      label: "Critical Findings",
      value: String(criticalCount),
      tone: criticalCount > 0 ? "danger" : "neutral"
    },
    {
      label: "High Findings",
      value: String(highCount),
      tone: highCount > 0 ? "warning" : "neutral"
    },
    {
      label: "Recommendations",
      value: String(report.recommendations.length),
      tone: "neutral"
    }
  ];
}

export function buildEvidenceReference(
  documentName: string,
  excerpt: string,
  page?: number
): SourceReference {
  return {
    documentName,
    excerpt,
    page
  };
}

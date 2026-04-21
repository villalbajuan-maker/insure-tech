import type {
  AnalysisRequest,
  ComprehensiveSynthesis,
  PropertyDetailsFormData
} from "@/src/domain/florida-homeowners.types";
import { computeLocationFactor } from "@/src/lib/analysis/analysis-experience";

function buildPropertyRiskDrivers(
  propertyDetails: PropertyDetailsFormData | undefined
): string[] {
  const drivers: string[] = [];

  if (!propertyDetails) {
    return [
      "The policy analysis identified meaningful exposure, but the property profile is still incomplete."
    ];
  }

  if (computeLocationFactor(propertyDetails.address) > 1) {
    drivers.push(
      "The property location suggests elevated storm-related loss severity compared with inland Florida exposure."
    );
  }

  if ((propertyDetails.roofAge ?? 0) >= 15) {
    drivers.push(
      "An older roof profile may increase claim friction, repair pressure, or preventable storm-related damage."
    );
  }

  if (propertyDetails.yearBuilt && propertyDetails.yearBuilt < 2005) {
    drivers.push(
      "Older construction may increase code-upgrade pressure and widen the financial impact of repairs after a major event."
    );
  }

  if (!propertyDetails.estimatedReplacementValue) {
    drivers.push(
      "Replacement assumptions remain uncertain, which can make underinsurance harder to identify without deeper valuation review."
    );
  }

  if (propertyDetails.knownFloodConcern === "yes") {
    drivers.push(
      "The stated flood concern increases the importance of validating how water-related loss scenarios are treated today."
    );
  }

  if (!drivers.length) {
    drivers.push(
      "The property profile suggests the analysis should focus on coverage alignment, condition validation, and practical loss prevention."
    );
  }

  return drivers.slice(0, 4);
}

export function buildComprehensiveSynthesis(
  request: AnalysisRequest
): ComprehensiveSynthesis {
  const report = request.report;
  const propertyDetails = request.propertyDetails;

  const topFindings = report?.findings.slice(0, 3) ?? [];
  const topScenarios = [...(report?.scenarioExposures ?? [])]
    .sort((a, b) => b.estimatedImpact.amount - a.estimatedImpact.amount)
    .slice(0, 3);

  const topFindingTitles = topFindings.map((finding) => finding.title.toLowerCase());
  const topScenarioLabels = topScenarios.map((scenario) => scenario.label.toLowerCase());

  const executiveRiskSummary = topFindings.length
    ? `Your analysis suggests that the property may face meaningful financial exposure under one or more major loss scenarios. The strongest current drivers appear to be ${topFindingTitles.join(", ")}, with the most visible exposure pressure concentrated around ${topScenarioLabels[0] ?? "the leading scenario"}.`
    : "Your uploaded documents did not trigger major Florida-specific gaps in this run, but the property should still be reviewed for coverage alignment and practical storm-readiness.";

  const immediateActions = [
    "Validate the current roof and exterior condition with updated documentation.",
    "Review the largest uncovered scenario against the current policy package.",
    "Confirm whether the present replacement assumptions still reflect the property accurately."
  ];

  const plannedActions = [
    "Schedule an on-site inspection to reduce uncertainty around current property conditions.",
    "Review policy structure, deductibles, and optional endorsements after inspection findings are documented.",
    "Evaluate preventive maintenance or storm-hardening work where visible vulnerabilities are identified."
  ];

  const inspectionBridge =
    "Some of the largest remaining uncertainties in this analysis depend on real property conditions that cannot be confirmed from policy documents alone. An inspection is the clearest next step for validating current condition, documenting visible risks, and improving alignment between the property and the coverage strategy.";

  return {
    executiveRiskSummary,
    propertyRiskDrivers: buildPropertyRiskDrivers(propertyDetails),
    immediateActions,
    plannedActions,
    inspectionBridge,
    actionSummary:
      "The next phase should focus on verifying current property condition, confirming coverage alignment, and prioritizing the few actions that can materially reduce practical loss exposure.",
    verificationItems: [
      "Roof condition, apparent age, and visible exterior vulnerabilities",
      "Signs of water intrusion risk or deferred maintenance",
      "Whether current property condition aligns with policy assumptions",
      "Any visible storm-prevention opportunities that could reduce claim friction"
    ],
    policySideActions: [
      "Review deductible structure and uncovered-scenario treatment",
      "Reassess replacement-cost assumptions and valuation alignment",
      "Clarify whether endorsements or wording changes could close meaningful gaps"
    ],
    propertySideActions: [
      "Address visible maintenance issues that could worsen storm-related damage",
      "Prioritize preventive roof or exterior work where needed",
      "Improve property documentation before a future loss occurs"
    ],
    postInspectionPath: [
      "Validate current property condition on site",
      "Refine the risk picture using observed conditions",
      "Prioritize repairs, preventive work, or policy adjustments",
      "Move into execution based on verified property facts"
    ]
  };
}

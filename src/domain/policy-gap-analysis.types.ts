export type CurrencyCode = "USD" | "EUR" | "GBP" | "COP";

export type CoverageType =
  | "property"
  | "business_interruption"
  | "general_liability"
  | "professional_liability"
  | "cyber"
  | "directors_and_officers";

export type PolicyStatus =
  | "draft"
  | "quoted"
  | "bound"
  | "expired"
  | "under_review";

export type CoverageStatus =
  | "included"
  | "excluded"
  | "silent"
  | "conditional"
  | "unknown";

export type ExposureSeverity = "low" | "medium" | "high" | "critical";

export type ExposureLikelihood = "low" | "medium" | "high" | "unknown";

export type GapFindingType =
  | "missing_coverage"
  | "insufficient_limit"
  | "exclusion_conflict"
  | "territorial_mismatch"
  | "deductible_mismatch"
  | "wording_ambiguity"
  | "endorsement_conflict";

export type RecommendationActionType =
  | "add_coverage"
  | "increase_limit"
  | "amend_wording"
  | "add_endorsement"
  | "adjust_retention"
  | "request_clarification"
  | "manual_review";

export interface MoneyAmount {
  amount: number;
  currency: CurrencyCode;
}

export interface SourceReference {
  documentName: string;
  section?: string;
  page?: number;
  excerpt?: string;
}

export interface Limit {
  id: string;
  name: string;
  amount: MoneyAmount;
  basis?: "per_occurrence" | "aggregate" | "annual" | "per_claim";
}

export interface Deductible {
  id: string;
  name: string;
  amount: MoneyAmount;
  basis?: "per_occurrence" | "annual" | "waiting_period";
}

export interface WaitingPeriod {
  id: string;
  name: string;
  durationHours: number;
}

export interface CoverageClause {
  id: string;
  title: string;
  clauseType: "grant" | "condition" | "warranty" | "trigger" | "definition";
  summary: string;
  sourceReference?: SourceReference;
}

export interface Exclusion {
  id: string;
  title: string;
  description: string;
  appliesToExposureTypes: string[];
  severity: ExposureSeverity;
  sourceReference?: SourceReference;
}

export interface Endorsement {
  id: string;
  code?: string;
  title: string;
  impactType: "expands" | "restricts" | "clarifies" | "replaces";
  summary: string;
  affectedCoverageLineIds: string[];
  sourceReference?: SourceReference;
}

export interface CoverageLine {
  id: string;
  name: string;
  category: CoverageType;
  coveredExposures: string[];
  limits: Limit[];
  deductibles: Deductible[];
  clauses: CoverageClause[];
  exclusions: Exclusion[];
  waitingPeriods: WaitingPeriod[];
  status: CoverageStatus;
}

export interface InsuredEntity {
  id: string;
  name: string;
  industry: string;
  regionsOfOperation: string[];
  annualRevenue?: MoneyAmount;
  employeeCount?: number;
  businessActivities: string[];
  criticalDependencies: string[];
}

export interface Policy {
  id: string;
  policyNumber: string;
  carrierName: string;
  coverageType: CoverageType;
  status: PolicyStatus;
  effectiveDate: string;
  expirationDate: string;
  territory: string[];
  insuredEntityId: string;
  coverageLines: CoverageLine[];
  endorsements: Endorsement[];
  sourceDocument?: SourceReference;
}

export interface RiskExposure {
  id: string;
  type: string;
  title: string;
  description: string;
  businessDriver: string;
  regionsImpacted: string[];
  severity: ExposureSeverity;
  likelihood: ExposureLikelihood;
  recommendedCoverageTypes: CoverageType[];
  minimumControlRequirements: string[];
}

export interface FindingEvidence {
  ruleId: string;
  summary: string;
  sourceReferences: SourceReference[];
}

export interface GapFinding {
  id: string;
  findingType: GapFindingType;
  severity: ExposureSeverity;
  title: string;
  description: string;
  exposureIds: string[];
  policyIds: string[];
  evidence: FindingEvidence[];
  financialImpactEstimate?: MoneyAmount;
  confidence: number;
}

export interface Recommendation {
  id: string;
  findingId: string;
  actionType: RecommendationActionType;
  priority: "low" | "medium" | "high" | "urgent";
  rationale: string;
  expectedOutcome: string;
  suggestedCoverageType?: CoverageType;
  implementationNotes?: string;
}

export interface AnalysisReport {
  id: string;
  insuredEntityId: string;
  analysisDate: string;
  policiesReviewed: string[];
  exposuresReviewed: string[];
  findings: GapFinding[];
  recommendations: Recommendation[];
  executiveSummary: string;
  methodologyNotes: string[];
}

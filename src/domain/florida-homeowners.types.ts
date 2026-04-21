import type {
  AnalysisReport,
  CurrencyCode,
  GapFinding,
  MoneyAmount,
  Recommendation,
  ScenarioExposureEstimate,
  SourceReference
} from "@/src/domain/policy-gap-analysis.types";

export type PropertyType =
  | "single_family"
  | "condo"
  | "townhome"
  | "multifamily_small"
  | "other";

export type OccupancyType =
  | "owner_occupied"
  | "tenant_occupied"
  | "seasonal"
  | "vacant"
  | "mixed";

export type AnalysisStatus =
  | "draft"
  | "payment_pending"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type SourceType =
  | "statute"
  | "regulatory_guidance"
  | "consumer_guidance"
  | "federal_program"
  | "best_practice";

export type StandardsTheme =
  | "statutory_expectation"
  | "florida_market_practice"
  | "companion_coverage_recommendation"
  | "risk_management_best_practice"
  | "manual_review";

export interface PropertyProfile {
  addressLine1: string;
  city: string;
  state: "FL";
  zipCode: string;
  county?: string;
  propertyType: PropertyType;
  occupancyType: OccupancyType;
  yearBuilt?: number;
  estimatedDwellingCoverage?: number;
  hasMortgage?: boolean;
  isInFloodZoneKnown?: boolean;
  notes?: string;
}

export interface IntakeFormData {
  fullName: string;
  email: string;
  propertyProfile: PropertyProfile;
  documentCount: number;
  declaredPolicies: string[];
  agreedToDisclaimer: boolean;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  category:
    | "homeowners_policy"
    | "declarations_page"
    | "endorsements"
    | "flood_policy"
    | "wind_policy"
    | "inspection"
    | "unknown";
  storageKey?: string;
  extractedText?: string;
}

export interface PaymentRecord {
  id: string;
  provider: "stripe";
  amount: number;
  currency: CurrencyCode;
  status: "pending" | "succeeded" | "failed" | "not_required";
  checkoutUrl?: string;
  sessionId?: string;
}

export interface StandardsRule {
  ruleId: string;
  title: string;
  jurisdiction: "FL";
  productLine: "homeowners";
  theme: StandardsTheme;
  sourceType: SourceType;
  sourceCitation: string;
  sourceUrl: string;
  effectiveDate: string;
  status: "active" | "draft" | "deprecated";
  category:
    | "flood"
    | "windstorm"
    | "ordinance_or_law"
    | "sinkhole"
    | "replacement_cost"
    | "deductible"
    | "manual_review";
  severityGuidance: GapFinding["severity"];
  ruleLogicSummary: string;
  userFacingExplanation: string;
}

export interface RuleEvaluation {
  ruleId: string;
  passed: boolean;
  finding?: GapFinding;
  recommendation?: Recommendation;
}

export interface FloridaPolicySnapshot {
  hasHomeownersPolicy: boolean;
  hasFloodPolicy: boolean;
  hasSeparateWindPolicy: boolean;
  coversWindstorm: boolean;
  excludesWindstorm: boolean;
  excludesFlood: boolean;
  hasOrdinanceOrLawCoverage: boolean;
  ordinanceOrLawLimitPercent?: number;
  includesReplacementCost: boolean;
  actualCashValueApplies: boolean;
  includesSinkholeCoverage: boolean;
  includesCatastrophicGroundCoverCollapseOnly: boolean;
  allOtherPerilDeductiblePercent?: number;
  hurricaneDeductiblePercent?: number;
  estimatedReplacementValue: MoneyAmount;
  estimatedReplacementValueAssumption: string;
  evidence: SourceReference[];
}

export interface AnalysisRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: AnalysisStatus;
  intake: IntakeFormData;
  uploadedDocuments: UploadedDocument[];
  payment: PaymentRecord;
  propertyDetails?: PropertyDetailsFormData;
  comprehensivePaymentStatus?: "locked" | "unlocked";
  comprehensiveUnlockedAt?: string;
  comprehensiveSynthesis?: ComprehensiveSynthesis;
  extractedPolicySnapshot?: FloridaPolicySnapshot;
  report?: AnalysisReport;
}

export interface ReportSummaryCard {
  label: string;
  value: string;
  tone: "neutral" | "warning" | "danger" | "positive";
}

export type RoofType = "shingle" | "tile" | "metal" | "flat" | "other";

export interface PropertyDetailsFormData {
  address: string;
  propertyType: PropertyType;
  occupancyType: OccupancyType;
  yearBuilt?: number;
  squareFootage?: number;
  stories?: number;
  estimatedHomeValue?: number;
  estimatedReplacementValue?: number;
  roofAge?: number;
  roofType?: RoofType;
  priorMajorClaim?: "yes" | "no";
  knownFloodConcern?: "yes" | "no" | "not_sure";
}

export interface StarterFindingView {
  id: string;
  severity: GapFinding["severity"];
  title: string;
  description: string;
}

export interface StarterScenarioView {
  id: string;
  label: string;
  basis: string;
  estimatedImpact: MoneyAmount;
}

export interface StarterAnalysisView {
  kind: "starter";
  analysisId: string;
  status: AnalysisStatus;
  waivedOfferLabel: string;
  totalExposureEstimate?: MoneyAmount;
  primaryScenario: StarterScenarioView | null;
  topFindings: StarterFindingView[];
  meaningSummary: string;
  incompleteNotice: string;
  prefilledAddress: string | null;
  nextStepLabel: string;
}

export interface PropertyGateView {
  kind: "property_gate";
  analysisId: string;
  starterExposure?: MoneyAmount;
  starterPrimaryScenario: StarterScenarioView | null;
  prefilledAddress: string | null;
  propertyDetails: Partial<PropertyDetailsFormData> | null;
  unlockValueBullets: string[];
  price: number;
  ctaLabel: string;
}

export interface ComprehensiveSynthesis {
  source: "llm" | "fallback";
  model: string | null;
  generatedAt: string;
  executiveRiskSummary: string;
  propertyRiskDrivers: string[];
  immediateActions: string[];
  plannedActions: string[];
  inspectionBridge: string;
  actionSummary: string;
  verificationItems: string[];
  policySideActions: string[];
  propertySideActions: string[];
  postInspectionPath: string[];
}

export interface ComprehensiveAnalysisView {
  kind: "comprehensive";
  request: AnalysisRequest;
  summaryCards: ReportSummaryCard[];
  displayExposure?: MoneyAmount;
  synthesis: ComprehensiveSynthesis;
}

export interface ExecutionInspectionOffer {
  headline: string;
  body: string;
  includedItems: string[];
  priceRangeLabel: string;
  ctaLabel: string;
}

export interface ExecutionAnalysisView {
  kind: "execution";
  analysisId: string;
  actionSummary: string;
  verificationItems: string[];
  policySideActions: string[];
  propertySideActions: string[];
  inspectionOffer: ExecutionInspectionOffer;
  postInspectionPath: string[];
}

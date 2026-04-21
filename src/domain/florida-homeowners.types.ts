import type {
  AnalysisReport,
  CurrencyCode,
  GapFinding,
  MoneyAmount,
  Recommendation,
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
  extractedPolicySnapshot?: FloridaPolicySnapshot;
  report?: AnalysisReport;
}

export interface ReportSummaryCard {
  label: string;
  value: string;
  tone: "neutral" | "warning" | "danger" | "positive";
}

export interface CompletedAnalysisView {
  request: AnalysisRequest;
  summaryCards: ReportSummaryCard[];
}

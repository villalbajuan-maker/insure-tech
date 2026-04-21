import library from "@/data/synthetic/florida-west-coast/library.json";
import type {
  FloridaPolicySnapshot,
  IntakeFormData
} from "@/src/domain/florida-homeowners.types";
import { evaluateFloridaHomeownersGapAnalysis } from "@/src/lib/analysis/florida-rules-engine";
import { buildEvidenceReference } from "@/src/lib/analysis/florida-rules-engine";

export interface SyntheticScenario {
  id: string;
  title: string;
  county: string;
  city: string;
  corridor: string;
  risk_posture: string;
  property_profile: {
    address_line_1: string;
    city: string;
    state: "FL";
    zip_code: string;
    county: string;
    property_type:
      | "single_family"
      | "condo"
      | "townhome"
      | "multifamily_small"
      | "other";
    occupancy_type:
      | "owner_occupied"
      | "tenant_occupied"
      | "seasonal"
      | "vacant"
      | "mixed";
    year_built: number;
    construction: string;
    distance_to_coast_miles: number;
    estimated_replacement_cost: number;
    flood_zone_indicator: string;
    mortgage: boolean;
  };
  declarations: {
    carrier_name: string;
    policy_number: string;
    policy_form: string;
    effective_period: string;
    annual_premium: number;
    hurricane_portion_of_premium: number;
    coverage_a_dwelling: number;
    ordinance_or_law_percent: number;
    all_other_perils_deductible: number;
    hurricane_deductible_percent: number;
    sinkhole_status: string;
    optional_coverages: string[];
    endorsements: string[];
  };
  policy_notes: string[];
  analysis_snapshot: Omit<FloridaPolicySnapshot, "evidence">;
  expected_findings: string[];
}

interface SyntheticLibraryShape {
  library_id: string;
  version: string;
  generated_for: string;
  notes: string[];
  cases: SyntheticScenario[];
}

const typedLibrary = library as SyntheticLibraryShape;

export function getSyntheticLibrary(): SyntheticLibraryShape {
  return typedLibrary;
}

function buildIntake(caseItem: SyntheticScenario): IntakeFormData {
  return {
    fullName: `Synthetic Demo - ${caseItem.title}`,
    email: "demo@example.com",
    documentCount: 2,
    declaredPolicies: [caseItem.declarations.policy_form],
    agreedToDisclaimer: true,
    propertyProfile: {
      addressLine1: caseItem.property_profile.address_line_1,
      city: caseItem.property_profile.city,
      state: "FL",
      zipCode: caseItem.property_profile.zip_code,
      county: caseItem.property_profile.county,
      propertyType: caseItem.property_profile.property_type,
      occupancyType: caseItem.property_profile.occupancy_type,
      yearBuilt: caseItem.property_profile.year_built,
      estimatedDwellingCoverage: caseItem.declarations.coverage_a_dwelling,
      hasMortgage: caseItem.property_profile.mortgage,
      notes: caseItem.risk_posture
    }
  };
}

function buildSnapshot(caseItem: SyntheticScenario): FloridaPolicySnapshot {
  return {
    ...caseItem.analysis_snapshot,
    evidence: [
      buildEvidenceReference(
        `${caseItem.id}-declarations-page.md`,
        `Synthetic declarations evidence for ${caseItem.title}.`
      ),
      buildEvidenceReference(
        `${caseItem.id}-policy-packet.md`,
        `Synthetic policy packet evidence for ${caseItem.county} County scenario.`
      )
    ]
  };
}

export function evaluateSyntheticScenario(caseItem: SyntheticScenario) {
  return evaluateFloridaHomeownersGapAnalysis({
    analysisId: caseItem.id,
    intake: buildIntake(caseItem),
    snapshot: buildSnapshot(caseItem),
    evaluatedAt: new Date().toISOString()
  });
}

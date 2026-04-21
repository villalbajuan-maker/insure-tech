import type {
  FloridaPolicySnapshot,
  IntakeFormData,
  UploadedDocument
} from "@/src/domain/florida-homeowners.types";
import { buildEvidenceReference } from "@/src/lib/analysis/florida-rules-engine";

function hasDeclaredPolicy(intake: IntakeFormData, needle: string): boolean {
  return intake.declaredPolicies.some((policy) =>
    policy.toLowerCase().includes(needle.toLowerCase())
  );
}

export function mockExtractFloridaPolicySnapshot(params: {
  intake: IntakeFormData;
  uploadedDocuments: UploadedDocument[];
}): FloridaPolicySnapshot {
  const { intake, uploadedDocuments } = params;
  const hasFloodPolicy =
    uploadedDocuments.some((document) => document.category === "flood_policy") ||
    hasDeclaredPolicy(intake, "flood");
  const hasWindPolicy =
    uploadedDocuments.some((document) => document.category === "wind_policy") ||
    hasDeclaredPolicy(intake, "wind");

  const propertyType = intake.propertyProfile.propertyType;
  const occupancy = intake.propertyProfile.occupancyType;
  const estimatedCoverage = intake.propertyProfile.estimatedDwellingCoverage ?? 0;

  const evidence = [
    buildEvidenceReference(
      uploadedDocuments[0]?.fileName ?? "Uploaded policy package",
      "Prototype extraction based on uploaded file metadata and intake answers."
    ),
    buildEvidenceReference(
      "User intake",
      `Property type: ${propertyType}; occupancy: ${occupancy}; estimated dwelling coverage: ${estimatedCoverage || "unknown"}.`
    )
  ];

  return {
    hasHomeownersPolicy: true,
    hasFloodPolicy,
    hasSeparateWindPolicy: hasWindPolicy,
    coversWindstorm: hasWindPolicy ? true : propertyType !== "condo",
    excludesWindstorm: hasWindPolicy ? false : occupancy === "vacant",
    excludesFlood: !hasFloodPolicy,
    hasOrdinanceOrLawCoverage: estimatedCoverage > 400000,
    ordinanceOrLawLimitPercent: estimatedCoverage > 750000 ? 25 : 10,
    includesReplacementCost: occupancy !== "vacant",
    actualCashValueApplies: occupancy === "vacant" || estimatedCoverage < 300000,
    includesSinkholeCoverage: intake.propertyProfile.county === "Hernando",
    includesCatastrophicGroundCoverCollapseOnly:
      intake.propertyProfile.county !== "Hernando",
    allOtherPerilDeductiblePercent: estimatedCoverage > 900000 ? 3 : 2,
    hurricaneDeductiblePercent: hasWindPolicy ? 2 : 5,
    estimatedReplacementValue: {
      amount: estimatedCoverage > 0 ? estimatedCoverage : 375000,
      currency: "USD"
    },
    estimatedReplacementValueAssumption:
      estimatedCoverage > 0
        ? "Estimated replacement value is based on the provided dwelling coverage figure from intake."
        : "No property valuation data was provided, so the mock extractor used a Florida default midpoint replacement estimate of $375,000.",
    evidence
  };
}

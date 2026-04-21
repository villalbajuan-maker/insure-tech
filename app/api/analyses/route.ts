import { NextResponse } from "next/server";
import { z } from "zod";
import type { IntakeFormData } from "@/src/domain/florida-homeowners.types";
import { createAnalysisRequest } from "@/src/lib/repository/analysis-store";

const intakeSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  addressLine1: z.string().min(3),
  city: z.string().min(2),
  zipCode: z.string().min(5),
  county: z.string().optional(),
  propertyType: z.enum([
    "single_family",
    "condo",
    "townhome",
    "multifamily_small",
    "other"
  ]),
  occupancyType: z.enum([
    "owner_occupied",
    "tenant_occupied",
    "seasonal",
    "vacant",
    "mixed"
  ]),
  estimatedDwellingCoverage: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined)),
  documentCount: z
    .string()
    .transform((value) => Number(value))
    .pipe(z.number().int().min(1)),
  fileNames: z.string().min(3),
  declaredPolicies: z.string().min(1),
  agreedToDisclaimer: z.literal("on")
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const rawPayload = Object.fromEntries(formData.entries());
  const payload = intakeSchema.parse(rawPayload);

  const intake: IntakeFormData = {
    fullName: payload.fullName,
    email: payload.email,
    documentCount: payload.documentCount,
    declaredPolicies: payload.declaredPolicies
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    agreedToDisclaimer: true,
    propertyProfile: {
      addressLine1: payload.addressLine1,
      city: payload.city,
      state: "FL",
      zipCode: payload.zipCode,
      county: payload.county,
      propertyType: payload.propertyType,
      occupancyType: payload.occupancyType,
      estimatedDwellingCoverage: payload.estimatedDwellingCoverage
    }
  };

  const files = payload.fileNames
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((fileName) => ({
      fileName,
      mimeType: "application/pdf",
      sizeBytes: 1_500_000
    }));

  const analysis = await createAnalysisRequest({
    intake,
    files
  });

  return NextResponse.json({
    analysisId: analysis.id,
    checkoutUrl: analysis.payment.checkoutUrl ?? `/analyses/${analysis.id}`
  });
}

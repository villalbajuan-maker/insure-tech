import { NextResponse } from "next/server";
import type {
  CompletedAnalysisView,
  IntakeFormData
} from "@/src/domain/florida-homeowners.types";
import {
  createAnalysisRequest,
  getCompletedAnalysisView,
  processAnalysisRequest
} from "@/src/lib/repository/analysis-store";

export async function POST(request: Request) {
  const formData = await request.formData();

  const uploadedFiles = formData
    .getAll("policyFiles")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (!uploadedFiles.length) {
    return NextResponse.json(
      { error: "At least one PDF file is required." },
      { status: 400 }
    );
  }

  const files = await Promise.all(
    uploadedFiles.map(async (file) => ({
      fileName: file.name,
      mimeType: file.type || "application/pdf",
      sizeBytes: file.size,
      bytes: Buffer.from(await file.arrayBuffer())
    }))
  );

  const intake: IntakeFormData = {
    fullName: "Policy reviewer",
    email: "prototype@local",
    documentCount: files.length,
    declaredPolicies: files.map((file) => file.fileName),
    agreedToDisclaimer: true,
    propertyProfile: {
      addressLine1: "Uploaded policy package",
      city: "Florida",
      state: "FL",
      zipCode: "00000",
      propertyType: "single_family",
      occupancyType: "owner_occupied"
    }
  };

  const analysis = await createAnalysisRequest({
    intake,
    files
  });

  await processAnalysisRequest(analysis.id);
  const view = getCompletedAnalysisView(analysis.id) as CompletedAnalysisView | null;

  if (!view) {
    return NextResponse.json(
      { error: "The analysis could not be completed for the uploaded PDFs." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    analysisId: analysis.id,
    analysis: view
  });
}

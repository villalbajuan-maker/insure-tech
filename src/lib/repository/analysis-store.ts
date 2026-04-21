import type {
  AnalysisRequest,
  CompletedAnalysisView,
  IntakeFormData,
  UploadedDocument
} from "@/src/domain/florida-homeowners.types";
import {
  buildSummaryCards,
  evaluateFloridaHomeownersGapAnalysis
} from "@/src/lib/analysis/florida-rules-engine";
import { mockExtractFloridaPolicySnapshot } from "@/src/lib/analysis/mock-policy-extraction";
import { createPrototypeCheckoutSession } from "@/src/lib/payments/stripe";
import { slugify } from "@/src/lib/utils";

declare global {
  // eslint-disable-next-line no-var
  var __analysisStore: Map<string, AnalysisRequest> | undefined;
}

const analysisStore =
  globalThis.__analysisStore ?? new Map<string, AnalysisRequest>();

globalThis.__analysisStore = analysisStore;

function now(): string {
  return new Date().toISOString();
}

function categorizeDocument(fileName: string): UploadedDocument["category"] {
  const name = fileName.toLowerCase();
  if (name.includes("flood")) return "flood_policy";
  if (name.includes("wind")) return "wind_policy";
  if (name.includes("endorsement")) return "endorsements";
  if (name.includes("declarations") || name.includes("dec")) {
    return "declarations_page";
  }
  if (name.includes("inspection") || name.includes("mitigation")) {
    return "inspection";
  }
  if (name.includes("policy") || name.endsWith(".pdf")) {
    return "homeowners_policy";
  }
  return "unknown";
}

export async function createAnalysisRequest(params: {
  intake: IntakeFormData;
  files: Array<{ fileName: string; mimeType: string; sizeBytes: number }>;
}) {
  const id = `${slugify(params.intake.fullName)}-${Date.now()}`;
  const createdAt = now();
  const uploadedDocuments: UploadedDocument[] = params.files.map((file, index) => ({
    id: `${id}-doc-${index + 1}`,
    fileName: file.fileName,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    category: categorizeDocument(file.fileName)
  }));

  const payment = await createPrototypeCheckoutSession({
    analysisId: id,
    customerEmail: params.intake.email
  });

  const request: AnalysisRequest = {
    id,
    createdAt,
    updatedAt: createdAt,
    status: "payment_pending",
    intake: params.intake,
    uploadedDocuments,
    payment: {
      id: payment.sessionId,
      provider: payment.provider,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      checkoutUrl: payment.checkoutUrl,
      sessionId: payment.sessionId
    }
  };

  analysisStore.set(id, request);
  return request;
}

export function getAnalysisRequest(id: string): AnalysisRequest | null {
  return analysisStore.get(id) ?? null;
}

export function listAnalysisRequests(): AnalysisRequest[] {
  return Array.from(analysisStore.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function markPaymentSucceeded(id: string): AnalysisRequest | null {
  const request = analysisStore.get(id);
  if (!request) {
    return null;
  }

  request.payment.status = "succeeded";
  request.status = "queued";
  request.updatedAt = now();
  analysisStore.set(id, request);
  return request;
}

export function processAnalysisRequest(id: string): AnalysisRequest | null {
  const request = analysisStore.get(id);
  if (!request) {
    return null;
  }

  request.status = "processing";
  request.updatedAt = now();

  const snapshot = mockExtractFloridaPolicySnapshot({
    intake: request.intake,
    uploadedDocuments: request.uploadedDocuments
  });

  request.extractedPolicySnapshot = snapshot;
  request.report = evaluateFloridaHomeownersGapAnalysis({
    analysisId: request.id,
    intake: request.intake,
    snapshot,
    evaluatedAt: now()
  });
  request.status = "completed";
  request.updatedAt = now();

  analysisStore.set(id, request);
  return request;
}

export function getCompletedAnalysisView(id: string): CompletedAnalysisView | null {
  const request = analysisStore.get(id);
  if (!request || !request.report) {
    return null;
  }

  return {
    request,
    summaryCards: buildSummaryCards(request.report)
  };
}

import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type {
  AnalysisRequest,
  FullAnalysisView,
  IntakeFormData,
  SnapshotAnalysisView,
  UploadedDocument
} from "@/src/domain/florida-homeowners.types";
import {
  evaluateFloridaHomeownersGapAnalysis
} from "@/src/lib/analysis/florida-rules-engine";
import {
  buildFullView,
  buildSnapshotView
} from "@/src/lib/analysis/analysis-view-builders";
import { normalizeFloridaPolicySnapshot } from "@/src/lib/analysis/pdf-policy-normalizer";
import { extractPdfText } from "@/src/lib/extraction/pdf-text-extractor";
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
  files: Array<{
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    bytes: Buffer;
  }>;
}) {
  const id = `${slugify(params.intake.fullName)}-${Date.now()}`;
  const createdAt = now();
  const uploadDir = path.join(os.tmpdir(), "insure-tech-uploads", id);
  await mkdir(uploadDir, { recursive: true });

  const uploadedDocuments: UploadedDocument[] = [];
  for (const [index, file] of params.files.entries()) {
    const safeFileName = path.basename(file.fileName);
    const storageKey = path.join(uploadDir, safeFileName);
    await writeFile(storageKey, file.bytes);
    uploadedDocuments.push({
      id: `${id}-doc-${index + 1}`,
      fileName: safeFileName,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      category: categorizeDocument(safeFileName),
      storageKey
    });
  }

  const request: AnalysisRequest = {
    id,
    createdAt,
    updatedAt: createdAt,
    status: "queued",
    intake: params.intake,
    uploadedDocuments,
    payment: {
      id: `not-required-${id}`,
      provider: "stripe",
      amount: 0,
      currency: "USD",
      status: "not_required"
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

export async function processAnalysisRequest(id: string): Promise<AnalysisRequest | null> {
  const request = analysisStore.get(id);
  if (!request) {
    return null;
  }

  request.status = "processing";
  request.updatedAt = now();

  const documentsWithPaths = request.uploadedDocuments.filter(
    (document): document is UploadedDocument & { storageKey: string } =>
      typeof document.storageKey === "string"
  );

  const extractedDocuments = await extractPdfText(
    documentsWithPaths.map((document) => document.storageKey)
  );

  request.uploadedDocuments = request.uploadedDocuments.map((document) => {
    const extracted = extractedDocuments.find(
      (item) => path.basename(item.path) === document.fileName
    );
    return {
      ...document,
      extractedText: extracted?.text
    };
  });

  const snapshot = normalizeFloridaPolicySnapshot({
    intake: request.intake,
    documents: extractedDocuments
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

export function getSnapshotAnalysisView(id: string): SnapshotAnalysisView | null {
  const request = analysisStore.get(id);
  if (!request) return null;

  return buildSnapshotView(request);
}

export function getFullAnalysisView(id: string): FullAnalysisView | null {
  const request = analysisStore.get(id);
  if (!request) return null;

  return buildFullView(request);
}

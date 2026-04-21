import type { AnalysisRequest } from "@/src/domain/florida-homeowners.types";

const storagePrefix = "analysis-cache";

function getStorageKey(id: string): string {
  return `${storagePrefix}:${id}`;
}

export function saveCachedAnalysis(request: AnalysisRequest): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStorageKey(request.id), JSON.stringify(request));
}

export function loadCachedAnalysis(id: string): AnalysisRequest | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getStorageKey(id));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AnalysisRequest;
  } catch {
    return null;
  }
}

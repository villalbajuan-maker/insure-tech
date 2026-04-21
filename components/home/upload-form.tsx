"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AnalysisRequest } from "@/src/domain/florida-homeowners.types";
import { saveCachedAnalysis } from "@/src/lib/analysis/analysis-client-store";

interface CreateAnalysisResponse {
  analysisId: string;
  request: AnalysisRequest;
}

export function UploadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();

  const totalSizeLabel = selectedFiles.length
    ? `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} selected · ${(selectedFiles.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)).toFixed(2)} MB`
    : null;

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/analyses", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(
          payload?.error ??
            "We could not analyze the uploaded files. Please try again with valid PDFs."
        );
        return;
      }

      const data = (await response.json()) as CreateAnalysisResponse;
      saveCachedAnalysis(data.request);
      router.push(`/analysis/${data.analysisId}?state=starter`);
    });
  }

  return (
    <div className="space-y-8">
      <section id="final-cta" className="print-hide scroll-mt-8 rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-coral">
              Final step
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              Discover your exposure before a storm does.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              View my report now
            </p>
          </div>

          <form
            action={handleSubmit}
            className="rounded-[2rem] bg-white/95 p-8 text-ink shadow-card"
          >
            <label className="flex flex-col gap-3 text-sm font-medium text-slate-800">
              Upload policy PDFs
              <input
                required
                type="file"
                name="policyFiles"
                accept="application/pdf,.pdf"
                multiple
                onChange={(event) =>
                  setSelectedFiles(Array.from(event.currentTarget.files ?? []))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-tide"
              />
            </label>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-mist px-3 py-1">
                Recommended: declarations + policy packet
              </span>
              <span className="rounded-full bg-mist px-3 py-1">
                PDF only
              </span>
              {totalSizeLabel ? (
                <span className="rounded-full bg-mist px-3 py-1">{totalSizeLabel}</span>
              ) : null}
            </div>

            {error ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Generating report..." : "View my report now"}
              </button>
              <p className="text-sm text-slate-500">Starter preview is currently waived.</p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

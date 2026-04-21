"use client";

import { useRef, useState, useTransition } from "react";
import { ReportView } from "@/components/report/report-view";
import type { CompletedAnalysisView } from "@/src/domain/florida-homeowners.types";

interface CreateAnalysisResponse {
  analysisId: string;
  analysis: CompletedAnalysisView;
}

export function UploadForm() {
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CompletedAnalysisView | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();
  const reportRef = useRef<HTMLDivElement | null>(null);

  const totalSizeLabel = selectedFiles.length
    ? `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} selected · ${(selectedFiles.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)).toFixed(2)} MB`
    : null;

  async function handleSubmit(formData: FormData) {
    setError(null);
    setAnalysis(null);
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
      setAnalysis(data.analysis);
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    });
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          action={handleSubmit}
          className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card"
        >
          <div className="mb-8">
            <div className="inline-flex rounded-full bg-tide/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
              Florida residential prototype
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Upload the policy package and run the gap analysis
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              This flow is intentionally minimal. Upload the declarations page, the
              main policy wording, endorsements, or any companion PDF packet and the
              prototype will extract coverage signals and produce the report below.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-mist/70 p-6">
            <label className="flex flex-col gap-3 text-sm font-medium text-slate-800">
              Policy PDFs
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
              <span className="rounded-full bg-white px-3 py-1">
                Recommended: declarations + policy packet
              </span>
              <span className="rounded-full bg-white px-3 py-1">
                Accepted: PDF only
              </span>
              {totalSizeLabel ? (
                <span className="rounded-full bg-white px-3 py-1">{totalSizeLabel}</span>
              ) : null}
            </div>
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
              {isPending ? "Analyzing uploaded PDFs..." : "Run gap analysis"}
            </button>
            <p className="text-sm text-slate-500">
              No payment, no account creation, no intake fields.
            </p>
          </div>
        </form>

        <aside className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
          <h3 className="text-xl font-semibold">What your reviewer will see</h3>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-coral">
                Step 1
              </div>
              <p className="mt-2">
                Upload one PDF or a full package with declarations, policy wording, and endorsements.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-coral">
                Step 2
              </div>
              <p className="mt-2">
                The parser extracts coverage clues for flood, wind, ordinance-or-law, sinkhole, valuation, and deductibles.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-coral">
                Step 3
              </div>
              <p className="mt-2">
                The rules engine returns findings, evidence notes, recommendations, and methodology on the same screen.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {analysis ? (
        <div ref={reportRef} className="space-y-4">
          <div className="flex items-center justify-between rounded-[2rem] border border-white/70 bg-white/90 px-6 py-4 shadow-card">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Analysis complete
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Review the extracted findings below. Upload a new package any time to replace this result.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAnalysis(null);
                setError(null);
              }}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Clear result
            </button>
          </div>
          <ReportView analysis={analysis} />
        </div>
      ) : null}
    </div>
  );
}

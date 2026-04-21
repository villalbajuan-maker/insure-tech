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
      <section
        id="upload-audit"
        className="print-hide grid gap-6 scroll-mt-8 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <form
          action={handleSubmit}
          className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card"
        >
          <div className="mb-8">
            <div className="inline-flex rounded-full bg-coral/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
              Upload policy for audit
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Start the storm protection policy review
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Upload the declarations page, policy packet, and any endorsements you
              have. The prototype will analyze the uploaded PDFs and return a report
              centered on uncovered risk, underinsured exposure, and recommended action
              steps.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-mist px-3 py-1">Low-friction first step</span>
              <span className="rounded-full bg-mist px-3 py-1">Designed for Florida homes</span>
              <span className="rounded-full bg-mist px-3 py-1">Built to support inspection follow-up</span>
            </div>
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
              {isPending ? "Analyzing uploaded PDFs..." : "Run policy audit"}
            </button>
            <p className="text-sm text-slate-500">
              Prototype mode: no checkout or account creation in this version.
            </p>
          </div>
        </form>

        <aside className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
          <h3 className="text-xl font-semibold">Why homeowners say yes to this offer</h3>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-coral">
                Hidden gaps
              </div>
              <p className="mt-2">
                Missing flood, wind, or endorsement support that leaves the homeowner exposed.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-coral">
                Claim pain
              </div>
              <p className="mt-2">
                Wording or deductible structures that can still produce painful out-of-pocket loss after a claim.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-coral">
                Action steps
              </div>
              <p className="mt-2">
                Recommendations that can naturally lead into a follow-up inspection conversation.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-3xl bg-coral/10 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-coral">
              James-style positioning
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-100">
              This is not sold as a policy-reading exercise. It is sold as a way to
              uncover what could go wrong before the next storm and before the next claim.
            </p>
          </div>
        </aside>
      </section>

      {analysis ? (
        <div ref={reportRef} className="space-y-4">
          <div className="print-hide flex items-center justify-between rounded-[2rem] border border-white/70 bg-white/90 px-6 py-4 shadow-card">
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

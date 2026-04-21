"use client";

import type { SnapshotAnalysisView } from "@/src/domain/florida-homeowners.types";
import { formatCurrency, titleCase } from "@/src/lib/utils";

interface SnapshotStateViewProps {
  analysis: SnapshotAnalysisView;
  exposure: number;
  onRefine: () => void;
}

export function SnapshotStateView({
  analysis,
  exposure,
  onRefine
}: SnapshotStateViewProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.18em] text-coral">Snapshot</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-ink">
          Your property may be exposed to {formatCurrency(exposure, "USD")} in uncovered losses
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          {analysis.incompleteNotice}
        </p>
      </section>

      {analysis.highestImpactScenario ? (
        <section className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-coral">Primary scenario</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold">
                {analysis.highestImpactScenario.label}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                {analysis.highestImpactScenario.basis}
              </p>
            </div>
            <div className="text-4xl font-semibold">
              {formatCurrency(
                analysis.highestImpactScenario.estimatedImpact.amount,
                analysis.highestImpactScenario.estimatedImpact.currency
              )}
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2">
        {analysis.topFindings.map((finding) => (
          <article
            key={finding.id}
            className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-card"
          >
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {titleCase(finding.severity)}
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-ink">{finding.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{finding.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            {analysis.incompleteNotice}
          </p>
          <button
            type="button"
            onClick={onRefine}
            className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Refine my analysis
          </button>
        </div>
      </section>
    </div>
  );
}

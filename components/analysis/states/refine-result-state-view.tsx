"use client";

import type { SnapshotAnalysisView } from "@/src/domain/florida-homeowners.types";
import { formatCurrency } from "@/src/lib/utils";

interface RefineResultStateViewProps {
  analysis: SnapshotAnalysisView;
  baseExposure: number;
  refinedExposure: number;
  onUnlockFull: () => void;
}

export function RefineResultStateView({
  analysis,
  baseExposure,
  refinedExposure,
  onUnlockFull
}: RefineResultStateViewProps) {
  const scenarios = analysis.highestImpactScenario ? [analysis.highestImpactScenario] : [];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.18em] text-coral">Recalculated exposure</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Your updated exposure based on location: {formatCurrency(refinedExposure, "USD")}
        </h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-mist p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Initial estimate
            </div>
            <div className="mt-3 text-3xl font-semibold text-ink">
              {formatCurrency(baseExposure, "USD")}
            </div>
          </div>
          <div className="rounded-3xl bg-sand p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Adjusted for your location
            </div>
            <div className="mt-3 text-3xl font-semibold text-ink">
              {formatCurrency(refinedExposure, "USD")}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
        <h2 className="text-2xl font-semibold">Why it changed</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
          Homes closer to the coast or in higher-risk Florida regions typically
          experience higher loss severity during storm events.
        </p>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <h2 className="text-2xl font-semibold text-ink">Expanded scenarios</h2>
        <div className="mt-6 space-y-4">
          {scenarios.length > 0 ? (
            scenarios.map((scenario) => (
              <article key={scenario.id} className="rounded-3xl bg-mist p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {scenario.label}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {scenario.basis}
                    </p>
                  </div>
                  <div className="text-2xl font-semibold text-ink">
                    {formatCurrency(
                      scenario.estimatedImpact.amount,
                      scenario.estimatedImpact.currency
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl bg-emerald-50 p-5 text-sm text-emerald-700">
              No exposure scenarios were generated for this analysis yet.
            </div>
          )}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={onUnlockFull}
            className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Unlock full analysis
          </button>
        </div>
      </section>
    </div>
  );
}

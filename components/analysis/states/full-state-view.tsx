"use client";

import { ReportView } from "@/components/report/report-view";
import type { FullAnalysisView } from "@/src/domain/florida-homeowners.types";
import { formatCurrency } from "@/src/lib/utils";

interface FullStateViewProps {
  analysis: FullAnalysisView;
  totalExposure: number;
  refinementApplied: boolean;
  onContinue: () => void;
}

export function FullStateView({
  analysis,
  totalExposure,
  refinementApplied,
  onContinue
}: FullStateViewProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.18em] text-coral">Full analysis</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Total estimated exposure: {formatCurrency(totalExposure, "USD")}
        </h1>
        {refinementApplied ? (
          <div className="mt-5 inline-flex rounded-full bg-mist px-4 py-2 text-sm font-medium text-slate-700">
            Includes location-adjusted estimate
          </div>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <h2 className="text-2xl font-semibold text-ink">Why this happens</h2>
        <div className="mt-6 space-y-4">
          {analysis.request.report?.findings.map((finding) => (
            <article key={finding.id} className="rounded-3xl bg-mist p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-ink">{finding.title}</div>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {finding.description}
                  </p>
                </div>
                {finding.financialImpactEstimate ? (
                  <div className="text-2xl font-semibold text-ink">
                    {formatCurrency(
                      finding.financialImpactEstimate.amount,
                      finding.financialImpactEstimate.currency
                    )}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <ReportView
        analysis={analysis}
        exposureOverride={{
          amount: totalExposure,
          currency: analysis.request.report?.totalExposureEstimate?.currency ?? "USD"
        }}
        banner={refinementApplied ? "Includes location-adjusted estimate" : undefined}
      />

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-coral">Next step</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              Get a full protection plan
            </h2>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Get a full protection plan
          </button>
        </div>
      </section>
    </div>
  );
}

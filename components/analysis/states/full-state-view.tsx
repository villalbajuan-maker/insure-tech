"use client";

import { ReportView } from "@/components/report/report-view";
import type { ComprehensiveAnalysisView } from "@/src/domain/florida-homeowners.types";
import { formatCurrency } from "@/src/lib/utils";

interface ComprehensiveStateViewProps {
  analysis: ComprehensiveAnalysisView;
  onContinue: () => void;
}

export function ComprehensiveStateView({
  analysis,
  onContinue
}: ComprehensiveStateViewProps) {
  const displayExposure =
    analysis.displayExposure ?? analysis.request.report?.totalExposureEstimate;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.18em] text-coral">
          Comprehensive Property Risk Analysis
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Total estimated exposure:{" "}
          {displayExposure
            ? formatCurrency(displayExposure.amount, displayExposure.currency)
            : "Unavailable"}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Built from your policy documents and your property details.
        </p>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <h2 className="text-2xl font-semibold text-ink">Executive risk summary</h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-700">
          {analysis.synthesis.executiveRiskSummary}
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-ink">Property-specific risk drivers</h2>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
            {analysis.synthesis.propertyRiskDrivers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-ink">Recommended actions</h2>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-mist p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Do now</div>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                {analysis.synthesis.immediateActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-sand p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Plan next
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                {analysis.synthesis.plannedActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </section>

      <ReportView
        analysis={analysis}
        exposureOverride={displayExposure}
        banner="Comprehensive analysis unlocked"
      />

      <section className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
        <h2 className="text-2xl font-semibold">A property inspection may help reduce uncertainty</h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-200">
          {analysis.synthesis.inspectionBridge}
        </p>
        <div className="mt-8">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100"
          >
            Schedule inspection
          </button>
        </div>
      </section>
    </div>
  );
}

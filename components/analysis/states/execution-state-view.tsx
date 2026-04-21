"use client";

import type { ExecutionAnalysisView } from "@/src/domain/florida-homeowners.types";

interface ExecutionStateViewProps {
  analysis: ExecutionAnalysisView;
}

export function ExecutionStateView({ analysis }: ExecutionStateViewProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.18em] text-coral">Execution</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Now it is time to reduce the risk
        </h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
          {analysis.actionSummary}
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-ink">What needs to be verified</h2>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
            {analysis.verificationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-ink">Policy-side actions</h2>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
            {analysis.policySideActions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-ink">Property-side actions</h2>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
            {analysis.propertySideActions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
        <p className="text-sm uppercase tracking-[0.18em] text-coral">Inspection</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          {analysis.inspectionOffer.headline}
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-200">
          {analysis.inspectionOffer.body}
        </p>
        <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-200">
          {analysis.inspectionOffer.includedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-6 text-sm font-medium text-slate-100">
          {analysis.inspectionOffer.priceRangeLabel}
        </p>
        <div className="mt-8">
          <button
            type="button"
            className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100"
          >
            {analysis.inspectionOffer.ctaLabel}
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <h2 className="text-2xl font-semibold text-ink">What happens after inspection</h2>
        <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
          {analysis.postInspectionPath.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

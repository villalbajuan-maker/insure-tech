"use client";

export function ExecutionStateView() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
      <p className="text-sm uppercase tracking-[0.18em] text-coral">Execution</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">
        We can verify and fix this before it costs you
      </h2>
      <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-200">
        <li>On-site inspection</li>
        <li>Roof and structure validation</li>
        <li>Coverage alignment check</li>
        <li>Pre-claim documentation</li>
      </ul>
      <div className="mt-8">
        <button
          type="button"
          className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100"
        >
          Schedule inspection
        </button>
      </div>
    </section>
  );
}

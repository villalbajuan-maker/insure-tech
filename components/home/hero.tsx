export function Hero() {
  return (
    <section className="print-hide overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-card backdrop-blur md:p-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex rounded-full bg-coral/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-coral">
            Florida storm coverage audit
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            Your insurance probably does not cover what you think it does.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Find out in minutes how much money you could lose if a storm hits your home today.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#final-cta"
              className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View my report for $49
            </a>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            No calls. No commitment. Results in minutes.
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#102033] p-6 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-coral/20 blur-2xl" />
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-300">Protected home</div>
              <div className="mt-3 rounded-2xl bg-emerald-400/20 p-4">
                <div className="text-lg font-semibold text-emerald-200">Clear coverage</div>
                <div className="mt-1 text-sm text-slate-100">Coverage gaps identified before the loss</div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-300">Storm-hit home</div>
              <div className="mt-3 rounded-2xl bg-red-500/20 p-4">
                <div className="text-lg font-semibold text-red-200">Disputed claim</div>
                <div className="mt-1 text-sm text-slate-100">Damage, deductible pressure, and limited coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

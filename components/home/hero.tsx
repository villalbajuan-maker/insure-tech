export function Hero() {
  return (
    <section className="print-hide overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-card backdrop-blur md:p-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex rounded-full bg-coral/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-coral">
            Storm protection revenue system
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            Find coverage gaps before a storm turns them into denied claims.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Upload your insurance policy documents and get a structured Florida gap
            analysis focused on underinsured exposure, missing companion coverage,
            deductible pressure, and practical next steps. This prototype is arranged
            for the same conversion logic James proposed: policy review first, inspection
            conversation next.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#upload-audit"
              className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Start the $49 audit flow
            </a>
            <a
              href="#how-it-works"
              className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              See how it works
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-2xl bg-[#102033] px-5 py-4 text-white">
              <div className="text-sm uppercase tracking-[0.16em] text-slate-400">
                Core offer
              </div>
              <div className="text-2xl font-semibold">$49 policy audit</div>
            </div>
            <div className="rounded-2xl bg-sand px-5 py-4">
              <div className="text-sm uppercase tracking-[0.16em] text-slate-500">
                Review scope
              </div>
              <div className="text-2xl font-semibold">Florida residential only</div>
            </div>
            <div className="rounded-2xl bg-mist px-5 py-4">
              <div className="text-sm uppercase tracking-[0.16em] text-slate-500">
                Downstream action
              </div>
              <div className="text-2xl font-semibold">Inspection booking</div>
            </div>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            <div className="rounded-2xl bg-white/80 px-4 py-4">
              Detect missing companion coverage before the next storm event.
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-4">
              Flag deductible and wording issues that can still lead to claim pain.
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-4">
              Turn the report into a higher-trust inspection conversation.
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#102033] p-6 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-coral/20 blur-2xl" />
          <div className="absolute inset-x-6 top-0 h-px bg-white/20" />
          <p className="text-xs uppercase tracking-[0.18em] text-coral">What the buyer gets</p>
          <h2 className="mt-3 text-2xl font-semibold">A fast audit that feels tangible, not theoretical</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-300">Report outcome</div>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                Clear findings around hidden exposure, denied-claim risk, and underinsured areas.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-300">Speed promise</div>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                A focused upload flow that gets policy documents into review immediately.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-300">Next move</div>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                A natural bridge into inspection booking for deeper storm-preparedness work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

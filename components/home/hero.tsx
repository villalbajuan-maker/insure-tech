export function Hero() {
  return (
    <section className="print-hide overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-card backdrop-blur md:p-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex rounded-full bg-coral/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-coral">
          Policy gap analysis prototype
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            Upload policy PDFs. Review the coverage gaps on one screen.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            This prototype is built for live collaboration with an insurance expert.
            Bring real or synthetic policy documents, run the analysis immediately,
            and discuss the report together without filling out an intake workflow.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-2xl bg-mist px-5 py-4">
              <div className="text-sm uppercase tracking-[0.16em] text-slate-500">
                Focus
              </div>
              <div className="text-2xl font-semibold">Upload and analyze</div>
            </div>
            <div className="rounded-2xl bg-sand px-5 py-4">
              <div className="text-sm uppercase tracking-[0.16em] text-slate-500">
                Current scope
              </div>
              <div className="text-2xl font-semibold">Florida residential only</div>
            </div>
          </div>
        </div>
        <div className="relative rounded-[2rem] bg-[#102033] p-6 text-white">
          <div className="absolute inset-x-6 top-0 h-px bg-white/20" />
          <p className="text-xs uppercase tracking-[0.18em] text-coral">
            Session mode
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Built for expert review calls</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-200">
            <li>Upload declarations, policy wording, and endorsements.</li>
            <li>Parse core coverage clues directly from the PDFs.</li>
            <li>Surface Florida-specific gaps with evidence notes.</li>
            <li>Keep the experience fast enough for live policy walkthroughs.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

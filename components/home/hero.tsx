export function Hero() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-card backdrop-blur md:p-12">
      <div className="max-w-3xl">
        <p className="mb-4 inline-flex rounded-full bg-coral/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-coral">
          Florida homeowners insurance review
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
          Upload a policy package. Get a Florida-focused gap analysis report.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          This MVP reviews homeowners policy documents, checks for Florida-specific
          gap categories, and produces a clear report with evidence, recommendations,
          and conservative caveats.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="rounded-2xl bg-mist px-5 py-4">
            <div className="text-sm uppercase tracking-[0.16em] text-slate-500">
              Price
            </div>
            <div className="text-2xl font-semibold">$49 per analysis</div>
          </div>
          <div className="rounded-2xl bg-sand px-5 py-4">
            <div className="text-sm uppercase tracking-[0.16em] text-slate-500">
              MVP scope
            </div>
            <div className="text-2xl font-semibold">Florida residential only</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Hero() {
  return (
    <section className="print-hide overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-card backdrop-blur md:p-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex rounded-full bg-coral/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-coral">
            Florida storm coverage audit
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            Tu seguro probablemente no cubre lo que crees.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Descubre en minutos cuánto dinero podrías perder si una tormenta golpea hoy tu casa.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#final-cta"
              className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Ver mi reporte por $49
            </a>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Sin llamadas. Sin compromiso. Resultados en minutos.
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#102033] p-6 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-coral/20 blur-2xl" />
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-300">Casa protegida</div>
              <div className="mt-3 rounded-2xl bg-emerald-400/20 p-4">
                <div className="text-lg font-semibold text-emerald-200">Cobertura clara</div>
                <div className="mt-1 text-sm text-slate-100">Gaps detectados antes del evento</div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-300">Casa golpeada</div>
              <div className="mt-3 rounded-2xl bg-red-500/20 p-4">
                <div className="text-lg font-semibold text-red-200">Claim disputado</div>
                <div className="mt-1 text-sm text-slate-100">Daño, deducible y cobertura insuficiente</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

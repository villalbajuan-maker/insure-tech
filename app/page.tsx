import { Hero } from "@/components/home/hero";
import { UploadForm } from "@/components/home/upload-form";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <Hero />

      <section className="print-hide rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          Realidad incómoda
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">
            La mayoría de propietarios está subasegurado
          </div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">
            Muchas reclamaciones se niegan por “daños preexistentes”
          </div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">
            El techo es la causa #1 de disputas
          </div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">
            El seguro NO siempre cubre inundaciones o viento
          </div>
        </div>
        <p className="mt-6 text-lg font-semibold text-ink">
          El problema no es la tormenta. Es descubrir demasiado tarde que no estás cubierto.
        </p>
      </section>

      <section className="print-hide rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          Preview del reporte
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          Esto es lo que vas a ver sobre tu propiedad
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr_1fr]">
          <article className="rounded-[2rem] bg-[#102033] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-300">
              Risk score
            </div>
            <div className="mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-full border-[14px] border-coral bg-white/5 text-center">
              <div>
                <div className="text-4xl font-semibold">72</div>
                <div className="text-sm text-slate-300">/ 100</div>
              </div>
            </div>
            <div className="mt-5 text-center text-sm text-slate-200">
              Riesgo actual: 72/100
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Gap table
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">Flood</span>
                <span className="text-sm font-semibold text-red-700">Gap</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">Roof / deductible</span>
                <span className="text-sm font-semibold text-amber-700">Watch</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">Liability</span>
                <span className="text-sm font-semibold text-emerald-700">OK</span>
              </div>
            </div>
            <div className="mt-5 text-lg font-semibold text-ink">
              $65,000 en cobertura insuficiente
            </div>
          </article>

          <article className="rounded-[2rem] bg-sand p-6">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Financial exposure
            </div>
            <div className="mt-8 text-5xl font-semibold tracking-tight text-ink">
              $84,000
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Podrías perder $84,000 en un solo evento
            </p>
          </article>
        </div>
      </section>

      <section className="print-hide rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          Propuesta clara
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          En menos de 5 minutos sabrás si tu propiedad está financieramente expuesta.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">✔ Análisis de tu póliza</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">✔ Evaluación de riesgo de tormenta</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">✔ Identificación de vacíos críticos</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">✔ Estimación de pérdida potencial</div>
        </div>
      </section>

      <section className="print-hide rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          Cómo funciona
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-[#102033] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-300">1</div>
            <div className="mt-3 text-2xl font-semibold">Ingresa tu dirección</div>
          </div>
          <div className="rounded-3xl bg-[#102033] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-300">2</div>
            <div className="mt-3 text-2xl font-semibold">Sube tu póliza (opcional)</div>
          </div>
          <div className="rounded-3xl bg-[#102033] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-300">3</div>
            <div className="mt-3 text-2xl font-semibold">Recibe tu reporte</div>
          </div>
        </div>
      </section>

      <section className="print-hide rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          Precio + decisión
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Empieza por $49 — y decide con información real, no suposiciones.
        </h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-100">
            Menos que una inspección
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-100">
            Mucho menos que un error de cobertura
          </div>
        </div>
      </section>

      <section className="print-hide rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          Reducción de fricción
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">Sin suscripción</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">Sin llamadas obligatorias</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">Información privada</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">Pago único</div>
        </div>
      </section>

      <UploadForm />
    </main>
  );
}

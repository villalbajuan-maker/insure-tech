import { Hero } from "@/components/home/hero";
import { UploadForm } from "@/components/home/upload-form";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <Hero />

      <section className="print-hide rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          Uncomfortable reality
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">
            Most homeowners are underinsured
          </div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">
            Many claims are denied because of “pre-existing damage”
          </div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">
            Roof damage is the #1 source of disputes
          </div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">
            Insurance does NOT always cover flood or wind
          </div>
        </div>
        <p className="mt-6 text-lg font-semibold text-ink">
          The problem is not the storm. It is finding out too late that you were never covered.
        </p>
      </section>

      <section className="print-hide rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          Report preview
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          This is what you will see about your property
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
              Current risk: 72/100
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
              $65,000 in uncovered exposure
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
              You could lose $84,000 in a single event
            </p>
          </article>
        </div>
      </section>

      <section className="print-hide rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          Clear value
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          In less than five minutes, you will know whether your property is financially exposed.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">✔ Policy analysis</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">✔ Storm-risk review</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">✔ Critical gap identification</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">✔ Potential loss estimate</div>
        </div>
      </section>

      <section className="print-hide rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          How it works
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-[#102033] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-300">1</div>
            <div className="mt-3 text-2xl font-semibold">Enter your address</div>
          </div>
          <div className="rounded-3xl bg-[#102033] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-300">2</div>
            <div className="mt-3 text-2xl font-semibold">Upload your policy (optional)</div>
          </div>
          <div className="rounded-3xl bg-[#102033] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-300">3</div>
            <div className="mt-3 text-2xl font-semibold">Receive your report</div>
          </div>
        </div>
      </section>

      <section className="print-hide rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          Price and decision
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Start for $49 and decide with real information, not assumptions.
        </h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-100">
            Less than an inspection
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-100">
            Far less than a coverage mistake
          </div>
        </div>
      </section>

      <section className="print-hide rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.18em] text-coral">
          Reduced friction
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">No subscription</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">No mandatory calls</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">Private information</div>
          <div className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">One-time payment</div>
        </div>
      </section>

      <UploadForm />
    </main>
  );
}

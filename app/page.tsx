import { Hero } from "@/components/home/hero";
import { UploadForm } from "@/components/home/upload-form";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <Hero />
      <UploadForm />

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Prototype posture
          </p>
          <h2 className="mt-3 text-xl font-semibold">Minimal by design</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The page is optimized for real review sessions, not for onboarding flows.
            Users only upload PDFs and inspect the report.
          </p>
        </article>
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Current domain
          </p>
          <h2 className="mt-3 text-xl font-semibold">Florida residential coverage</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The active rules focus on flood, windstorm, ordinance-or-law, sinkhole,
            valuation treatment, and deductible pressure.
          </p>
        </article>
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Demo assets
          </p>
          <h2 className="mt-3 text-xl font-semibold">Synthetic library included</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            You can still use the generated Florida west-coast policy pairs as demo
            inputs before moving into James&apos;s real policy files.
          </p>
        </article>
      </section>
    </main>
  );
}

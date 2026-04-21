import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { UploadForm } from "@/components/home/upload-form";
import { listAnalysisRequests } from "@/src/lib/repository/analysis-store";

export default function HomePage() {
  const recentAnalyses = listAnalysisRequests().slice(0, 3);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <Hero />
      <UploadForm />

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-card">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
              Prototype status
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Recent analysis requests</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            These examples come from the in-memory prototype store. The flow is ready
            for real persistence, Stripe webhooks, and OpenAI extraction.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {recentAnalyses.length === 0 ? (
            <div className="rounded-3xl bg-mist p-5 text-sm text-slate-600">
              No analysis requests yet. Create one above to exercise the flow.
            </div>
          ) : (
            recentAnalyses.map((analysis) => (
              <Link
                key={analysis.id}
                href={`/analyses/${analysis.id}`}
                className="rounded-3xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-tide"
              >
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {analysis.status.replaceAll("_", " ")}
                </div>
                <div className="mt-3 text-lg font-semibold">{analysis.intake.fullName}</div>
                <div className="mt-2 text-sm text-slate-600">
                  {analysis.intake.propertyProfile.addressLine1}
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

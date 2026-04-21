import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { AnalysisExperience } from "@/components/analysis/analysis-experience";
import type { AnalysisFlowState } from "@/src/lib/analysis/analysis-flow";
import {
  getFlowCookieName,
  resolveState
} from "@/src/lib/analysis/analysis-flow";
import {
  getFullAnalysisView,
  getAnalysisRequest,
  getSnapshotAnalysisView,
  processAnalysisRequest
} from "@/src/lib/repository/analysis-store";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    refresh?: string;
    state?: string;
  }>;
}

export default async function AnalysisPage({
  params,
  searchParams
}: AnalysisPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const existing = getAnalysisRequest(id);
  if (!existing) {
    notFound();
  }

  if (query.refresh === "1" && existing.status !== "completed") {
    await processAnalysisRequest(id);
  }

  const cookieStore = await cookies();
  const resolvedState: AnalysisFlowState = resolveState({
    requestedState: query.state,
    storedState: cookieStore.get(getFlowCookieName(id))?.value ?? null
  });

  const view =
    resolvedState === "full" || resolvedState === "execution"
      ? getFullAnalysisView(id)
      : getSnapshotAnalysisView(id);
  const request = getAnalysisRequest(id);

  if (!request) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-ink">
          Back to intake
        </Link>
        <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {request.status.replaceAll("_", " ")}
        </span>
      </div>

      {view ? (
        <AnalysisExperience
          analysis={view}
          analysisId={id}
          initialState={resolvedState}
        />
      ) : (
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <h1 className="text-3xl font-semibold">Analysis in progress</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            The uploaded PDFs are being processed. If the report is not visible yet,
            refresh the page and the prototype will retry the extraction pipeline.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={`/analysis/${id}?refresh=1`}
              className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white"
            >
              Retry analysis
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

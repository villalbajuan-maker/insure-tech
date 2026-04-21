import Link from "next/link";
import { cookies } from "next/headers";
import { AnalysisExperience } from "@/components/analysis/analysis-experience";
import type { AnalysisFlowState } from "@/src/lib/analysis/analysis-flow";
import {
  getFlowCookieName,
  resolveState
} from "@/src/lib/analysis/analysis-flow";
import {
  getAnalysisRequest,
  getComprehensiveAnalysisView,
  getExecutionAnalysisView,
  getPropertyGateAnalysisView,
  getStarterAnalysisView,
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

  if (existing && query.refresh === "1" && existing.status !== "completed") {
    await processAnalysisRequest(id);
  }

  const cookieStore = await cookies();
  const resolvedState: AnalysisFlowState = resolveState({
    requestedState: query.state,
    storedState: cookieStore.get(getFlowCookieName(id))?.value ?? null,
    hasPropertyDetails: Boolean(existing?.propertyDetails),
    comprehensiveUnlocked: existing?.comprehensivePaymentStatus === "unlocked"
  });

  const view = (() => {
    switch (resolvedState) {
      case "property_gate":
        return getPropertyGateAnalysisView(id);
      case "comprehensive":
        return getComprehensiveAnalysisView(id);
      case "execution":
        return getExecutionAnalysisView(id);
      default:
        return getStarterAnalysisView(id);
    }
  })();
  const request = existing;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-ink">
          Back to intake
        </Link>
        {request ? (
          <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {request.status.replaceAll("_", " ")}
          </span>
        ) : null}
      </div>

      <AnalysisExperience
        analysis={view}
        analysisId={id}
        initialState={resolvedState}
        initialRequest={request}
      />
    </main>
  );
}

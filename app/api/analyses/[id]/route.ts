import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getFlowCookieName, resolveState } from "@/src/lib/analysis/analysis-flow";
import {
  getFullAnalysisView,
  getAnalysisRequest,
  getSnapshotAnalysisView,
  markPaymentSucceeded,
  processAnalysisRequest
} from "@/src/lib/repository/analysis-store";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const analysisRequest = getAnalysisRequest(id);

  if (!analysisRequest) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const cookieStore = await cookies();
  const resolvedState = resolveState({
    requestedState: url.searchParams.get("state") ?? undefined,
    storedState: cookieStore.get(getFlowCookieName(id))?.value ?? null
  });
  const view =
    resolvedState === "full" || resolvedState === "execution"
      ? getFullAnalysisView(id)
      : getSnapshotAnalysisView(id);

  return NextResponse.json({
    request: analysisRequest,
    state: resolvedState,
    view
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    action?: "mark_paid" | "process";
  };

  if (body.action === "mark_paid") {
    const updated = markPaymentSucceeded(id);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ request: updated });
  }

  if (body.action === "process") {
    const processed = await processAnalysisRequest(id);
    if (!processed) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      request: processed,
      snapshotView: getSnapshotAnalysisView(id),
      fullView: getFullAnalysisView(id)
    });
  }

  return NextResponse.json(
    { error: "Unsupported action" },
    { status: 400 }
  );
}

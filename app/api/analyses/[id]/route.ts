import { NextResponse } from "next/server";
import {
  getAnalysisRequest,
  getCompletedAnalysisView,
  markPaymentSucceeded,
  processAnalysisRequest
} from "@/src/lib/repository/analysis-store";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const request = getAnalysisRequest(id);

  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const view = getCompletedAnalysisView(id);
  return NextResponse.json({
    request,
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
      view: getCompletedAnalysisView(id)
    });
  }

  return NextResponse.json(
    { error: "Unsupported action" },
    { status: 400 }
  );
}

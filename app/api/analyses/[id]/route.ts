import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getFlowCookieName, resolveState } from "@/src/lib/analysis/analysis-flow";
import {
  getComprehensiveAnalysisView,
  getExecutionAnalysisView,
  getAnalysisRequest,
  getPropertyGateAnalysisView,
  getStarterAnalysisView,
  markPaymentSucceeded,
  processAnalysisRequest
  ,
  savePropertyDetails,
  unlockComprehensiveAnalysis
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
    storedState: cookieStore.get(getFlowCookieName(id))?.value ?? null,
    hasPropertyDetails: Boolean(analysisRequest.propertyDetails),
    comprehensiveUnlocked: analysisRequest.comprehensivePaymentStatus === "unlocked"
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

  return NextResponse.json({
    request: analysisRequest,
    state: resolvedState,
    view
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    action?: "mark_paid" | "process" | "unlock_comprehensive";
    propertyDetails?: {
      address?: string;
      propertyType?: "single_family" | "condo" | "townhome" | "multifamily_small" | "other";
      occupancyType?: "owner_occupied" | "tenant_occupied" | "seasonal" | "vacant" | "mixed";
      yearBuilt?: number;
      squareFootage?: number;
      stories?: number;
      estimatedHomeValue?: number;
      estimatedReplacementValue?: number;
      roofAge?: number;
      roofType?: "shingle" | "tile" | "metal" | "flat" | "other";
      priorMajorClaim?: "yes" | "no";
      knownFloodConcern?: "yes" | "no" | "not_sure";
    };
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
      starterView: getStarterAnalysisView(id)
    });
  }

  if (body.action === "unlock_comprehensive") {
    if (!body.propertyDetails?.address || !body.propertyDetails.propertyType || !body.propertyDetails.occupancyType) {
      return NextResponse.json(
        { error: "Property address, property type, and occupancy type are required." },
        { status: 400 }
      );
    }

    const saved = savePropertyDetails(id, {
      address: body.propertyDetails.address,
      propertyType: body.propertyDetails.propertyType,
      occupancyType: body.propertyDetails.occupancyType,
      yearBuilt: body.propertyDetails.yearBuilt,
      squareFootage: body.propertyDetails.squareFootage,
      stories: body.propertyDetails.stories,
      estimatedHomeValue: body.propertyDetails.estimatedHomeValue,
      estimatedReplacementValue: body.propertyDetails.estimatedReplacementValue,
      roofAge: body.propertyDetails.roofAge,
      roofType: body.propertyDetails.roofType,
      priorMajorClaim: body.propertyDetails.priorMajorClaim,
      knownFloodConcern: body.propertyDetails.knownFloodConcern
    });

    if (!saved) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    unlockComprehensiveAnalysis(id);

    return NextResponse.json({
      request: getAnalysisRequest(id),
      comprehensiveView: getComprehensiveAnalysisView(id)
    });
  }

  return NextResponse.json(
    { error: "Unsupported action" },
    { status: 400 }
  );
}

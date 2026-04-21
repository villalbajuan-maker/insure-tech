import { NextResponse } from "next/server";
import { z } from "zod";
import { getAnalysisRequest } from "@/src/lib/repository/analysis-store";

const checkoutSchema = z.object({
  analysisId: z.string().min(3)
});

export async function POST(request: Request) {
  const body = checkoutSchema.parse(await request.json());
  const analysis = getAnalysisRequest(body.analysisId);

  if (!analysis) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    checkoutUrl: analysis.payment.checkoutUrl,
    paymentStatus: analysis.payment.status
  });
}

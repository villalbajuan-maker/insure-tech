import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportView } from "@/components/report/report-view";
import {
  getAnalysisRequest,
  getCompletedAnalysisView,
  markPaymentSucceeded,
  processAnalysisRequest
} from "@/src/lib/repository/analysis-store";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string; checkout?: string }>;
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

  if (
    query.payment === "success" ||
    (query.checkout === "demo" && existing.payment.status !== "succeeded")
  ) {
    markPaymentSucceeded(id);
    processAnalysisRequest(id);
  }

  const view = getCompletedAnalysisView(id);
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
        <ReportView analysis={view} />
      ) : (
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <h1 className="text-3xl font-semibold">Payment step ready</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            This request has been created. In the prototype, the checkout link can
            redirect back here with `?payment=success` or the demo checkout fallback.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {request.payment.checkoutUrl ? (
              <a
                href={request.payment.checkoutUrl}
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
              >
                Open checkout
              </a>
            ) : null}
            <Link
              href={`/analyses/${id}?payment=success`}
              className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white"
            >
              Simulate successful payment
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

import type { ComprehensiveAnalysisView } from "@/src/domain/florida-homeowners.types";
import type { MoneyAmount } from "@/src/domain/policy-gap-analysis.types";
import { titleCase } from "@/src/lib/utils";
import { ExportReportButton } from "@/components/report/export-report-button";

function toneStyles(tone: ComprehensiveAnalysisView["summaryCards"][number]["tone"]) {
  switch (tone) {
    case "positive":
      return "bg-emerald-50 text-emerald-700";
    case "warning":
      return "bg-amber-50 text-amber-700";
    case "danger":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function ReportView({
  analysis,
  exposureOverride,
  banner
}: {
  analysis: ComprehensiveAnalysisView;
  exposureOverride?: MoneyAmount;
  banner?: string;
}) {
  const { request } = analysis;
  const report = request.report;
  const leadDocument = request.uploadedDocuments[0]?.fileName ?? "Uploaded policy package";

  if (!report) {
    return null;
  }

  const topScenarios = [...report.scenarioExposures]
    .sort((a, b) => b.estimatedImpact.amount - a.estimatedImpact.amount)
    .slice(0, 3);

  return (
    <div className="report-print-root space-y-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-coral">
              Insurance policy gap analysis
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              {leadDocument}
            </h1>
            {report.totalExposureEstimate ? (
              <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">
                Estimated financial exposure:{" "}
                {formatCurrency(
                  (exposureOverride ?? report.totalExposureEstimate).amount,
                  (exposureOverride ?? report.totalExposureEstimate).currency
                )}
              </p>
            ) : null}
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              {report.executiveSummary}
            </p>
            {banner ? (
              <div className="mt-4 inline-flex rounded-full bg-mist px-4 py-2 text-sm font-medium text-slate-700">
                {banner}
              </div>
            ) : null}
          </div>
          <div className="rounded-3xl bg-[#102033] px-6 py-5 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-300">
              Analysis mode
            </div>
            <div className="mt-2 text-xl font-semibold">
              PDF upload
            </div>
            <div className="mt-1 text-sm text-slate-300">
              {titleCase(request.status)}
            </div>
          </div>
        </div>

        <div className="report-toolbar mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
          <ExportReportButton />
          <p className="text-sm text-slate-500">
            Opens the browser print dialog so you can save this result as a PDF.
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <h2 className="text-2xl font-semibold">Uploaded documents</h2>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
          {request.uploadedDocuments.map((document) => (
            <li key={document.id}>
              {document.fileName} · {titleCase(document.category)} ·{" "}
              {Math.max(1, Math.round(document.sizeBytes / 1024))} KB
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {analysis.summaryCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-3xl px-5 py-5 ${toneStyles(card.tone)}`}
          >
            <div className="text-xs uppercase tracking-[0.18em]">{card.label}</div>
            <div className="mt-3 text-3xl font-semibold">{card.value}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <h2 className="text-2xl font-semibold">Gap findings</h2>
          <div className="mt-6 space-y-5">
            {report.findings.length === 0 ? (
              <div className="rounded-3xl bg-emerald-50 p-5 text-sm text-emerald-700">
                No material Florida-specific gaps were detected in this prototype run.
              </div>
            ) : (
              report.findings.map((finding) => (
                <article
                  key={finding.id}
                  className="rounded-3xl border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                      {titleCase(finding.severity)}
                    </span>
                    <span className="rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-coral">
                      {titleCase(finding.findingType)}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{finding.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {finding.description}
                  </p>
                  {finding.financialImpactEstimate ? (
                    <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
                      <div className="font-semibold">Estimated impact</div>
                      <div className="mt-2 text-lg font-semibold text-ink">
                        {formatCurrency(
                          finding.financialImpactEstimate.amount,
                          finding.financialImpactEstimate.currency
                        )}
                      </div>
                    </div>
                  ) : null}
                  <div className="mt-4 rounded-2xl bg-mist px-4 py-4 text-sm text-slate-700">
                    <div className="font-semibold">Evidence notes</div>
                    <ul className="mt-2 space-y-2">
                      {finding.evidence.flatMap((item) =>
                        item.sourceReferences.map((reference, index) => (
                          <li key={`${finding.id}-${index}`}>
                            {reference.documentName}: {reference.excerpt ?? "No excerpt available"}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
            <h2 className="text-2xl font-semibold">What this could cost you</h2>
            <div className="mt-6 space-y-4">
              {topScenarios.length === 0 ? (
                <div className="rounded-3xl bg-emerald-50 p-5 text-sm text-emerald-700">
                  No economic exposure scenarios were generated in this run.
                </div>
              ) : (
                topScenarios.map((scenario) => (
                  <article key={scenario.id} className="rounded-3xl bg-mist p-5">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {scenario.label}
                    </div>
                    <div className="mt-3 text-3xl font-semibold text-ink">
                      {formatCurrency(
                        scenario.estimatedImpact.amount,
                        scenario.estimatedImpact.currency
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {scenario.basis}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
            <h2 className="text-2xl font-semibold">Recommendations</h2>
            <div className="mt-6 space-y-4">
              {report.recommendations.map((recommendation) => (
                <article key={recommendation.id} className="rounded-3xl bg-sand p-5">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {titleCase(recommendation.priority)} priority
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {recommendation.rationale}
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-900">
                    Expected outcome: {recommendation.expectedOutcome}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
            <h2 className="text-2xl font-semibold">Methodology</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-200">
              {report.methodologyNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <div className="mt-6 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                Assumptions used
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
                {report.assumptionsUsed.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

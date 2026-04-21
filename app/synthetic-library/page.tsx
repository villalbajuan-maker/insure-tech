import { getSyntheticLibrary, evaluateSyntheticScenario } from "@/src/lib/demo/synthetic-library";
import { titleCase } from "@/src/lib/utils";

export default function SyntheticLibraryPage() {
  const library = getSyntheticLibrary();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.18em] text-coral">
          Synthetic policy library
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Florida west-coast synthetic homeowners collection
        </h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
          This library contains carefully authored synthetic policy scenarios designed to
          resemble plausible residential policy packages across the west coast of Florida,
          from Hernando through Collier. Each case includes a structured snapshot and is
          run through the current rules engine below.
        </p>
      </section>

      <section className="grid gap-6">
        {library.cases.map((caseItem) => {
          const report = evaluateSyntheticScenario(caseItem);
          return (
            <article
              key={caseItem.id}
              className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                    {caseItem.county} County
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">{caseItem.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                    {caseItem.risk_posture}
                  </p>
                </div>
                <div className="rounded-3xl bg-[#102033] px-5 py-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-300">
                    Findings
                  </div>
                  <div className="mt-2 text-3xl font-semibold">
                    {report.findings.length}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div className="rounded-3xl bg-mist p-5">
                  <div className="text-sm font-semibold text-ink">Declarations highlights</div>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                    <li>Carrier: {caseItem.declarations.carrier_name}</li>
                    <li>Form: {caseItem.declarations.policy_form}</li>
                    <li>Coverage A: ${caseItem.declarations.coverage_a_dwelling.toLocaleString()}</li>
                    <li>
                      Ordinance or law: {caseItem.declarations.ordinance_or_law_percent}% of Coverage A
                    </li>
                    <li>
                      Hurricane deductible: {caseItem.declarations.hurricane_deductible_percent}% of Coverage A
                    </li>
                    <li>Sinkhole: {caseItem.declarations.sinkhole_status}</li>
                  </ul>
                </div>

                <div className="rounded-3xl bg-sand p-5">
                  <div className="text-sm font-semibold text-ink">Computed findings</div>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                    {report.findings.map((finding) => (
                      <li key={finding.id}>
                        {titleCase(finding.severity)}: {finding.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 p-5">
                <div className="text-sm font-semibold text-ink">Expected findings baseline</div>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                  {caseItem.expected_findings.map((finding) => (
                    <li key={finding}>{finding}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

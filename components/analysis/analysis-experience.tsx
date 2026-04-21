"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReportView } from "@/components/report/report-view";
import type { CompletedAnalysisView } from "@/src/domain/florida-homeowners.types";
import {
  type AnalysisRefineStage,
  type AnalysisSessionState,
  type AnalysisViewMode,
  computeLocationFactor,
  extractAddressFromText,
  getBaseExposure,
  getHighestImpactScenario,
  getTopFindings,
  getTopScenarios
} from "@/src/lib/analysis/analysis-experience";
import { formatCurrency, titleCase } from "@/src/lib/utils";

interface AnalysisExperienceProps {
  analysis: CompletedAnalysisView;
  analysisId: string;
  initialView: AnalysisViewMode;
  initialStage: AnalysisRefineStage;
}

const sessionKeyPrefix = "analysis-session";

function buildDefaultState(analysis: CompletedAnalysisView): AnalysisSessionState {
  return {
    address: null,
    addressSource: null,
    refinementApplied: false,
    baseExposure: getBaseExposure(analysis),
    refinedExposure: null
  };
}

function findAddressPrefill(analysis: CompletedAnalysisView): string | null {
  const combinedText = analysis.request.uploadedDocuments
    .map((document) => document.extractedText ?? "")
    .join("\n\n");

  return extractAddressFromText(combinedText);
}

export function AnalysisExperience({
  analysis,
  analysisId,
  initialView,
  initialStage
}: AnalysisExperienceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const report = analysis.request.report;
  const sessionKey = `${sessionKeyPrefix}:${analysisId}`;
  const [sessionState, setSessionState] = useState<AnalysisSessionState>(() =>
    buildDefaultState(analysis)
  );
  const [addressInput, setAddressInput] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  const baseExposure = sessionState.baseExposure;
  const displayExposure =
    initialView === "full" && sessionState.refinedExposure
      ? sessionState.refinedExposure
      : sessionState.baseExposure;
  const primaryScenario = getHighestImpactScenario(analysis);
  const snapshotFindings = getTopFindings(analysis, 2);
  const expandedScenarios = getTopScenarios(analysis, 3);
  const prefilledAddress = useMemo(() => findAddressPrefill(analysis), [analysis]);

  useEffect(() => {
    const stored = sessionStorage.getItem(sessionKey);
    const defaultState = buildDefaultState(analysis);
    if (!stored) {
      setSessionState(defaultState);
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<AnalysisSessionState>;
      setSessionState({
        ...defaultState,
        ...parsed,
        baseExposure: defaultState.baseExposure
      });
    } catch {
      setSessionState(defaultState);
    } finally {
      setIsHydrated(true);
    }
  }, [analysis, sessionKey]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    sessionStorage.setItem(sessionKey, JSON.stringify(sessionState));
  }, [isHydrated, sessionKey, sessionState]);

  useEffect(() => {
    if (!isHydrated || initialView !== "refine" || sessionState.address) {
      return;
    }

    if (prefilledAddress) {
      setSessionState((current) => ({
        ...current,
        address: prefilledAddress,
        addressSource: "pdf"
      }));
      setAddressInput(prefilledAddress);
    }
  }, [initialView, isHydrated, prefilledAddress, sessionState.address]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (sessionState.address) {
      setAddressInput(sessionState.address);
    }
  }, [isHydrated, sessionState.address]);

  useEffect(() => {
    if (
      !isHydrated ||
      initialView !== "refine" ||
      initialStage !== "recalc" ||
      !sessionState.address
    ) {
      return;
    }

    const factor = computeLocationFactor(sessionState.address);
    const refinedExposure = Math.round(sessionState.baseExposure * factor);

    if (
      sessionState.refinementApplied &&
      sessionState.refinedExposure === refinedExposure
    ) {
      return;
    }

    setSessionState((current) => ({
      ...current,
      refinementApplied: true,
      refinedExposure
    }));
  }, [initialStage, initialView, isHydrated, sessionState]);

  if (!report) {
    return null;
  }

  function updateRoute(view: AnalysisViewMode, stage?: AnalysisRefineStage) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("view", view);
    if (view === "refine" && stage) {
      next.set("stage", stage);
    } else {
      next.delete("stage");
    }

    router.push(`${pathname}?${next.toString()}` as Route);
  }

  function handleAddressSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextAddress = addressInput.trim();
    if (!nextAddress) {
      return;
    }

    const source =
      prefilledAddress && nextAddress === prefilledAddress ? "pdf" : "user";

    setSessionState((current) => ({
      ...current,
      address: nextAddress,
      addressSource: source,
      refinementApplied: false,
      refinedExposure: null
    }));

    updateRoute("refine", "recalc");
  }

  function renderSnapshot() {
    return (
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.18em] text-coral">
            Snapshot
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-ink">
            Your property may be exposed to{" "}
            {formatCurrency(baseExposure, "USD")} in uncovered losses
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            This estimate does NOT yet include your property&apos;s specific location risk.
          </p>
        </section>

        {primaryScenario ? (
          <section className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
            <p className="text-xs uppercase tracking-[0.18em] text-coral">
              Primary scenario
            </p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-semibold">{primaryScenario.label}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                  {primaryScenario.basis}
                </p>
              </div>
              <div className="text-4xl font-semibold">
                {formatCurrency(
                  primaryScenario.estimatedImpact.amount,
                  primaryScenario.estimatedImpact.currency
                )}
              </div>
            </div>
          </section>
        ) : null}

        <section className="grid gap-5 md:grid-cols-2">
          {snapshotFindings.map((finding) => (
            <article
              key={finding.id}
              className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-card"
            >
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {titleCase(finding.severity)}
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-ink">
                {finding.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {finding.description}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              This estimate does NOT yet include your property&apos;s specific location risk.
            </p>
            <button
              type="button"
              onClick={() => updateRoute("refine", "entry")}
              className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Refine my analysis
            </button>
          </div>
        </section>
      </div>
    );
  }

  function renderRefineEntry() {
    return (
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.18em] text-coral">
          Refine analysis
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Enter your property address to refine your exposure
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          We will use a simple Florida location heuristic to adjust your exposure and
          make the result more specific before showing the full analysis.
        </p>

        <form onSubmit={handleAddressSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-slate-800">
            Property address
            <input
              value={addressInput}
              onChange={(event) => setAddressInput(event.currentTarget.value)}
              placeholder="123 Main St, Tampa, FL 33602"
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base outline-none transition focus:border-tide"
            />
          </label>

          {sessionState.addressSource === "pdf" && prefilledAddress ? (
            <p className="text-sm text-slate-500">
              We prefilled this from the uploaded policy documents. You can confirm or edit it.
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Update my exposure
          </button>
        </form>
      </section>
    );
  }

  function renderRecalculation() {
    const refinedExposure = sessionState.refinedExposure ?? sessionState.baseExposure;

    return (
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.18em] text-coral">
            Recalculated exposure
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
            Your updated exposure based on location:{" "}
            {formatCurrency(refinedExposure, "USD")}
          </h1>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-mist p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Initial estimate
              </div>
              <div className="mt-3 text-3xl font-semibold text-ink">
                {formatCurrency(sessionState.baseExposure, "USD")}
              </div>
            </div>
            <div className="rounded-3xl bg-sand p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Adjusted for your location
              </div>
              <div className="mt-3 text-3xl font-semibold text-ink">
                {formatCurrency(refinedExposure, "USD")}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
          <h2 className="text-2xl font-semibold">Why it changed</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
            Homes closer to the coast or in higher-risk Florida regions typically
            experience higher loss severity during storm events.
          </p>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-ink">Expanded scenarios</h2>
          <div className="mt-6 space-y-4">
            {expandedScenarios.map((scenario) => (
              <article key={scenario.id} className="rounded-3xl bg-mist p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {scenario.label}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {scenario.basis}
                    </p>
                  </div>
                  <div className="text-2xl font-semibold text-ink">
                    {formatCurrency(
                      scenario.estimatedImpact.amount,
                      scenario.estimatedImpact.currency
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => updateRoute("full")}
              className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Unlock full analysis
            </button>
          </div>
        </section>
      </div>
    );
  }

  function renderExecutionBlock() {
    return (
      <section className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
        <p className="text-sm uppercase tracking-[0.18em] text-coral">
          Execution
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          We can verify and fix this before it costs you
        </h2>
        <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-200">
          <li>On-site inspection</li>
          <li>Roof and structure validation</li>
          <li>Coverage alignment check</li>
          <li>Pre-claim documentation</li>
        </ul>
        <div className="mt-8">
          <button
            type="button"
            className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100"
          >
            Schedule inspection
          </button>
        </div>
      </section>
    );
  }

  function renderFull() {
    const totalExposure = sessionState.refinedExposure ?? sessionState.baseExposure;

    return (
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.18em] text-coral">
            Full analysis
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
            Total estimated exposure: {formatCurrency(totalExposure, "USD")}
          </h1>
          <div className="mt-5 inline-flex rounded-full bg-mist px-4 py-2 text-sm font-medium text-slate-700">
            Includes location-adjusted estimate
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-ink">Why this happens</h2>
          <div className="mt-6 space-y-4">
            {analysis.request.report?.findings.map((finding) => (
              <article key={finding.id} className="rounded-3xl bg-mist p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      {finding.title}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {finding.description}
                    </p>
                  </div>
                  {finding.financialImpactEstimate ? (
                    <div className="text-2xl font-semibold text-ink">
                      {formatCurrency(
                        finding.financialImpactEstimate.amount,
                        finding.financialImpactEstimate.currency
                      )}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <ReportView
          analysis={analysis}
          exposureOverride={{
            amount: totalExposure,
            currency: analysis.request.report?.totalExposureEstimate?.currency ?? "USD"
          }}
          banner={
            sessionState.refinementApplied ? "Includes location-adjusted estimate" : undefined
          }
        />

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-coral">
                Next step
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                Get a full protection plan
              </h2>
            </div>
            <button
              type="button"
              className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Get a full protection plan
            </button>
          </div>
        </section>

        {renderExecutionBlock()}
      </div>
    );
  }

  if (initialView === "full") {
    return renderFull();
  }

  if (initialView === "refine") {
    return initialStage === "recalc" ? renderRecalculation() : renderRefineEntry();
  }

  return renderSnapshot();
}

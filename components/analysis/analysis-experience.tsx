"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AnalysisRequest } from "@/src/domain/florida-homeowners.types";
import type {
  ComprehensiveAnalysisView,
  ExecutionAnalysisView,
  OccupancyType,
  PropertyGateView,
  PropertyType,
  RoofType,
  StarterAnalysisView
} from "@/src/domain/florida-homeowners.types";
import { loadCachedAnalysis, saveCachedAnalysis } from "@/src/lib/analysis/analysis-client-store";
import { type AnalysisSessionState, getBaseExposure } from "@/src/lib/analysis/analysis-experience";
import {
  getFlowCookieName,
  getNextFlowState,
  parseRequestedState,
  resolveState,
  type AnalysisFlowState
} from "@/src/lib/analysis/analysis-flow";
import {
  buildComprehensiveView,
  buildExecutionView,
  buildPropertyGateView,
  buildStarterView
} from "@/src/lib/analysis/analysis-view-builders";
import { ComprehensiveStateView } from "@/components/analysis/states/full-state-view";
import {
  type PropertyGateFormState,
  PropertyGateStateView
} from "@/components/analysis/states/refine-input-state-view";
import { StarterStateView } from "@/components/analysis/states/snapshot-state-view";
import { ExecutionStateView } from "@/components/analysis/states/execution-state-view";

interface AnalysisExperienceProps {
  analysis:
    | StarterAnalysisView
    | PropertyGateView
    | ComprehensiveAnalysisView
    | ExecutionAnalysisView
    | null;
  analysisId: string;
  initialState: AnalysisFlowState;
  initialRequest: AnalysisRequest | null;
}

const sessionKeyPrefix = "analysis-session";

function buildDefaultSessionState(
  analysis: StarterAnalysisView | PropertyGateView | ComprehensiveAnalysisView | ExecutionAnalysisView | null,
  analysisId: string
): AnalysisSessionState {
  if (!analysis) {
    return {
      propertyGateStarted: false,
      baseExposure: 0
    };
  }

  if (analysis.kind === "starter") {
    return {
      propertyGateStarted: false,
      baseExposure: getBaseExposure(analysis)
    };
  }

  if (analysis.kind === "property_gate") {
    return {
      propertyGateStarted: true,
      baseExposure: analysis.starterExposure?.amount ?? 0
    };
  }

  return {
    propertyGateStarted: true,
    baseExposure:
      analysis.kind === "execution"
        ? 0
        : (analysis.displayExposure?.amount ??
          analysis.request.report?.totalExposureEstimate?.amount ??
          0)
  };
}

function buildInitialFormState(view: PropertyGateView | null): PropertyGateFormState {
  const details = view?.propertyDetails ?? {};
  return {
    address: details.address ?? view?.prefilledAddress ?? "",
    propertyType: details.propertyType ?? "single_family",
    occupancyType: details.occupancyType ?? "owner_occupied",
    yearBuilt: details.yearBuilt ? String(details.yearBuilt) : "",
    squareFootage: details.squareFootage ? String(details.squareFootage) : "",
    stories: details.stories ? String(details.stories) : "",
    estimatedHomeValue: details.estimatedHomeValue
      ? String(details.estimatedHomeValue)
      : "",
    estimatedReplacementValue: details.estimatedReplacementValue
      ? String(details.estimatedReplacementValue)
      : "",
    roofAge: details.roofAge ? String(details.roofAge) : "",
    roofType: details.roofType ?? "shingle",
    priorMajorClaim: details.priorMajorClaim ?? "no",
    knownFloodConcern: details.knownFloodConcern ?? "not_sure"
  };
}

export function AnalysisExperience({
  analysis,
  analysisId,
  initialState,
  initialRequest
}: AnalysisExperienceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cookieName = getFlowCookieName(analysisId);
  const sessionKey = `${sessionKeyPrefix}:${analysisId}`;
  const [requestState, setRequestState] = useState<AnalysisRequest | null>(
    initialRequest ?? null
  );
  const [sessionState, setSessionState] = useState<AnalysisSessionState>(() =>
    buildDefaultSessionState(analysis, analysisId)
  );
  const [propertyGateForm, setPropertyGateForm] = useState<PropertyGateFormState>(() =>
    buildInitialFormState(analysis?.kind === "property_gate" ? analysis : null)
  );
  const [isSubmitting, startTransition] = useTransition();

  useEffect(() => {
    const restored = initialRequest ?? loadCachedAnalysis(analysisId);
    if (restored) {
      setRequestState(restored);
      saveCachedAnalysis(restored);
    }
  }, [analysisId, initialRequest]);

  const effectiveState = useMemo(() => {
    const requestedState = parseRequestedState(searchParams.get("state") ?? initialState);
    return resolveState({
      requestedState,
      storedState: requestedState,
      hasPropertyDetails: Boolean(requestState?.propertyDetails),
      comprehensiveUnlocked: requestState?.comprehensivePaymentStatus === "unlocked"
    });
  }, [initialState, requestState?.comprehensivePaymentStatus, requestState?.propertyDetails, searchParams]);

  const activeAnalysis = useMemo(() => {
    if (!requestState) {
      return analysis;
    }

    switch (effectiveState) {
      case "property_gate":
        return buildPropertyGateView(requestState);
      case "comprehensive":
        return buildComprehensiveView(requestState);
      case "execution":
        return buildExecutionView(requestState);
      default:
        return buildStarterView(requestState);
    }
  }, [analysis, effectiveState, requestState]);

  useEffect(() => {
    const defaultState = buildDefaultSessionState(activeAnalysis, analysisId);
    const stored = sessionStorage.getItem(sessionKey);
    if (!stored) {
      setSessionState(defaultState);
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
    }
  }, [activeAnalysis, analysisId, sessionKey]);

  useEffect(() => {
    if (activeAnalysis?.kind === "property_gate") {
      setPropertyGateForm(buildInitialFormState(activeAnalysis));
    }
  }, [activeAnalysis]);

  useEffect(() => {
    sessionStorage.setItem(sessionKey, JSON.stringify(sessionState));
  }, [sessionKey, sessionState]);

  function persistReachedState(state: AnalysisFlowState) {
    document.cookie = `${cookieName}=${state}; path=/; SameSite=Lax`;
  }

  function goToState(state: AnalysisFlowState) {
    persistReachedState(state);
    const next = new URLSearchParams(searchParams.toString());
    next.set("state", state);
    router.push(`${pathname}?${next.toString()}` as Route);
  }

  function handlePropertyFieldChange(field: keyof PropertyGateFormState, value: string) {
    setPropertyGateForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function parseOptionalNumber(value: string): number | undefined {
    const normalized = value.trim();
    if (!normalized) {
      return undefined;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  function handlePropertyGateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      if (!requestState) {
        return;
      }

      const updatedRequest: AnalysisRequest = {
        ...requestState,
        propertyDetails: {
          address: propertyGateForm.address,
          propertyType: propertyGateForm.propertyType as PropertyType,
          occupancyType: propertyGateForm.occupancyType as OccupancyType,
          yearBuilt: parseOptionalNumber(propertyGateForm.yearBuilt),
          squareFootage: parseOptionalNumber(propertyGateForm.squareFootage),
          stories: parseOptionalNumber(propertyGateForm.stories),
          estimatedHomeValue: parseOptionalNumber(propertyGateForm.estimatedHomeValue),
          estimatedReplacementValue: parseOptionalNumber(
            propertyGateForm.estimatedReplacementValue
          ),
          roofAge: parseOptionalNumber(propertyGateForm.roofAge),
          roofType: propertyGateForm.roofType as RoofType,
          priorMajorClaim: propertyGateForm.priorMajorClaim,
          knownFloodConcern: propertyGateForm.knownFloodConcern
        },
        comprehensivePaymentStatus: "unlocked",
        comprehensiveUnlockedAt: new Date().toISOString()
      };
      const response = await fetch(`/api/analyses/${analysisId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "unlock_comprehensive",
          requestSnapshot: updatedRequest,
          propertyDetails: updatedRequest.propertyDetails
        })
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { request?: AnalysisRequest | null };
      const nextRequest = payload.request ?? updatedRequest;

      setRequestState(nextRequest);
      saveCachedAnalysis(nextRequest);
      persistReachedState("comprehensive");
      router.push(`${pathname}?state=comprehensive` as Route);
    });
  }

  function advanceState() {
    const nextState = getNextFlowState(effectiveState);
    if (nextState) {
      goToState(nextState);
    }
  }

  if (!activeAnalysis) {
    return (
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <h1 className="text-3xl font-semibold">Analysis not available</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          This prototype could not restore the analysis in the current browser session.
          Please upload the policy package again to restart the flow.
        </p>
      </section>
    );
  }

  if (effectiveState === "starter") {
    if (activeAnalysis.kind !== "starter") {
      return null;
    }

    return (
      <StarterStateView
        analysis={activeAnalysis}
        exposure={sessionState.baseExposure}
        onContinue={() => {
          setSessionState((current) => ({
            ...current,
            propertyGateStarted: true
          }));
          goToState("property_gate");
        }}
      />
    );
  }

  if (effectiveState === "property_gate") {
    if (activeAnalysis.kind !== "property_gate") {
      return null;
    }

    return (
      <PropertyGateStateView
        analysis={activeAnalysis}
        formState={propertyGateForm}
        onChange={handlePropertyFieldChange}
        onSubmit={handlePropertyGateSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (effectiveState === "comprehensive") {
    if (activeAnalysis.kind !== "comprehensive") {
      return null;
    }

    return <ComprehensiveStateView analysis={activeAnalysis} onContinue={advanceState} />;
  }

  if (activeAnalysis.kind !== "execution") {
    return null;
  }

  return <ExecutionStateView analysis={activeAnalysis} />;
}

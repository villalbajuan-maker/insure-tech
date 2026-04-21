"use client";

import { useEffect, useState, useTransition } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  ComprehensiveAnalysisView,
  ExecutionAnalysisView,
  OccupancyType,
  PropertyGateView,
  PropertyType,
  RoofType,
  StarterAnalysisView
} from "@/src/domain/florida-homeowners.types";
import { type AnalysisSessionState, getBaseExposure } from "@/src/lib/analysis/analysis-experience";
import {
  getFlowCookieName,
  getNextFlowState,
  type AnalysisFlowState
} from "@/src/lib/analysis/analysis-flow";
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
    | ExecutionAnalysisView;
  analysisId: string;
  initialState: AnalysisFlowState;
}

const sessionKeyPrefix = "analysis-session";

function buildDefaultSessionState(
  analysis: StarterAnalysisView | PropertyGateView | ComprehensiveAnalysisView | ExecutionAnalysisView
): AnalysisSessionState {
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

function buildInitialFormState(view: PropertyGateView): PropertyGateFormState {
  const details = view.propertyDetails ?? {};
  return {
    address: details.address ?? view.prefilledAddress ?? "",
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
  initialState
}: AnalysisExperienceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cookieName = getFlowCookieName(analysisId);
  const sessionKey = `${sessionKeyPrefix}:${analysisId}`;
  const [sessionState, setSessionState] = useState<AnalysisSessionState>(() =>
    buildDefaultSessionState(analysis)
  );
  const [propertyGateForm, setPropertyGateForm] = useState<PropertyGateFormState>(() =>
    analysis.kind === "property_gate"
      ? buildInitialFormState(analysis)
      : {
          address: "",
          propertyType: "single_family",
          occupancyType: "owner_occupied",
          yearBuilt: "",
          squareFootage: "",
          stories: "",
          estimatedHomeValue: "",
          estimatedReplacementValue: "",
          roofAge: "",
          roofType: "shingle",
          priorMajorClaim: "no",
          knownFloodConcern: "not_sure"
        }
  );
  const [isSubmitting, startTransition] = useTransition();

  useEffect(() => {
    const stored = sessionStorage.getItem(sessionKey);
    const defaultState = buildDefaultSessionState(analysis);
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
  }, [analysis, sessionKey]);

  useEffect(() => {
    if (analysis.kind === "property_gate") {
      setPropertyGateForm(buildInitialFormState(analysis));
    }
  }, [analysis]);

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
      const response = await fetch(`/api/analyses/${analysisId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "unlock_comprehensive",
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
          }
        })
      });

      if (!response.ok) {
        return;
      }

      persistReachedState("comprehensive");
      router.push(`${pathname}?state=comprehensive` as Route);
    });
  }

  function advanceState() {
    const nextState = getNextFlowState(initialState);
    if (nextState) {
      goToState(nextState);
    }
  }

  if (initialState === "starter") {
    if (analysis.kind !== "starter") {
      return null;
    }

    return (
      <StarterStateView
        analysis={analysis}
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

  if (initialState === "property_gate") {
    if (analysis.kind !== "property_gate") {
      return null;
    }

    return (
      <PropertyGateStateView
        analysis={analysis}
        formState={propertyGateForm}
        onChange={handlePropertyFieldChange}
        onSubmit={handlePropertyGateSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (initialState === "comprehensive") {
    if (analysis.kind !== "comprehensive") {
      return null;
    }

    return <ComprehensiveStateView analysis={analysis} onContinue={advanceState} />;
  }

  if (analysis.kind !== "execution") {
    return null;
  }

  return <ExecutionStateView analysis={analysis} />;
}

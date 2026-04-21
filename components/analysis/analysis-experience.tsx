"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type FullAnalysisView,
  type SnapshotAnalysisView
} from "@/src/domain/florida-homeowners.types";
import {
  type AnalysisSessionState,
  computeLocationFactor,
  getBaseExposure
} from "@/src/lib/analysis/analysis-experience";
import {
  getFlowCookieName,
  getNextFlowState,
  type AnalysisFlowState
} from "@/src/lib/analysis/analysis-flow";
import { ExecutionStateView } from "@/components/analysis/states/execution-state-view";
import { FullStateView } from "@/components/analysis/states/full-state-view";
import { RefineInputStateView } from "@/components/analysis/states/refine-input-state-view";
import { RefineResultStateView } from "@/components/analysis/states/refine-result-state-view";
import { SnapshotStateView } from "@/components/analysis/states/snapshot-state-view";

interface AnalysisExperienceProps {
  analysis: SnapshotAnalysisView | FullAnalysisView;
  analysisId: string;
  initialState: AnalysisFlowState;
}

const sessionKeyPrefix = "analysis-session";

function buildDefaultState(
  analysis: SnapshotAnalysisView | FullAnalysisView
): AnalysisSessionState {
  return {
    address: null,
    addressSource: null,
    refinementApplied: false,
    baseExposure: getBaseExposure(analysis),
    refinedExposure: null
  };
}

function findPrefilledAddress(
  analysis: SnapshotAnalysisView | FullAnalysisView
): string | null {
  return analysis.kind === "snapshot" ? analysis.derivedAddress : null;
}

export function AnalysisExperience({
  analysis,
  analysisId,
  initialState
}: AnalysisExperienceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionKey = `${sessionKeyPrefix}:${analysisId}`;
  const cookieName = getFlowCookieName(analysisId);
  const [sessionState, setSessionState] = useState<AnalysisSessionState>(() =>
    buildDefaultState(analysis)
  );
  const [addressInput, setAddressInput] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  const prefilledAddress = useMemo(() => findPrefilledAddress(analysis), [analysis]);
  const currentExposure = sessionState.refinedExposure ?? sessionState.baseExposure;

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
    if (!isHydrated) {
      return;
    }

    if (sessionState.address) {
      setAddressInput(sessionState.address);
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
  }, [isHydrated, prefilledAddress, sessionState.address]);

  function persistReachedState(state: AnalysisFlowState) {
    document.cookie = `${cookieName}=${state}; path=/; SameSite=Lax`;
  }

  function goToState(state: AnalysisFlowState) {
    persistReachedState(state);
    const next = new URLSearchParams(searchParams.toString());
    next.set("state", state);
    router.push(`${pathname}?${next.toString()}` as Route);
  }

  function advanceState() {
    const nextState = getNextFlowState(initialState);
    if (nextState) {
      goToState(nextState);
    }
  }

  function handleAddressSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextAddress = addressInput.trim();
    if (!nextAddress) {
      return;
    }

    const source =
      prefilledAddress && nextAddress === prefilledAddress ? "pdf" : "user";
    const refinedExposure = Math.round(
      sessionState.baseExposure * computeLocationFactor(nextAddress)
    );

    setSessionState((current) => ({
      ...current,
      address: nextAddress,
      addressSource: source,
      refinementApplied: true,
      refinedExposure
    }));

    goToState("refine_result");
  }

  if (initialState === "snapshot") {
    if (analysis.kind !== "snapshot") {
      return null;
    }

    return (
      <SnapshotStateView
        analysis={analysis}
        exposure={sessionState.baseExposure}
        onRefine={() => goToState("refine_input")}
      />
    );
  }

  if (initialState === "refine_input") {
    return (
      <RefineInputStateView
        addressInput={addressInput}
        prefilledFromPdf={Boolean(prefilledAddress)}
        onAddressChange={setAddressInput}
        onSubmit={handleAddressSubmit}
      />
    );
  }

  if (initialState === "refine_result") {
    if (analysis.kind !== "snapshot") {
      return null;
    }

    return (
      <RefineResultStateView
        analysis={analysis}
        baseExposure={sessionState.baseExposure}
        refinedExposure={currentExposure}
        onUnlockFull={() => goToState("full")}
      />
    );
  }

  if (initialState === "full") {
    if (analysis.kind !== "full") {
      return null;
    }

    return (
      <FullStateView
        analysis={analysis}
        totalExposure={currentExposure}
        refinementApplied={sessionState.refinementApplied}
        onContinue={advanceState}
      />
    );
  }

  return <ExecutionStateView />;
}

export type AnalysisFlowState =
  | "starter"
  | "property_gate"
  | "comprehensive"
  | "execution";

const stateOrder: AnalysisFlowState[] = [
  "starter",
  "property_gate",
  "comprehensive",
  "execution"
];

function getStateIndex(state: AnalysisFlowState): number {
  return stateOrder.indexOf(state);
}

export function parseRequestedState(value?: string): AnalysisFlowState {
  if (value === "property_gate" || value === "comprehensive" || value === "execution") {
    return value;
  }

  return "starter";
}

export function getFlowCookieName(analysisId: string): string {
  return `analysis-flow-${analysisId}`;
}

export function resolveState(params: {
  requestedState?: string;
  storedState?: string | null;
  hasPropertyDetails?: boolean;
  comprehensiveUnlocked?: boolean;
}): AnalysisFlowState {
  const requestedState = parseRequestedState(params.requestedState);

  if (requestedState === "starter") {
    return "starter";
  }

  const storedState = params.storedState
    ? parseRequestedState(params.storedState)
    : "starter";

  if (requestedState === "property_gate") {
    return "property_gate";
  }

  if (requestedState === "comprehensive") {
    if (params.hasPropertyDetails && params.comprehensiveUnlocked) {
      return "comprehensive";
    }

    return "starter";
  }

  if (requestedState === "execution") {
    if (params.hasPropertyDetails && params.comprehensiveUnlocked && getStateIndex(storedState) >= getStateIndex("comprehensive")) {
      return "execution";
    }

    return "starter";
  }

  return "starter";
}

export function getNextFlowState(
  currentState: AnalysisFlowState
): AnalysisFlowState | null {
  switch (currentState) {
    case "starter":
      return "property_gate";
    case "property_gate":
      return "comprehensive";
    case "comprehensive":
      return "execution";
    default:
      return null;
  }
}

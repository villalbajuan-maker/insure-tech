export type AnalysisFlowState =
  | "snapshot"
  | "refine_input"
  | "refine_result"
  | "full"
  | "execution";

const stateOrder: AnalysisFlowState[] = [
  "snapshot",
  "refine_input",
  "refine_result",
  "full",
  "execution"
];

function getStateIndex(state: AnalysisFlowState): number {
  return stateOrder.indexOf(state);
}

export function parseRequestedState(value?: string): AnalysisFlowState {
  if (
    value === "refine_input" ||
    value === "refine_result" ||
    value === "full" ||
    value === "execution"
  ) {
    return value;
  }

  return "snapshot";
}

export function getFlowCookieName(analysisId: string): string {
  return `analysis-flow-${analysisId}`;
}

export function resolveState(params: {
  requestedState?: string;
  storedState?: string | null;
}): AnalysisFlowState {
  const requestedState = parseRequestedState(params.requestedState);

  if (requestedState === "snapshot") {
    return "snapshot";
  }

  const storedState = params.storedState
    ? parseRequestedState(params.storedState)
    : "snapshot";

  if (getStateIndex(storedState) >= getStateIndex(requestedState)) {
    return requestedState;
  }

  return "snapshot";
}

export function getNextFlowState(
  currentState: AnalysisFlowState
): AnalysisFlowState | null {
  switch (currentState) {
    case "snapshot":
      return "refine_input";
    case "refine_input":
      return "refine_result";
    case "refine_result":
      return "full";
    case "full":
      return "execution";
    default:
      return null;
  }
}

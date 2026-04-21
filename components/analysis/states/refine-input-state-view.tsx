"use client";

import type {
  OccupancyType,
  PropertyGateView,
  PropertyType,
  RoofType
} from "@/src/domain/florida-homeowners.types";

export interface PropertyGateFormState {
  address: string;
  propertyType: PropertyType;
  occupancyType: OccupancyType;
  yearBuilt: string;
  squareFootage: string;
  stories: string;
  estimatedHomeValue: string;
  estimatedReplacementValue: string;
  roofAge: string;
  roofType: RoofType;
  priorMajorClaim: "yes" | "no";
  knownFloodConcern: "yes" | "no" | "not_sure";
}

interface PropertyGateStateViewProps {
  analysis: PropertyGateView;
  formState: PropertyGateFormState;
  onChange: (field: keyof PropertyGateFormState, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

const propertyTypeOptions: Array<{ value: PropertyType; label: string }> = [
  { value: "single_family", label: "Single-family" },
  { value: "condo", label: "Condo" },
  { value: "townhome", label: "Townhome" },
  { value: "multifamily_small", label: "Small multifamily" },
  { value: "other", label: "Other" }
];

const occupancyOptions: Array<{ value: OccupancyType; label: string }> = [
  { value: "owner_occupied", label: "Owner-occupied" },
  { value: "tenant_occupied", label: "Tenant-occupied" },
  { value: "seasonal", label: "Seasonal" },
  { value: "vacant", label: "Vacant" },
  { value: "mixed", label: "Mixed" }
];

const roofTypeOptions: Array<{ value: RoofType; label: string }> = [
  { value: "shingle", label: "Shingle" },
  { value: "tile", label: "Tile" },
  { value: "metal", label: "Metal" },
  { value: "flat", label: "Flat" },
  { value: "other", label: "Other" }
];

export function PropertyGateStateView({
  analysis,
  formState,
  onChange,
  onSubmit,
  isSubmitting
}: PropertyGateStateViewProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.18em] text-coral">Complete your full property analysis</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          We found a meaningful exposure signal in your policy. Now we need the property context.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Your uploaded policy tells us part of the story. To estimate exposure more accurately, we also need property-specific details such as location, home characteristics, and replacement context.
        </p>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <h2 className="text-2xl font-semibold text-ink">What you unlock next</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {analysis.unlockValueBullets.map((item) => (
            <div key={item} className="rounded-3xl bg-mist p-5 text-sm leading-7 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Property details</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              We only ask for details that materially improve the property-specific analysis.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-800">
              Property address
              <input
                value={formState.address}
                onChange={(event) => onChange("address", event.currentTarget.value)}
                placeholder="123 Main St, Tampa, FL 33602"
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              />
            </label>

            <label className="text-sm font-medium text-slate-800">
              Property type
              <select
                value={formState.propertyType}
                onChange={(event) => onChange("propertyType", event.currentTarget.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              >
                {propertyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-800">
              Occupancy type
              <select
                value={formState.occupancyType}
                onChange={(event) => onChange("occupancyType", event.currentTarget.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              >
                {occupancyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-800">
              Year built
              <input
                value={formState.yearBuilt}
                onChange={(event) => onChange("yearBuilt", event.currentTarget.value)}
                inputMode="numeric"
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              />
            </label>

            <label className="text-sm font-medium text-slate-800">
              Square footage
              <input
                value={formState.squareFootage}
                onChange={(event) => onChange("squareFootage", event.currentTarget.value)}
                inputMode="numeric"
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              />
            </label>

            <label className="text-sm font-medium text-slate-800">
              Number of stories
              <input
                value={formState.stories}
                onChange={(event) => onChange("stories", event.currentTarget.value)}
                inputMode="numeric"
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              />
            </label>

            <label className="text-sm font-medium text-slate-800">
              Estimated home value
              <input
                value={formState.estimatedHomeValue}
                onChange={(event) => onChange("estimatedHomeValue", event.currentTarget.value)}
                inputMode="numeric"
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              />
            </label>

            <label className="text-sm font-medium text-slate-800">
              Estimated replacement value
              <input
                value={formState.estimatedReplacementValue}
                onChange={(event) => onChange("estimatedReplacementValue", event.currentTarget.value)}
                inputMode="numeric"
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              />
            </label>

            <label className="text-sm font-medium text-slate-800">
              Roof age
              <input
                value={formState.roofAge}
                onChange={(event) => onChange("roofAge", event.currentTarget.value)}
                inputMode="numeric"
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              />
            </label>

            <label className="text-sm font-medium text-slate-800">
              Roof type
              <select
                value={formState.roofType}
                onChange={(event) => onChange("roofType", event.currentTarget.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              >
                {roofTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-800">
              Prior major claim in the last 5 years
              <select
                value={formState.priorMajorClaim}
                onChange={(event) => onChange("priorMajorClaim", event.currentTarget.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>

            <label className="text-sm font-medium text-slate-800">
              Known flood concern
              <select
                value={formState.knownFloodConcern}
                onChange={(event) => onChange("knownFloodConcern", event.currentTarget.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-tide"
              >
                <option value="not_sure">Not sure</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>
          </div>

          <div className="rounded-[2rem] bg-[#102033] p-6 text-white">
            <div className="text-sm uppercase tracking-[0.18em] text-coral">Full property-specific analysis</div>
            <div className="mt-3 text-4xl font-semibold">${analysis.price}</div>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
              Complete the form and unlock the full exposure breakdown, deeper financial interpretation, and recommended next actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Unlocking analysis..." : analysis.ctaLabel}
            </button>
            <p className="text-sm text-slate-500">
              Prototype mode: the $99 payment is represented here as an unlock step.
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

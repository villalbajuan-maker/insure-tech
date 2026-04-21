"use client";

import { useState, useTransition } from "react";

interface CreateAnalysisResponse {
  analysisId: string;
  checkoutUrl: string;
}

const initialPolicies = "Homeowners policy, declarations page";

export function UploadForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/analyses", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        setError("We could not create the analysis request. Please review the form and try again.");
        return;
      }

      const data = (await response.json()) as CreateAnalysisResponse;
      window.location.href = data.checkoutUrl;
    });
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        action={handleSubmit}
        className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Start a paid prototype analysis</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            This prototype uses a mock processing pipeline and a real rules architecture.
            Upload file names, capture property context, and move into the analysis flow.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Full name
            <input
              required
              name="fullName"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              placeholder="Taylor Brooks"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              required
              type="email"
              name="email"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              placeholder="taylor@example.com"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium md:col-span-2">
            Property address
            <input
              required
              name="addressLine1"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              placeholder="123 Gulf View Drive"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            City
            <input
              required
              name="city"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              placeholder="Naples"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            ZIP code
            <input
              required
              name="zipCode"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              placeholder="34102"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            County
            <input
              name="county"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              placeholder="Collier"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Property type
            <select
              required
              name="propertyType"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              defaultValue="single_family"
            >
              <option value="single_family">Single family</option>
              <option value="condo">Condo</option>
              <option value="townhome">Townhome</option>
              <option value="multifamily_small">Small multifamily</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Occupancy
            <select
              required
              name="occupancyType"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              defaultValue="owner_occupied"
            >
              <option value="owner_occupied">Owner occupied</option>
              <option value="tenant_occupied">Tenant occupied</option>
              <option value="seasonal">Seasonal</option>
              <option value="vacant">Vacant</option>
              <option value="mixed">Mixed use</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Estimated dwelling coverage
            <input
              type="number"
              min="0"
              step="1000"
              name="estimatedDwellingCoverage"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              placeholder="650000"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            File count
            <input
              required
              type="number"
              min="1"
              step="1"
              name="documentCount"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              defaultValue="2"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium md:col-span-2">
            Uploaded file names
            <textarea
              required
              name="fileNames"
              className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              defaultValue={"homeowners-policy.pdf\ndeclarations-page.pdf"}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium md:col-span-2">
            Declared policies in package
            <input
              name="declaredPolicies"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-tide"
              defaultValue={initialPolicies}
            />
          </label>
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-2xl bg-mist px-4 py-4 text-sm leading-6 text-slate-700">
          <input required type="checkbox" name="agreedToDisclaimer" className="mt-1" />
          <span>
            I understand this tool is decision support, not legal advice, and that
            ambiguous policy wording may require licensed review.
          </span>
        </label>

        {error ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating analysis..." : "Continue to payment"}
        </button>
      </form>

      <aside className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
        <h3 className="text-xl font-semibold">What this implementation includes</h3>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-200">
          <li>Next.js application skeleton with typed routes and Tailwind styling.</li>
          <li>Upload and intake flow that creates an analysis request.</li>
          <li>Prototype Stripe checkout integration with a demo fallback.</li>
          <li>Florida standards registry and deterministic rules engine.</li>
          <li>Report page with findings, recommendations, and evidence notes.</li>
        </ul>
        <div className="mt-8 rounded-3xl bg-white/10 p-5">
          <p className="text-sm uppercase tracking-[0.18em] text-coral">
            Florida MVP gap categories
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-100">
            Flood, windstorm, ordinance-or-law, sinkhole treatment, replacement cost,
            and deductible pressure.
          </p>
        </div>
      </aside>
    </section>
  );
}

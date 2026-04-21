"use client";

interface RefineInputStateViewProps {
  addressInput: string;
  prefilledFromPdf: boolean;
  onAddressChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function RefineInputStateView({
  addressInput,
  prefilledFromPdf,
  onAddressChange,
  onSubmit
}: RefineInputStateViewProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card">
      <p className="text-sm uppercase tracking-[0.18em] text-coral">Refine analysis</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
        Enter your property address to refine your exposure
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
        We will apply a simple Florida location heuristic to make your exposure estimate
        more specific before unlocking the full analysis.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-slate-800">
          Property address
          <input
            value={addressInput}
            onChange={(event) => onAddressChange(event.currentTarget.value)}
            placeholder="123 Main St, Tampa, FL 33602"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base outline-none transition focus:border-tide"
          />
        </label>

        {prefilledFromPdf ? (
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

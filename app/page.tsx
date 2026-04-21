import { Hero } from "@/components/home/hero";
import { UploadForm } from "@/components/home/upload-form";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <Hero />

      <section className="print-hide grid gap-6 lg:grid-cols-4">
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Risk</p>
          <h2 className="mt-3 text-xl font-semibold">What is not covered?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Surface flood, wind, ordinance-or-law, and sinkhole gaps before they become expensive surprises.
          </p>
        </article>
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Claims</p>
          <h2 className="mt-3 text-xl font-semibold">Where could a claim stall?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Highlight wording ambiguity and deductible pressure that can still hurt even when coverage exists.
          </p>
        </article>
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Action</p>
          <h2 className="mt-3 text-xl font-semibold">What should happen next?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Give the homeowner concrete next steps instead of an abstract technical summary.
          </p>
        </article>
        <article className="rounded-[2rem] border border-white/70 bg-[#102033] p-6 text-white shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-coral">Conversion</p>
          <h2 className="mt-3 text-xl font-semibold">Audit first. Inspection second.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            The report opens the relationship. The inspection deepens it.
          </p>
        </article>
      </section>

      <UploadForm />

      <section
        id="how-it-works"
        className="print-hide grid gap-6 scroll-mt-8 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            A James-style landing page needs a simple path from concern to action.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-mist p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Step 1
              </div>
              <div className="mt-2 text-xl font-semibold">Upload the policy</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Make the upload field the highest-intent action on the page.
              </p>
            </div>
            <div className="rounded-3xl bg-sand p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Step 2
              </div>
              <div className="mt-2 text-xl font-semibold">Get the audit</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Return a report around uncovered risk, underinsured exposure, and next steps.
              </p>
            </div>
            <div className="rounded-3xl bg-mist p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Step 3
              </div>
              <div className="mt-2 text-xl font-semibold">Book inspection</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use the audit as the bridge into a higher-trust storm protection conversation.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-coral">Offer stack</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            The page now supports the sales story and the live prototype.
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-200">
            <li>$49 audit framing is visible above the fold</li>
            <li>Outcome-based messaging leads the story</li>
            <li>Real PDF upload is still active and usable</li>
            <li>The report can still be exported as a PDF</li>
          </ul>
          <p className="mt-6 text-sm leading-7 text-slate-300">
            This lets us test real buyer-facing messaging now, while still keeping the
            actual analysis engine on the page for demos and expert review sessions.
          </p>
        </article>
      </section>

      <section className="print-hide grid gap-6 lg:grid-cols-3">
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Primary promise</p>
          <h2 className="mt-3 text-xl font-semibold">Spot the gaps before the storm</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The strongest James-style message is simple: identify what could fail before the next claim happens.
          </p>
        </article>
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Offer framing</p>
          <h2 className="mt-3 text-xl font-semibold">$49 audit, higher-trust follow-up</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The report is the low-friction first step. The deeper inspection relationship comes after trust is earned.
          </p>
        </article>
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Testing mode</p>
          <h2 className="mt-3 text-xl font-semibold">Ready for live policy review sessions</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            You can use real policy files with your insurance expert now and refine the messaging from actual review calls.
          </p>
        </article>
      </section>

      <section className="print-hide grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Who this is for</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Homeowners who want clarity before storm season, not after a denied claim.
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
            <li>You are not sure whether your current policy leaves major storm exposure open.</li>
            <li>You want a practical explanation of where a claim could break down.</li>
            <li>You want next steps that support a stronger inspection or mitigation decision.</li>
          </ul>
        </article>

        <article className="rounded-[2rem] border border-white/70 bg-[#102033] p-8 text-white shadow-card">
          <p className="text-xs uppercase tracking-[0.18em] text-coral">Inspection handoff</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            The report should not be the end of the experience.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            James is right about the commercial sequence: the audit earns attention,
            but the inspection is where trust deepens and the broader storm protection
            relationship starts to become real.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#upload-audit"
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100"
            >
              Upload policy now
            </a>
            <span className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm text-slate-200">
              Next phase: inspection CTA and booking
            </span>
          </div>
        </article>
      </section>
    </main>
  );
}

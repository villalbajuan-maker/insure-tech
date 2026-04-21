import { redirect } from "next/navigation";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AnalysisPage({
  params,
  searchParams
}: AnalysisPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const next = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") {
      next.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        next.append(key, item);
      }
    }
  }

  const suffix = next.toString();
  redirect(`/analysis/${id}${suffix ? `?${suffix}` : ""}`);
}

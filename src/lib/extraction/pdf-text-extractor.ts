import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export interface ExtractedPdfPage {
  page: number;
  text: string;
}

export interface ExtractedPdfDocument {
  path: string;
  page_count: number;
  text: string;
  pages: ExtractedPdfPage[];
}

function decodePdfText(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

export async function extractPdfText(paths: string[]): Promise<ExtractedPdfDocument[]> {
  const results: ExtractedPdfDocument[] = [];
  const PDFParser = require("pdf2json") as new () => {
    on: (event: string, callback: (payload: any) => void) => void;
    loadPDF: (path: string) => void;
  };

  for (const filePath of paths) {
    const result = await new Promise<ExtractedPdfDocument>((resolve, reject) => {
      const parser = new PDFParser();
      parser.on("pdfParser_dataError", (error) => {
        reject(error);
      });
      parser.on("pdfParser_dataReady", (data) => {
        const pages: ExtractedPdfPage[] = (data.Pages ?? []).map(
          (page: { Texts?: Array<{ R?: Array<{ T?: string }> }> }, index: number) => ({
            page: index + 1,
            text: (page.Texts ?? [])
              .map((textNode) => decodePdfText(textNode.R?.[0]?.T ?? ""))
              .join(" ")
          })
        );

        resolve({
          path: filePath,
          page_count: pages.length,
          text: pages.map((page) => page.text).join("\n\n"),
          pages
        });
      });
      parser.loadPDF(filePath);
    });

    results.push(result);
  }

  return results;
}

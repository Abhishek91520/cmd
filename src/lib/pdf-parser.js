// Client-side PDF text extraction using pdfjs-dist from CDN to bypass bundler setup
export async function extractTextFromPDF(file) {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    // Dynamically route worker to CDN to prevent Next.js bundling issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += `\n--- Page ${i} ---\n${pageText}`;
    }

    return fullText;
  } catch (error) {
    console.error("PDF extraction error, falling back to simple text read:", error);
    // Graceful fallback for text/plain files or failed PDF loads
    return await file.text();
  }
}

// Chunking for long documents
export function chunkDocument(text, maxChars = 12000) {
  if (text.length <= maxChars) return [text];

  const chunks = [];
  let current = 0;

  while (current < text.length) {
    let end = current + maxChars;
    // Find last period or newline to avoid mid-sentence cuts
    if (end < text.length) {
      const breakPoint = text.lastIndexOf("\n", end);
      if (breakPoint > current) end = breakPoint;
    }
    chunks.push(text.slice(current, end));
    current = end;
  }

  return chunks;
}

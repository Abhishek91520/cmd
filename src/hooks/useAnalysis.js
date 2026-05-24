"use client";
import { useState, useCallback } from "react";
import { extractTextFromPDF } from "@/lib/pdf-parser";

export function useAnalysis() {
  const [state, setState] = useState({
    status: "idle",        // idle | uploading | processing | complete | error
    file: null,
    documentText: "",
    masterData: null,
    error: null,
    processingStep: "",
  });

  const analyzeFile = useCallback(async (file, modelId) => {
    setState((prev) => ({ ...prev, status: "uploading", file, error: null }));

    try {
      // Step 1: Extract text
      setState((prev) => ({ ...prev, processingStep: "Extracting document text..." }));
      let text = "";

      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }

      // Step 2: Send to NIM
      setState((prev) => ({
        ...prev,
        status: "processing",
        documentText: text,
        processingStep: "AI analyzing contract risks...",
      }));

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: text,
          documentName: file.name || "Contract",
          modelId: modelId || "meta/llama-3.1-70b-instruct"
        }),
      });

      if (!response.ok) throw new Error("Analysis request failed");

      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      // Save the model used in the master data for rendering on the dashboard
      const enrichedData = {
        ...result.data,
        model_used: modelId || "meta/llama-3.1-70b-instruct"
      };

      setState((prev) => ({
        ...prev,
        status: "complete",
        masterData: enrichedData,
        processingStep: "",
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: error.message,
        processingStep: "",
      }));
    }
  }, []);

  const analyzeDemo = useCallback(async (demoContract, modelId) => {
    setState((prev) => ({
      ...prev,
      status: "processing",
      file: { name: demoContract.title },
      documentText: demoContract.text,
      error: null,
      processingStep: "AI analyzing contract risks...",
    }));

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: demoContract.text,
          documentName: demoContract.title,
          modelId: modelId || "meta/llama-3.1-70b-instruct"
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      // Save the model used in the master data for rendering on the dashboard
      const enrichedData = {
        ...result.data,
        model_used: modelId || "meta/llama-3.1-70b-instruct"
      };

      setState((prev) => ({
        ...prev,
        status: "complete",
        masterData: enrichedData,
        processingStep: "",
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, status: "error", error: error.message }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle", file: null, documentText: "", masterData: null, error: null, processingStep: "" });
  }, []);

  return { ...state, analyzeFile, analyzeDemo, reset };
}

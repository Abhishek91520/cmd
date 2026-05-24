# Contract Intelligence & Risk OS — Complete Build Specification

> **Stack:** Next.js 15 (JS) · Tailwind CSS · shadcn/ui · Framer Motion · NVIDIA NIM APIs · Supabase · Vercel  
> **Strategy:** Ship Phase 1 + Phase 2 + Shield Audit at 100% quality. Everything else is bonus.

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Folder Structure](#2-folder-structure)
3. [Environment Variables](#3-environment-variables)
4. [Phase 1 — Upload & Ingestion Engine](#4-phase-1--upload--ingestion-engine)
5. [Phase 2 — NIM AI Processing Pipeline](#5-phase-2--nim-ai-processing-pipeline)
6. [Phase 3 — Intelligence Dashboard](#6-phase-3--intelligence-dashboard)
7. [Phase 4 — Shield Audit Scanner](#7-phase-4--shield-audit-scanner)
8. [Phase 5 — Negotiation Playground](#8-phase-5--negotiation-playground)
9. [Phase 6 — Polish & Demo Prep](#9-phase-6--polish--demo-prep)
10. [NIM Prompt Templates](#10-nim-prompt-templates)
11. [Master JSON Schema](#11-master-json-schema)
12. [Component Reference](#12-component-reference)
13. [Demo Flow Script](#13-demo-flow-script)

---

## 1. Project Setup

### Initialize Project

```bash
npx create-next-app@latest contract-intelligence --js --tailwind --eslint --app --src-dir
cd contract-intelligence
```

### Install All Dependencies

```bash
# UI & Animation
npm install framer-motion @radix-ui/react-dialog @radix-ui/react-tabs
npm install @radix-ui/react-progress @radix-ui/react-tooltip
npm install lucide-react clsx tailwind-merge

# shadcn/ui setup
npx shadcn@latest init
npx shadcn@latest add button card badge progress tabs dialog tooltip

# PDF Processing
npm install pdfjs-dist react-dropzone

# Charts & Visualization
npm install recharts

# Utilities
npm install openai   # NIM uses OpenAI-compatible SDK
npm install date-fns
```

### shadcn/ui Config (`components.json`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        risk: {
          high: "#EF4444",
          medium: "#F59E0B",
          low: "#10B981",
        },
        brand: {
          primary: "#6366F1",
          secondary: "#8B5CF6",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

```bash
npm install tailwindcss-animate
```

---

## 2. Folder Structure

```
src/
├── app/
│   ├── layout.js                    # Root layout — dark theme, fonts
│   ├── globals.css                  # Global styles, CSS variables
│   ├── page.js                      # Landing / Upload page
│   ├── dashboard/
│   │   └── page.js                  # Main intelligence dashboard
│   └── api/
│       ├── analyze/
│       │   └── route.js             # POST — runs NIM analysis, returns master JSON
│       ├── rewrite-clause/
│       │   └── route.js             # POST — NIM clause rewriter
│       └── counter-proposal/
│           └── route.js             # POST — generates negotiation email
├── components/
│   ├── upload/
│   │   ├── UploadZone.jsx           # Drag & drop zone
│   │   ├── DemoPresets.jsx          # One-click preset contracts
│   │   └── FileValidator.jsx        # Type/size validation UI
│   ├── dashboard/
│   │   ├── RiskScoreCard.jsx        # Overall risk score ring
│   │   ├── MetricsRow.jsx           # Financial exposure, deadlines, etc.
│   │   ├── TimelineEngine.jsx       # SVG interactive timeline
│   │   ├── ClauseDecoder.jsx        # Split-view clause panel
│   │   ├── ShieldAudit.jsx          # Risk scanner component
│   │   ├── NegotiationPlayground.jsx # Clause rewriter with diff
│   │   └── ActionItems.jsx          # Checklist of required actions
│   ├── ui/
│   │   ├── StreamingLoader.jsx      # Animated "AI processing" loader
│   │   ├── RiskBadge.jsx            # Red/amber/green badge
│   │   ├── DiffViewer.jsx           # Git-style clause diff
│   │   └── CommandPalette.jsx       # Cmd+K search overlay
│   └── layout/
│       ├── Navbar.jsx
│       └── Sidebar.jsx
├── lib/
│   ├── nim.js                       # NIM API client (OpenAI-compatible)
│   ├── pdf-parser.js                # PDF text extraction
│   ├── prompts.js                   # All NIM prompt templates
│   ├── demo-contracts.js            # Hardcoded demo contract text
│   └── utils.js                    # cn(), formatDate(), etc.
├── hooks/
│   ├── useAnalysis.js               # Analysis state management
│   └── useCommandPalette.js         # Cmd+K keyboard hook
└── store/
    └── analysisStore.js             # Zustand or simple context
```

---

## 3. Environment Variables

Create `.env.local`:

```env
# NVIDIA NIM
NIM_API_KEY=your_nvidia_nim_api_key_here
NIM_BASE_URL=https://integrate.api.nvidia.com/v1

# Model selection (use one of these)
NIM_MODEL=meta/llama-3.1-70b-instruct
# NIM_MODEL=meta/llama-3.2-90b-vision-instruct  # for image/scanned PDFs
# NIM_MODEL=mistralai/mixtral-8x7b-instruct-v0.1

# Supabase (optional for hackathon — skip if time-pressed)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Phase 1 — Upload & Ingestion Engine

### Step 1.1 — NIM Client (`src/lib/nim.js`)

```javascript
import OpenAI from "openai";

const nim = new OpenAI({
  apiKey: process.env.NIM_API_KEY,
  baseURL: process.env.NIM_BASE_URL,
});

export async function callNIM(systemPrompt, userPrompt, options = {}) {
  const completion = await nim.chat.completions.create({
    model: process.env.NIM_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: options.temperature ?? 0.1,
    max_tokens: options.max_tokens ?? 4096,
    ...options,
  });

  return completion.choices[0].message.content;
}

export default nim;
```

### Step 1.2 — PDF Parser (`src/lib/pdf-parser.js`)

```javascript
// Client-side PDF text extraction using pdf.js
export async function extractTextFromPDF(file) {
  const pdfjsLib = await import("pdfjs-dist/webpack.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.269/pdf.worker.min.js`;

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
```

### Step 1.3 — Demo Contracts (`src/lib/demo-contracts.js`)

```javascript
export const DEMO_CONTRACTS = {
  freelance: {
    id: "freelance",
    title: "Freelance Development Contract",
    description: "6-month web development agreement · High risk",
    riskLevel: "high",
    icon: "💻",
    text: `FREELANCE SOFTWARE DEVELOPMENT AGREEMENT

This Agreement is entered into as of January 1, 2025, between TechCorp Inc. ("Client") 
and the Developer ("Contractor").

1. SERVICES
Contractor agrees to develop a custom e-commerce platform. Client may change project 
requirements at any time without additional compensation to Contractor.

2. PAYMENT TERMS
Client will pay $5,000/month. Payment is due within 60 days of invoice. Late payments 
incur no penalty. Client reserves the right to withhold payment if "not satisfied" 
with deliverables, at Client's sole discretion.

3. INTELLECTUAL PROPERTY
All work product, inventions, and code created by Contractor during this engagement, 
including work created outside of business hours and unrelated to the project, 
shall become sole property of Client.

4. TERMINATION
Client may terminate this agreement at any time without notice and without any 
severance or compensation to Contractor for work in progress.

5. DISPUTE RESOLUTION
All disputes shall be resolved through binding arbitration in Client's home 
jurisdiction of Delaware, USA. Contractor waives all rights to jury trial.

6. NON-COMPETE
Contractor agrees not to work with any Client competitors for 3 years after 
termination. "Competitors" is defined at Client's sole discretion.

7. LIABILITY
In the event of any dispute, Client's liability shall not exceed $500 regardless 
of damages incurred by Contractor. Contractor accepts unlimited liability for 
any defects in deliverables.

8. AUTO-RENEWAL
This agreement automatically renews for 12-month periods unless terminated 
with 90 days written notice sent via certified mail only.`,
  },

  lease: {
    id: "lease",
    title: "Commercial Property Lease",
    description: "5-year office space agreement · Medium risk",
    riskLevel: "medium",
    icon: "🏢",
    text: `COMMERCIAL LEASE AGREEMENT

Property: 400 Corporate Drive, Suite 200
Lease Term: January 1, 2025 to December 31, 2029

1. RENT
Base rent: $8,500/month. Annual increases of CPI + 3%, minimum 5% per year.
Late payment penalty: 10% per month on overdue amounts.

2. SECURITY DEPOSIT
Tenant shall deposit $25,500 (3 months rent). Landlord may use deposit 
for any "damages" at landlord's sole discretion. Deposit is non-interest-bearing.

3. OPERATING EXPENSES
Tenant pays proportionate share of all building operating expenses including 
management fees, landscaping, and any capital improvements landlord deems necessary.

4. PERMITTED USE
Premises shall be used only for general office use. Any change requires 30 days 
written notice and landlord approval, which may be withheld for any reason.

5. ASSIGNMENT
Tenant may not assign or sublease without landlord's prior written consent. 
Consent may be withheld at landlord's discretion.

6. RENEWAL OPTION
Tenant has one option to renew for 3 years at then-prevailing market rate 
as determined by landlord. Option must be exercised 12 months before expiration.`,
  },

  employment: {
    id: "employment",
    title: "Employment Contract",
    description: "Senior developer offer letter · Medium risk",
    riskLevel: "medium",
    icon: "👔",
    text: `EMPLOYMENT AGREEMENT

Position: Senior Software Engineer
Start Date: February 1, 2025
Compensation: $95,000 annual salary

1. AT-WILL EMPLOYMENT
This employment is at-will. Either party may terminate at any time, for any reason.
Company provides no severance upon termination.

2. INTELLECTUAL PROPERTY
Employee assigns all inventions, whether or not related to employment, 
created during the employment period to the Company.

3. NON-SOLICITATION
For 2 years after termination, Employee may not recruit any Company employees 
or solicit any Company customers.

4. NON-COMPETE
Employee agrees not to work for any company in the software industry within 
50 miles of Company headquarters for 18 months after termination.

5. BONUS
Annual bonus of up to 20% of salary at Company's sole discretion, 
payable only if employed on payment date.

6. BENEFITS
Health insurance begins after 90-day probationary period. 
Company may change or eliminate benefits at any time.`,
  },
};
```

### Step 1.4 — Upload Zone Component (`src/components/upload/UploadZone.jsx`)

```jsx
"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, AlertCircle } from "lucide-react";

export default function UploadZone({ onFileAccepted }) {
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError(null);
      if (rejectedFiles.length > 0) {
        setError("Only PDF files under 10MB are supported.");
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  return (
    <motion.div
      {...getRootProps()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
        transition-all duration-300
        ${isDragActive
          ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
          : "border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/50"
        }
      `}
    >
      <input {...getInputProps()} />

      {/* Animated background glow on drag */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl bg-indigo-500/5 blur-xl"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ y: isDragActive ? -8 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 
                     flex items-center justify-center"
        >
          {isDragActive ? (
            <FileText className="w-8 h-8 text-indigo-400" />
          ) : (
            <Upload className="w-8 h-8 text-slate-400" />
          )}
        </motion.div>

        <div>
          <p className="text-lg font-semibold text-white mb-1">
            {isDragActive ? "Drop to analyze" : "Drop your contract here"}
          </p>
          <p className="text-sm text-slate-400">
            PDF or TXT · Max 10MB ·{" "}
            <span className="text-indigo-400 hover:underline">
              Browse files
            </span>
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
```

### Step 1.5 — Demo Presets Component (`src/components/upload/DemoPresets.jsx`)

```jsx
"use client";
import { motion } from "framer-motion";
import { DEMO_CONTRACTS } from "@/lib/demo-contracts";

const riskColors = {
  high: "text-red-400 bg-red-500/10 border-red-500/30",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  low: "text-green-400 bg-green-500/10 border-green-500/30",
};

export default function DemoPresets({ onSelect }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-medium">
        — or try a demo contract
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.values(DEMO_CONTRACTS).map((contract, i) => (
          <motion.button
            key={contract.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelect(contract)}
            className="text-left p-4 rounded-xl bg-slate-900 border border-slate-800 
                       hover:border-slate-600 hover:bg-slate-800 transition-all duration-200 
                       group"
          >
            <div className="text-2xl mb-2">{contract.icon}</div>
            <p className="text-sm font-semibold text-white group-hover:text-indigo-300 
                          transition-colors mb-1">
              {contract.title}
            </p>
            <p className="text-xs text-slate-500 mb-3">{contract.description}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium
                             ${riskColors[contract.riskLevel]}`}>
              {contract.riskLevel} risk
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Phase 2 — NIM AI Processing Pipeline

### Step 2.1 — Main Analysis API Route (`src/app/api/analyze/route.js`)

```javascript
import { NextResponse } from "next/server";
import { callNIM } from "@/lib/nim";
import { MASTER_ANALYSIS_PROMPT } from "@/lib/prompts";
import { chunkDocument } from "@/lib/pdf-parser";

export async function POST(request) {
  try {
    const { documentText, documentName } = await request.json();

    if (!documentText || documentText.trim().length < 50) {
      return NextResponse.json(
        { error: "Document text is too short or empty." },
        { status: 400 }
      );
    }

    // Handle long documents — chunk and merge
    const chunks = chunkDocument(documentText, 12000);
    let analysisText = documentText;

    if (chunks.length > 1) {
      // For long docs: analyze each chunk, merge results
      const chunkResults = await Promise.all(
        chunks.map((chunk) =>
          callNIM(
            MASTER_ANALYSIS_PROMPT.system,
            MASTER_ANALYSIS_PROMPT.user(chunk, documentName),
            { max_tokens: 2048 }
          )
        )
      );
      // Use first chunk's full analysis + append risks from others
      analysisText = chunkResults[0];
      // In production: merge all chunk JSONs
    }

    // Single NIM call — returns master JSON
    const rawResponse = await callNIM(
      MASTER_ANALYSIS_PROMPT.system,
      MASTER_ANALYSIS_PROMPT.user(analysisText, documentName),
      { max_tokens: 4096, temperature: 0.1 }
    );

    // Parse JSON — strip any markdown fences
    const cleaned = rawResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const masterJSON = JSON.parse(cleaned);

    return NextResponse.json({ success: true, data: masterJSON });
  } catch (error) {
    console.error("Analysis error:", error);

    // Return structured error
    return NextResponse.json(
      {
        error: "Analysis failed. Please try again.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
```

### Step 2.2 — Clause Rewrite API Route (`src/app/api/rewrite-clause/route.js`)

```javascript
import { NextResponse } from "next/server";
import { callNIM } from "@/lib/nim";
import { CLAUSE_REWRITE_PROMPT } from "@/lib/prompts";

export async function POST(request) {
  try {
    const { clauseText, tone, context } = await request.json();
    // tone: "aggressive" | "balanced" | "friendly"

    const response = await callNIM(
      CLAUSE_REWRITE_PROMPT.system,
      CLAUSE_REWRITE_PROMPT.user(clauseText, tone, context),
      { max_tokens: 1024, temperature: 0.3 }
    );

    const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Step 2.3 — Counter Proposal API Route (`src/app/api/counter-proposal/route.js`)

```javascript
import { NextResponse } from "next/server";
import { callNIM } from "@/lib/nim";
import { COUNTER_PROPOSAL_PROMPT } from "@/lib/prompts";

export async function POST(request) {
  try {
    const { risks, documentSummary, tone } = await request.json();

    const response = await callNIM(
      COUNTER_PROPOSAL_PROMPT.system,
      COUNTER_PROPOSAL_PROMPT.user(risks, documentSummary, tone),
      { max_tokens: 1500, temperature: 0.4 }
    );

    return NextResponse.json({ success: true, email: response });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 6. Phase 3 — Intelligence Dashboard

### Step 3.1 — Analysis State Hook (`src/hooks/useAnalysis.js`)

```javascript
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

  const analyzeFile = useCallback(async (file) => {
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
        }),
      });

      if (!response.ok) throw new Error("Analysis request failed");

      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      setState((prev) => ({
        ...prev,
        status: "complete",
        masterData: result.data,
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

  const analyzeDemo = useCallback(async (demoContract) => {
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
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setState((prev) => ({
        ...prev,
        status: "complete",
        masterData: result.data,
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
```

### Step 3.2 — Landing Page (`src/app/page.js`)

```jsx
"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, FileSearch } from "lucide-react";
import UploadZone from "@/components/upload/UploadZone";
import DemoPresets from "@/components/upload/DemoPresets";
import StreamingLoader from "@/components/ui/StreamingLoader";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { status, processingStep, masterData, error, analyzeFile, analyzeDemo } =
    useAnalysis();

  // Navigate to dashboard when analysis completes
  useEffect(() => {
    if (status === "complete" && masterData) {
      // Store in sessionStorage for dashboard page
      sessionStorage.setItem("contractData", JSON.stringify(masterData));
      router.push("/dashboard");
    }
  }, [status, masterData, router]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-400 tracking-widest uppercase">
              Contract Intelligence OS
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Your contract has
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              {" "}hidden risks.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Drop any contract. AI finds the dangerous clauses, tracks deadlines,
            and helps you negotiate — in seconds.
          </p>

          {/* Feature pills */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            {[
              { icon: Shield, label: "Risk Detection" },
              { icon: Zap, label: "Instant Analysis" },
              { icon: FileSearch, label: "Clause Decoder" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                           bg-slate-800/80 border border-slate-700 text-sm text-slate-300"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-400" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upload / Processing area */}
        <AnimatePresence mode="wait">
          {status === "idle" || status === "error" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <UploadZone onFileAccepted={analyzeFile} />
              <DemoPresets onSelect={analyzeDemo} />
              {error && (
                <p className="text-center text-red-400 text-sm">⚠ {error}</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <StreamingLoader step={processingStep} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
```

### Step 3.3 — Streaming Loader (`src/components/ui/StreamingLoader.jsx`)

```jsx
"use client";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const ANALYSIS_STEPS = [
  "Parsing document structure...",
  "Identifying parties and jurisdiction...",
  "Scanning for dangerous clauses...",
  "Calculating risk score...",
  "Extracting financial obligations...",
  "Building timeline of deadlines...",
  "Generating plain-English explanations...",
  "Preparing intelligence dashboard...",
];

export default function StreamingLoader({ step }) {
  return (
    <div className="text-center py-16">
      {/* Pulsing shield animation */}
      <div className="relative mx-auto w-20 h-20 mb-8">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-indigo-500/20"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute inset-2 rounded-full bg-indigo-500/20"
        />
        <div className="absolute inset-4 rounded-full bg-indigo-600 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">
        Analyzing your contract
      </h3>
      <p className="text-slate-400 text-sm mb-8">{step || "Processing..."}</p>

      {/* Streaming step indicators */}
      <div className="max-w-xs mx-auto space-y-2">
        {ANALYSIS_STEPS.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.35, duration: 0.4 }}
            className="flex items-center gap-2 text-left"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.35 + 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"
            />
            <span className="text-xs text-slate-500">{s}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

### Step 3.4 — Dashboard Page (`src/app/dashboard/page.js`)

```jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MetricsRow from "@/components/dashboard/MetricsRow";
import RiskScoreCard from "@/components/dashboard/RiskScoreCard";
import TimelineEngine from "@/components/dashboard/TimelineEngine";
import ClauseDecoder from "@/components/dashboard/ClauseDecoder";
import ShieldAudit from "@/components/dashboard/ShieldAudit";
import ActionItems from "@/components/dashboard/ActionItems";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const stored = sessionStorage.getItem("contractData");
    if (!stored) {
      router.push("/");
      return;
    }
    setData(JSON.parse(stored));
  }, [router]);

  if (!data) return null;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "clauses", label: "Clause Decoder" },
    { id: "shield", label: "Shield Audit" },
    { id: "timeline", label: "Timeline" },
    { id: "negotiate", label: "Negotiate" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">📄</span>
          <span className="text-sm font-medium text-white">
            {data.document_summary?.title || "Contract Analysis"}
          </span>
          <RiskBadge level={data.risk_score?.level} />
        </div>
        <button
          onClick={() => { sessionStorage.clear(); router.push("/"); }}
          className="text-sm text-slate-500 hover:text-white transition-colors"
        >
          ← Analyze another
        </button>
      </div>

      {/* Tab nav */}
      <div className="border-b border-slate-800 px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1">
                  <RiskScoreCard data={data.risk_score} />
                </div>
                <div className="lg:col-span-3">
                  <MetricsRow data={data} />
                </div>
              </div>
              <ActionItems items={data.action_items} />
            </div>
          )}
          {activeTab === "clauses" && <ClauseDecoder clauses={data.clauses} />}
          {activeTab === "shield" && <ShieldAudit risks={data.hidden_risks} />}
          {activeTab === "timeline" && <TimelineEngine deadlines={data.deadlines} />}
          {activeTab === "negotiate" && <NegotiationPlayground data={data} />}
        </motion.div>
      </div>
    </div>
  );
}

function RiskBadge({ level }) {
  const colors = {
    high: "bg-red-500/10 text-red-400 border-red-500/30",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    low: "bg-green-500/10 text-green-400 border-green-500/30",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors[level] || colors.medium}`}>
      {level?.toUpperCase() || "MEDIUM"} RISK
    </span>
  );
}
```

### Step 3.5 — Risk Score Card (`src/components/dashboard/RiskScoreCard.jsx`)

```jsx
"use client";
import { motion } from "framer-motion";

export default function RiskScoreCard({ data }) {
  if (!data) return null;
  const score = data.score || 0;
  const level = data.level || "medium";

  const color = { high: "#EF4444", medium: "#F59E0B", low: "#10B981" }[level];
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 10) * circumference;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center h-full
                    flex flex-col items-center justify-center">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-4 font-medium">
        Risk Score
      </p>

      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90">
          <circle cx="72" cy="72" r="54" fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <motion.circle
            cx="72" cy="72" r="54" fill="none"
            stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-4xl font-bold"
            style={{ color }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-slate-500 font-medium">/10</span>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold" style={{ color }}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </p>
      <p className="text-xs text-slate-500 mt-1 max-w-[150px]">
        {data.summary || "Review required before signing"}
      </p>
    </div>
  );
}
```

### Step 3.6 — Metrics Row (`src/components/dashboard/MetricsRow.jsx`)

```jsx
"use client";
import { motion } from "framer-motion";
import { DollarSign, Clock, AlertTriangle, Calendar } from "lucide-react";

export default function MetricsRow({ data }) {
  const metrics = [
    {
      icon: DollarSign,
      label: "Financial Exposure",
      value: data.financial_obligations?.[0]?.total_exposure || "—",
      sub: "Total identified",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      icon: AlertTriangle,
      label: "Hidden Risks",
      value: data.hidden_risks?.length || 0,
      sub: "Dangerous clauses",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      icon: Calendar,
      label: "Next Deadline",
      value: data.deadlines?.[0]?.date || "—",
      sub: data.deadlines?.[0]?.description || "No deadlines found",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: Clock,
      label: "Action Items",
      value: data.action_items?.length || 0,
      sub: "Required steps",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`${m.bg} border ${m.border} rounded-2xl p-5`}
        >
          <div className={`w-8 h-8 rounded-lg ${m.bg} border ${m.border} 
                          flex items-center justify-center mb-3`}>
            <m.icon className={`w-4 h-4 ${m.color}`} />
          </div>
          <p className="text-2xl font-bold text-white mb-0.5">{m.value}</p>
          <p className="text-xs font-medium text-slate-300">{m.label}</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{m.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
```

---

## 7. Phase 4 — Shield Audit Scanner

### Step 4.1 — Shield Audit Component (`src/components/dashboard/ShieldAudit.jsx`)

```jsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, AlertTriangle, XCircle, Info } from "lucide-react";

const severityConfig = {
  critical: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: XCircle },
  high: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: AlertTriangle },
  medium: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: AlertTriangle },
  low: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: Info },
};

function RiskCard({ risk, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const severity = risk.severity || "medium";
  const config = severityConfig[severity] || severityConfig.medium;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`${config.bg} border ${config.border} rounded-xl overflow-hidden`}
    >
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
      >
        <Icon className={`w-4 h-4 ${config.color} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{risk.type}</p>
          <p className="text-xs text-slate-400 truncate">{risk.clause_excerpt}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
            {severity.toUpperCase()}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">WHY IT MATTERS</p>
                <p className="text-sm text-slate-300">{risk.why_it_matters}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">POTENTIAL IMPACT</p>
                <p className="text-sm text-slate-300">{risk.potential_impact}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-xs text-green-400 font-medium mb-1">✓ SAFER ALTERNATIVE</p>
                <p className="text-sm text-green-300">{risk.safer_alternative}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ShieldAudit({ risks }) {
  const [isScanning, setIsScanning] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (!risks || risks.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No risks detected in this document.</p>
      </div>
    );
  }

  const displayed = showAll ? risks : risks.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            Shield Audit
          </h2>
          <p className="text-sm text-slate-400">
            {risks.length} risk{risks.length !== 1 ? "s" : ""} detected
          </p>
        </div>
        <div className="flex gap-2">
          {["critical", "high", "medium", "low"].map((severity) => {
            const count = risks.filter((r) => r.severity === severity).length;
            if (!count) return null;
            const config = severityConfig[severity];
            return (
              <span key={severity}
                className={`text-xs px-2 py-1 rounded-full border ${config.bg} ${config.color} ${config.border}`}>
                {count} {severity}
              </span>
            );
          })}
        </div>
      </div>

      {/* Risk cards */}
      <div className="space-y-2">
        {displayed.map((risk, i) => (
          <RiskCard key={i} risk={risk} index={i} />
        ))}
      </div>

      {risks.length > 5 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="w-full py-2 text-sm text-slate-400 hover:text-white 
                     border border-slate-800 rounded-xl hover:border-slate-600 transition-colors"
        >
          {showAll ? "Show less" : `Show ${risks.length - 5} more risks`}
        </button>
      )}
    </div>
  );
}
```

---

## 8. Phase 5 — Negotiation Playground

### Step 5.1 — Negotiation Component (`src/components/dashboard/NegotiationPlayground.jsx`)

```jsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Copy, Mail } from "lucide-react";

const TONES = [
  { id: "aggressive", label: "Aggressive", desc: "Push hard for maximum protection" },
  { id: "balanced", label: "Balanced", desc: "Fair amendments both sides can accept" },
  { id: "friendly", label: "Friendly", desc: "Collaborative, relationship-preserving" },
];

export default function NegotiationPlayground({ data }) {
  const [selectedClause, setSelectedClause] = useState(null);
  const [tone, setTone] = useState("balanced");
  const [rewritten, setRewritten] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");

  const risky = data.clauses?.filter((c) => c.risk_level === "high" || c.risk_level === "medium") || [];

  const handleRewrite = async () => {
    if (!selectedClause) return;
    setIsLoading(true);
    setRewritten(null);

    try {
      const res = await fetch("/api/rewrite-clause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clauseText: selectedClause.original_text,
          tone,
          context: data.document_summary?.type,
        }),
      });
      const result = await res.json();
      if (result.success) setRewritten(result.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateEmail = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/counter-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          risks: data.hidden_risks?.slice(0, 5),
          documentSummary: data.document_summary,
          tone,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setEmail(result.email);
        setShowEmail(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Clause selector + tone */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white">Select a Risky Clause</h3>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {risky.map((clause, i) => (
            <button
              key={i}
              onClick={() => { setSelectedClause(clause); setRewritten(null); }}
              className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                selectedClause?.id === clause.id
                  ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-300"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600"
              }`}
            >
              <p className="font-medium">{clause.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                {clause.original_text?.slice(0, 100)}...
              </p>
            </button>
          ))}
        </div>

        {/* Tone selector */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-medium">
            Negotiation Tone
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`p-2 rounded-lg border text-center transition-all text-sm ${
                  tone === t.id
                    ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                <p className="font-medium">{t.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRewrite}
            disabled={!selectedClause || isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
                       bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed
                       text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            {isLoading ? "Rewriting..." : "Rewrite Clause"}
          </button>
          <button
            onClick={handleGenerateEmail}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700
                       text-white text-sm font-medium rounded-xl transition-colors border border-slate-700"
          >
            <Mail className="w-4 h-4" />
            Email Draft
          </button>
        </div>
      </div>

      {/* Right: Diff output or email */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-h-[300px]">
        {!rewritten && !showEmail && (
          <div className="h-full flex items-center justify-center text-slate-600 text-sm">
            Select a clause and rewrite it
          </div>
        )}

        {rewritten && !showEmail && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-red-400 font-medium mb-2">ORIGINAL</p>
              <p className="text-sm text-slate-400 bg-red-500/5 border border-red-500/20 
                            rounded-lg p-3 line-through">
                {rewritten.original}
              </p>
            </div>
            <div>
              <p className="text-xs text-green-400 font-medium mb-2">REWRITTEN ({tone.toUpperCase()})</p>
              <p className="text-sm text-slate-200 bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                {rewritten.rewritten}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-xs text-slate-500 font-medium mb-1">WHY THIS CHANGE</p>
              <p className="text-xs text-slate-400">{rewritten.justification}</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(rewritten.rewritten)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy rewritten clause
            </button>
          </div>
        )}

        {showEmail && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-medium">COUNTER-PROPOSAL EMAIL</p>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(email)}
                  className="text-xs text-slate-400 hover:text-white">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setShowEmail(false)}
                  className="text-xs text-slate-400 hover:text-white">
                  ← Back
                </button>
              </div>
            </div>
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
              {email}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 9. Phase 6 — Polish & Demo Prep

### Step 6.1 — Global Layout (`src/app/layout.js`)

```jsx
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Contract Intelligence OS — AI Risk Analysis",
  description: "Drop any contract. AI finds hidden risks, tracks deadlines, and helps you negotiate.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

### Step 6.2 — Global CSS (`src/app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }

  * { box-sizing: border-box; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

  ::selection { background: rgba(99, 102, 241, 0.3); }
}
```

### Step 6.3 — Cmd+K Command Palette (`src/components/ui/CommandPalette.jsx`)

```jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, Calendar, DollarSign, FileText } from "lucide-react";

const COMMANDS = [
  { icon: Shield, label: "Show high-risk clauses", tab: "shield" },
  { icon: Calendar, label: "View deadlines timeline", tab: "timeline" },
  { icon: DollarSign, label: "Financial obligations", tab: "overview" },
  { icon: FileText, label: "Clause decoder", tab: "clauses" },
];

export default function CommandPalette({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-full max-w-md bg-slate-900 border border-slate-700 
                       rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-slate-800">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search risks, clauses, deadlines..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
              />
              <kbd className="text-xs bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-400">
                ESC
              </kbd>
            </div>
            <div className="p-2">
              {filtered.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => { onNavigate(cmd.tab); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
                             text-sm text-slate-300 hover:bg-slate-800 hover:text-white 
                             transition-colors text-left"
                >
                  <cmd.icon className="w-4 h-4 text-slate-400" />
                  {cmd.label}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## 10. NIM Prompt Templates

### `src/lib/prompts.js`

```javascript
export const MASTER_ANALYSIS_PROMPT = {
  system: `You are a senior contract attorney and risk analyst. Analyze legal documents with precision and return ONLY valid JSON — no markdown, no explanation, no preamble.

Your analysis must be thorough, specific, and actionable. Extract real information from the document — never fabricate. If information is not present, use null.

Return JSON that exactly matches the schema provided.`,

  user: (documentText, documentName) => `Analyze this contract and return structured intelligence as JSON.

Document Name: ${documentName}
Document Text:
---
${documentText}
---

Return ONLY this JSON structure with real values extracted from the document above:

{
  "document_summary": {
    "title": "string — document title or type",
    "type": "string — e.g. 'Freelance Contract', 'Commercial Lease', 'Employment Agreement'",
    "parties": ["list of party names"],
    "effective_date": "string or null",
    "jurisdiction": "string or null",
    "summary": "2-3 sentence plain English summary"
  },
  "risk_score": {
    "score": "number 1-10 (10 = most dangerous)",
    "level": "high | medium | low",
    "summary": "one sentence risk verdict"
  },
  "financial_obligations": [
    {
      "type": "string — e.g. 'Monthly Payment', 'Security Deposit', 'Penalty'",
      "amount": "string — dollar amount",
      "frequency": "string — one-time | monthly | annually | etc",
      "due_date": "string or null",
      "notes": "string — any conditions or caveats",
      "total_exposure": "string — estimated total"
    }
  ],
  "deadlines": [
    {
      "date": "string — exact date or relative like '30 days after signing'",
      "description": "string — what must happen",
      "type": "payment | renewal | notice | compliance | termination",
      "urgency": "high | medium | low",
      "consequence": "string — what happens if missed"
    }
  ],
  "clauses": [
    {
      "id": "string — unique id like 'clause_1'",
      "title": "string — clause name",
      "original_text": "string — exact text from document",
      "plain_english": "string — simple explanation a non-lawyer understands",
      "risk_level": "high | medium | low | safe",
      "risk_reason": "string — why this is risky, or null if safe",
      "section": "string — section number/name"
    }
  ],
  "hidden_risks": [
    {
      "type": "string — e.g. 'Auto-Renewal Trap', 'Unlimited Liability', 'Unfair Termination'",
      "severity": "critical | high | medium | low",
      "clause_excerpt": "string — short quote from document",
      "why_it_matters": "string — consequence in plain English",
      "potential_impact": "string — worst case scenario",
      "safer_alternative": "string — what a fair version would say"
    }
  ],
  "negotiation_suggestions": [
    {
      "clause": "string — which clause",
      "current_text": "string — problematic current wording",
      "suggested_change": "string — specific replacement text",
      "rationale": "string — why this change protects you",
      "priority": "must-have | nice-to-have"
    }
  ],
  "plain_english_map": {
    "what_you_are_agreeing_to": "string — 2-3 sentence summary of core commitment",
    "what_you_cannot_do": "string — key restrictions",
    "what_happens_if_things_go_wrong": "string — termination, dispute, liability summary",
    "what_are_the_biggest_traps": "string — top 2-3 risks to watch"
  },
  "action_items": [
    {
      "priority": "urgent | high | medium",
      "action": "string — specific action to take",
      "deadline": "string or null",
      "reason": "string — why this matters"
    }
  ]
}`,
};

export const CLAUSE_REWRITE_PROMPT = {
  system: `You are an expert contract attorney specializing in protecting clients from unfair terms. Rewrite clauses to be fairer and safer. Return ONLY valid JSON.`,

  user: (clauseText, tone, context) => `Rewrite this contract clause with a ${tone} negotiation tone.

Context: This is from a ${context || "business contract"}.
Current clause: "${clauseText}"

Tone guidelines:
- aggressive: Maximum protection for the signing party, push back hard on all one-sided terms
- balanced: Fair and mutual terms that both parties can reasonably accept
- friendly: Collaborative language that preserves the relationship while adding protection

Return ONLY this JSON:
{
  "original": "string — the original clause text",
  "rewritten": "string — your improved version",
  "justification": "string — why this change protects the signing party",
  "key_changes": ["list of specific changes made"]
}`,
};

export const COUNTER_PROPOSAL_PROMPT = {
  system: `You are a professional negotiation consultant drafting business correspondence. Write clear, professional emails. Return the email text only — no JSON needed.`,

  user: (risks, documentSummary, tone) => `Draft a professional counter-proposal email for this contract situation.

Document: ${documentSummary?.title || "Contract"}
Top risks identified: ${risks?.map((r) => r.type).join(", ") || "multiple concerns"}
Negotiation tone: ${tone}

Write a professional email from the reviewing party to the offering party. Include:
1. Professional opening acknowledging the agreement
2. 3-4 specific clauses that need amendment (reference the risks above)
3. Clear proposed alternative language for each
4. Professional closing

Keep it concise, firm, and professional. Format as a real email with subject line.`,
};
```

---

## 11. Master JSON Schema

```json
{
  "document_summary": {
    "title": "Freelance Development Agreement",
    "type": "Freelance Contract",
    "parties": ["TechCorp Inc.", "Developer"],
    "effective_date": "January 1, 2025",
    "jurisdiction": "Delaware, USA",
    "summary": "6-month development contract with highly one-sided terms favoring the client."
  },
  "risk_score": {
    "score": 8,
    "level": "high",
    "summary": "Multiple dangerous clauses including unlimited liability and unfair termination terms."
  },
  "financial_obligations": [
    {
      "type": "Monthly Payment",
      "amount": "$5,000",
      "frequency": "monthly",
      "due_date": "60 days after invoice",
      "notes": "Client can withhold payment at sole discretion",
      "total_exposure": "$30,000 contract value at risk"
    }
  ],
  "deadlines": [
    {
      "date": "90 days before end of term",
      "description": "Must send certified mail notice to prevent auto-renewal",
      "type": "notice",
      "urgency": "high",
      "consequence": "Locked into 12-month renewal automatically"
    }
  ],
  "hidden_risks": [
    {
      "type": "Auto-Renewal Trap",
      "severity": "high",
      "clause_excerpt": "automatically renews for 12-month periods",
      "why_it_matters": "You could be locked into another year without realizing it",
      "potential_impact": "12 months of unexpected obligation",
      "safer_alternative": "Add 30-day written notice option via any method"
    }
  ]
}
```

---

## 12. Component Reference

| Component | File | Purpose |
|---|---|---|
| `UploadZone` | `upload/UploadZone.jsx` | Drag & drop PDF upload |
| `DemoPresets` | `upload/DemoPresets.jsx` | One-click preset contracts |
| `StreamingLoader` | `ui/StreamingLoader.jsx` | AI processing animation |
| `RiskScoreCard` | `dashboard/RiskScoreCard.jsx` | Animated risk score ring |
| `MetricsRow` | `dashboard/MetricsRow.jsx` | 4 KPI cards |
| `TimelineEngine` | `dashboard/TimelineEngine.jsx` | SVG deadline timeline |
| `ClauseDecoder` | `dashboard/ClauseDecoder.jsx` | Split-view clause panel |
| `ShieldAudit` | `dashboard/ShieldAudit.jsx` | Expandable risk cards |
| `ActionItems` | `dashboard/ActionItems.jsx` | Priority action checklist |
| `NegotiationPlayground` | `dashboard/NegotiationPlayground.jsx` | Clause rewriter + email |
| `CommandPalette` | `ui/CommandPalette.jsx` | Cmd+K search overlay |

---

## 13. Demo Flow Script

### Sequence for Judges (90 seconds)

```
0:00 — Open landing page
       → Show tagline "Drop any contract. AI finds hidden risks."

0:10 — Click "Freelance Development Contract" preset
       → Streaming loader animates (8 step indicators)

0:30 — Dashboard appears
       → Risk score ring animates to 8/10 (HIGH RISK)
       → 4 metric cards fade in with numbers

0:45 — Click "Shield Audit" tab
       → 6 risk cards cascade in
       → Click "Auto-Renewal Trap" card
       → Expansion reveals: why it matters + potential impact + safer alternative

1:00 — Click "Negotiate" tab  
       → Select "Auto-Renewal" clause
       → Set tone to "Balanced"
       → Click "Rewrite Clause"
       → Original (strikethrough red) → Rewritten (green) diff appears

1:15 — Click "Email Draft"
       → Professional counter-proposal email generates
       → "Copy" to clipboard

1:20 — Cmd+K → type "timeline"
       → Jump to Timeline tab
       → Show deadline: "Send renewal notice by Oct 1, 2025 or auto-locked"

1:30 — Done
```

### Fallback Plan (if NIM is slow)

Pre-compute the master JSON for each demo contract and cache in `/lib/demo-responses.js`. If the live call takes more than 8 seconds, serve the cached response and mention "pre-analyzed for demo speed."

---

## Build Order (Priority Sequence)

```
Day 1 Morning:
  ✓ Project setup + all installs
  ✓ NIM client + prompts.js
  ✓ /api/analyze route
  ✓ PDF parser + demo contracts

Day 1 Afternoon:
  ✓ UploadZone + DemoPresets
  ✓ StreamingLoader
  ✓ useAnalysis hook
  ✓ Landing page (page.js)
  ✓ Test end-to-end with one demo contract

Day 1 Evening:
  ✓ RiskScoreCard
  ✓ MetricsRow
  ✓ ShieldAudit (most important feature)
  ✓ Dashboard layout + tabs

Day 2 Morning:
  ✓ ClauseDecoder (split view)
  ✓ TimelineEngine
  ✓ ActionItems

Day 2 Afternoon:
  ✓ NegotiationPlayground
  ✓ /api/rewrite-clause route
  ✓ /api/counter-proposal route
  ✓ CommandPalette (Cmd+K)

Day 2 Evening:
  ✓ Polish animations
  ✓ Pre-cache demo responses
  ✓ Deploy to Vercel
  ✓ Rehearse demo flow 3 times
```

---

> **Critical reminder:** If you run out of time, drop TimelineEngine and NegotiationPlayground. A perfect Upload → Dashboard → ShieldAudit flow wins over a half-built 11-feature app. Quality > quantity.

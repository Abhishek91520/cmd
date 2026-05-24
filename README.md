# RiskOS — Premium AI-Powered Multilingual Document Auditing & Negotiation Suite

**RiskOS** is an industry-grade, production-ready legal and document intelligence platform. Driven by **NVIDIA NIM APIs** (utilizing Llama 3.3 70B, Llama 3.1 70B, and Mixtral 8x7B models), it instantly audits contracts, invoices, clinical sheets, and financial records for hidden liabilities, translates summaries into Indian regional languages, and drafts highly tailored counter-proposals.

---

## 🚀 Key Platform Features

* **📇 11 Specialized Document Categories**:
  Integrated preset deck and custom upload pipelines for:
  1. *Contract / Agreement* (NDAs, master agreements, employment offers)
  2. *Invoice / Receipt* (Itemizations, totals, billing delays, daily interest penalties)
  3. *Medical Report* (Appendectomy surgical sheets, drugs, contraindications)
  4. *Government Notice* (Alert warnings, official filings, tax compliance)
  5. *Financial Report* (Balance sheets, asset portfolios, variances)
  6. *Research Paper* (Academic drafts, studies)
  7. *Insurance Policy* (Claim deductibles, exclusions)
  8. *Property Document* (Lease agreements, deeds, registrations)
  9. *Certificate / Marksheet* (Educational degrees, transcripts)
  10. *Tax Document* (ITR-1 returns, Section 80C deductions, TDS matching)
  11. *ID Document* (PAN card registries, Aadhaar, verification checks)

* **🇮🇳 Multilingual Indian Regional Support**:
  Header selectors translate all executive summaries, plain-English conversions, deadlines, risk reasons, and Q&A audits into:
  - **हिन्दी (Hindi)**
  - **मराठी (Marathi)**
  - **தமிழ் (Tamil)**

* **💬 Ask Custom Question (Q&A Chat Drawer)**:
  An interactive, context-aware conversational chat space with pre-set suggested legal/financial queries. Generates localized replies matching the selected regional language.

* **⚖ Side-by-Side Document Comparison**:
  Upload a second draft (or select preset drafts) to run comparative audits. Features a graphical Risk Score Delta ring, modified/added/deleted terms lists, and a green negotiation signoff verdict banner.

* **🌌 Constellation Physics-Canvas Particles**:
  Floating backdrop dots drifting smoothly across all monitors, attracting dynamically toward the mouse cursor with thin neural connectivity vectors.

---

## 🛠 Tech Stack Configuration

* **Frontend Framework**: Next.js 15 (App Router, Turbopack)
* **Styling & Transitions**: Tailwind CSS v4 (using `@theme` directives), `tailwindcss-animate`, Framer Motion
* **Vector Icons**: Lucide React
* **AI Model Pipeline**: NVIDIA NIM Client wrapped via standard OpenAI SDK routes
* **Client-side Processing**: PDFJs-Dist workers hosted dynamically on CDNs (bypassing compilation errors)

---

## ⚙ Setup & Installation

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file inside the root directory:
```env
# NVIDIA NIM
NIM_API_KEY=your_nvidia_nim_api_key_here
NIM_BASE_URL=https://integrate.api.nvidia.com/v1

# Selected Ingestion Model
NIM_MODEL=meta/llama-3.1-70b-instruct

# App configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!NOTE]
> If a real `NIM_API_KEY` is not present, the platform's API routes will automatically trigger a **graceful fallback** to our high-fidelity cached dataset (`src/lib/demo-responses.js`). The entire application remains 100% interactive, allowing you to showcase model swappers, Q&A chats, and comparative deltas seamlessly!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser.

---

## ⏱ The 90-Second Judge Showcase Routine

To present the absolute best features of the platform, follow this optimized demonstration script:

1. **Particle Cursor Attraction (0:00–0:10)**:
   Hover your mouse over the showcase marketing hero section. Observe the constellation canvas particles drift and connect toward your cursor.
2. **Select Ingestion Preset (0:10–0:30)**:
   Toggle the **Agreements** category pill filter. Select the **Freelance Development Contract** card. Watch the streaming checkpoints animate.
3. **Auditor Overview (0:30–0:45)**:
   Inspect the animated vector risk ring (animates to **8/10**), review the four key metrics, and inspect the todo action items checklists.
4. **Translate into Hindi or Marathi (0:45–0:55)**:
   Use the Language dropdown in the header to swap **English** to **हिन्दी (Hindi)**. Observe the executive assessment block and headers translate in real-time.
5. **Interactive Q&A Chat (0:55–1:10)**:
   Open the **Q&A Chat** tab. Click the recommended query **"What are the biggest traps?"**. Review the localized response generated in Hindi.
6. **Compare Revised Drafts (1:10–1:20)**:
   Open the **Compare Docs** tab and click **Compare with Suggested Counter-Proposal Draft**. Witness the risk dial drop from **8** to **4** and review the green check signoff.
7. **Clause Rewrite Diff (1:20–1:30)**:
   Open the **Negotiate** tab, choose the **Renewal** clause, set the tone to **Aggressive**, and execute the rewrite. Review the Git-style comparisons.

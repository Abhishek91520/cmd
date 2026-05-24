"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Copy, Mail, CheckCircle2, ChevronRight } from "lucide-react";

const TONES = [
  { id: "aggressive", label: "Aggressive", desc: "Push hard for developer protection" },
  { id: "balanced", label: "Balanced", desc: "Fair terms both sides can accept" },
  { id: "friendly", label: "Friendly", desc: "Collaborative, relational alignment" },
];

export default function NegotiationPlayground({ data, modelId }) {
  const [selectedClause, setSelectedClause] = useState(null);
  const [tone, setTone] = useState("balanced");
  const [rewritten, setRewritten] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [copiedText, setCopiedText] = useState(false);

  const risky = data.clauses?.filter((c) => c.risk_level === "high" || c.risk_level === "medium") || [];

  const handleRewrite = async () => {
    if (!selectedClause) return;
    setIsLoading(true);
    setRewritten(null);
    setShowEmail(false);

    try {
      const res = await fetch("/api/rewrite-clause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clauseText: selectedClause.original_text,
          tone,
          context: data.document_summary?.type,
          modelId: modelId || "meta/llama-3.1-70b-instruct"
        }),
      });
      const result = await res.json();
      if (result.success) setRewritten(result.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateEmail = async () => {
    setIsLoading(true);
    setShowEmail(false);
    try {
      const res = await fetch("/api/counter-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          risks: data.hidden_risks || [],
          documentSummary: data.document_summary,
          tone,
          modelId: modelId || "meta/llama-3.1-70b-instruct"
        }),
      });
      const result = await res.json();
      if (result.success) {
        setEmail(result.email);
        setShowEmail(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Settings Pane (col-span-5) */}
      <div className="lg:col-span-5 space-y-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white">Select a Vulnerable Clause</h3>
            <p className="text-xs text-slate-500">AI found {risky.length} candidates for revision.</p>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {risky.map((clause, i) => (
              <button
                key={i}
                onClick={() => { setSelectedClause(clause); setRewritten(null); setShowEmail(false); }}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all relative flex flex-col gap-1 cursor-pointer ${
                  selectedClause?.id === clause.id
                    ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-300"
                    : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white truncate">{clause.title}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${clause.risk_level === "high" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"}`}>
                    {clause.risk_level}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                  {clause.original_text}
                </p>
              </button>
            ))}
          </div>

          {/* Tone Selector */}
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Negotiation Tone
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col justify-center items-center gap-0.5 cursor-pointer ${
                    tone === t.id
                      ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-300"
                      : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="text-xs font-semibold">{t.label}</span>
                  <span className="text-[8px] text-slate-500 hidden sm:block leading-tight">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex gap-2 pt-4 border-t border-slate-800">
          <button
            onClick={handleRewrite}
            disabled={!selectedClause || isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 cursor-pointer
                       bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed
                       text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5" />
            {isLoading && !showEmail ? "Rewriting..." : "Rewrite Clause"}
          </button>
          <button
            onClick={handleGenerateEmail}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 cursor-pointer
                       text-white text-xs font-semibold rounded-xl transition-colors border border-slate-850"
          >
            <Mail className="w-3.5 h-3.5" />
            {isLoading && showEmail ? "Drafting..." : "Email Draft"}
          </button>
        </div>
      </div>

      {/* Right Diff Output Pane (col-span-7) */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-full min-h-[420px] justify-between">
        <div className="flex-1 flex flex-col justify-start">
          {!rewritten && !showEmail && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-20 text-center gap-2">
              <div className="w-12 h-12 rounded-full border border-dashed border-slate-800 flex items-center justify-center text-lg">⚖</div>
              <p>Select a risky clause from the left pane and click "Rewrite Clause" to see a safer, AI-rewritten version with a complete Git-style diff.</p>
            </div>
          )}

          {rewritten && !showEmail && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Clause Comparison</span>
                <span className="text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded uppercase">{tone} Tone</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-red-400 font-bold mb-1">✕ ORIGINAL VULNERABILITY Excerpt</p>
                  <p className="text-xs text-slate-400 bg-red-500/5 border border-red-500/10 
                                rounded-lg p-3 line-through leading-relaxed font-mono">
                    {rewritten.original}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-green-400 font-bold mb-1">✓ SAFER REWRITTEN ALTERNATIVE</p>
                  <p className="text-xs text-slate-200 bg-green-500/5 border border-green-500/10 rounded-lg p-3 leading-relaxed font-mono">
                    {rewritten.rewritten}
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-850 rounded-lg p-3">
                  <p className="text-[9px] text-indigo-400 font-bold mb-1">⚖ REVISION RATIONALE</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{rewritten.justification}</p>
                </div>
              </div>
            </div>
          )}

          {showEmail && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Generated Counter-Proposal Email</span>
                <span className="text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded uppercase">{tone} Tone</span>
              </div>
              <div className="bg-slate-950 border border-slate-850 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {email}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Copy Options */}
        {(rewritten || showEmail) && (
          <div className="pt-4 border-t border-slate-800 mt-4 flex justify-between items-center flex-wrap gap-2">
            <button
              onClick={() => handleCopy(showEmail ? email : rewritten.rewritten)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              {copiedText ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy to clipboard</span>
                </>
              )}
            </button>
            {showEmail && (
              <button
                onClick={() => setShowEmail(false)}
                className="text-[10px] text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                ← Back to clause rewrite comparison
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

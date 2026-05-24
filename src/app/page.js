"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, FileSearch, Sparkles, ArrowRight, Brain, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import UploadZone from "@/components/upload/UploadZone";
import DemoPresets from "@/components/upload/DemoPresets";
import StreamingLoader from "@/components/ui/StreamingLoader";
import ParticleBackground from "@/components/ui/ParticleBackground";
import { useAnalysis } from "@/hooks/useAnalysis";
import { AVAILABLE_MODELS } from "@/lib/models";
import { useEffect, useState, useRef } from "react";

export default function HomePage() {
  const router = useRouter();
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [selectedModel, setSelectedModel] = useState("meta/llama-3.1-70b-instruct");
  const workspaceRef = useRef(null);

  const { status, processingStep, masterData, error, analyzeFile, analyzeDemo } =
    useAnalysis();

  // Navigate to dashboard when analysis completes
  useEffect(() => {
    if (status === "complete" && masterData) {
      // Store in sessionStorage for dashboard page
      sessionStorage.setItem("contractData", JSON.stringify(masterData));
      sessionStorage.setItem("selectedModel", selectedModel);
      router.push("/dashboard");
    }
  }, [status, masterData, router, selectedModel]);

  const handleLaunchWorkspace = () => {
    setShowWorkspace(true);
    setTimeout(() => {
      workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-start">
      {/* Particle constellations in background */}
      <ParticleBackground />

      {/* Glow overlays */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      {/* --- SHOWCASE MARKETING SECTION --- */}
      <div className="relative w-full max-w-6xl mx-auto px-6 pt-12 pb-24 z-10 space-y-24">
        {/* Header/Logo */}
        <header className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <span className="text-sm font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              RiskOS
            </span>
          </div>
          <button
            onClick={handleLaunchWorkspace}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
          >
            Launch Analyzer
          </button>
        </header>

        {/* Hero Area */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-full px-3.5 py-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse-slow" />
            <span className="text-[10px] font-bold text-indigo-300 tracking-widest uppercase">
              Powered by NVIDIA NIM APIs
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Audit and negotiate contracts
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 block mt-2">
              with advanced legal AI.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Ingest contracts instantly. NVIDIA NIM-powered reasoning audits hidden liabilities, structures interactive timelines, and rewrites clauses on-demand.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 pt-4 flex-wrap"
          >
            <button
              onClick={handleLaunchWorkspace}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-xl shadow-indigo-600/25 group text-sm"
            >
              <span>Launch AI Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#models"
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all font-semibold text-sm cursor-pointer text-slate-300"
            >
              Explore AI Models
            </a>
          </motion.div>
        </section>

        {/* Statistics Metric Deck Showcase */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: "98%", label: "Audit Accuracy Score", sub: "Deep reasoning checks", icon: ShieldCheck, color: "text-green-400", bg: "bg-green-500/5 border-green-500/10" },
            { value: "< 1.2s", label: "Model Latency", sub: "NVIDIA NIM response average", icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/5 border-indigo-500/10" },
            { value: "$12M+", label: "Uncovered Exposures", sub: "Discovered contract liabilities", icon: Brain, color: "text-red-400", bg: "bg-red-500/5 border-red-500/10" },
            { value: "40%", label: "Time Savings", sub: "Legal operations optimization", icon: Clock, color: "text-violet-400", bg: "bg-violet-500/5 border-violet-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`p-5 rounded-2xl border ${stat.bg} flex flex-col justify-between`}
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white font-mono">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-300 mt-1">{stat.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Core Capabilities Grids */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">Full-Suite Legal Intelligence</h2>
            <p className="text-xs text-slate-400">Everything you need to audit, understand, and modify high-risk business terms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Shield Vulnerability Audit", desc: "Instantly audits terms, auto-renewals, non-competes, and uncapped liabilities, scoring risks out of 10." },
              { icon: FileSearch, title: "Plain-English Translator", desc: "Converts archaic legalese into clear, understandable summaries, revealing what you are agreeing to." },
              { icon: Brain, title: "Git-Diff Negotiation Playground", desc: "Selects dangerous terms, re-writes them in 3 custom tones (Balanced, Aggressive, Friendly), and drafts counter-proposal emails." },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between group hover:border-slate-700 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NIM Model Comparison Deck */}
        <section id="models" className="space-y-8 border-t border-white/5 pt-16">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">Choose Your NVIDIA NIM Model</h2>
            <p className="text-xs text-slate-400">Select standard general general audits, deep legal reasoning, or rapid summaries.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {AVAILABLE_MODELS.map((model) => {
              const isCurrent = selectedModel === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => handleModelChange(model.id)}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between min-h-[300px] ${
                    isCurrent
                      ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-300 scale-[1.02]"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${model.badgeColor}`}>
                        {model.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{model.provider}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{model.name}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{model.description}</p>
                  </div>

                  <div className="space-y-3 border-t border-white/5 pt-3 mt-4">
                    <div className="flex justify-between items-center text-[10px]">
                      <span>Audit Accuracy:</span>
                      <span className="font-bold text-white font-mono">{model.accuracy}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span>Latency (NIM):</span>
                      <span className="font-bold text-white font-mono">{model.latency}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span>Type:</span>
                      <span className="font-semibold text-indigo-400 font-mono">{model.type}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleModelChange(model.id); handleLaunchWorkspace(); }}
                      className={`w-full py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-indigo-600 text-white hover:bg-indigo-500"
                          : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-850"
                      }`}
                    >
                      {isCurrent ? "Model Selected — Launch" : "Select Model"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* --- ACTIVE DRAWER WORKSPACE SECTION --- */}
      <AnimatePresence>
        {showWorkspace && (
          <section
            ref={workspaceRef}
            className="w-full bg-slate-950 border-t border-indigo-500/20 relative z-20 min-h-screen py-16 px-6"
          >
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
            
            <div className="max-w-3xl w-full mx-auto space-y-8">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 text-xs text-indigo-400 font-semibold uppercase">
                  <span>Selected Model:</span>
                  <span className="font-bold">{AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">Ingestion Workspace</h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Drop your contract PDF or try one of our pre-set demo contracts to run a full interactive audit.
                </p>
              </div>

              {/* Upload Zone */}
              <AnimatePresence mode="wait">
                {status === "idle" || status === "error" || status === "uploading" ? (
                  <motion.div
                    key="upload-workspace"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <UploadZone onFileAccepted={(file) => analyzeFile(file, selectedModel)} />
                    <DemoPresets onSelect={(contract) => analyzeDemo(contract, selectedModel)} />
                    {error && (
                      <p className="text-center text-red-400 text-xs mt-4 bg-red-500/10 border border-red-500/20 rounded-xl py-3 font-semibold font-mono">
                        ⚠ {error}
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="processing-workspace"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6"
                  >
                    <StreamingLoader step={processingStep} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-white/5 text-center text-xs text-slate-600 relative z-10">
        <p>© 2026 RiskOS Inc. All rights reserved. Powered by NVIDIA NIM APIs and Meta Llama Models.</p>
      </footer>
    </main>
  );
}

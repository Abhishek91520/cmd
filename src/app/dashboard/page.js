"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MetricsRow from "@/components/dashboard/MetricsRow";
import RiskScoreCard from "@/components/dashboard/RiskScoreCard";
import TimelineEngine from "@/components/dashboard/TimelineEngine";
import ClauseDecoder from "@/components/dashboard/ClauseDecoder";
import ShieldAudit from "@/components/dashboard/ShieldAudit";
import ActionItems from "@/components/dashboard/ActionItems";
import NegotiationPlayground from "@/components/dashboard/NegotiationPlayground";
import CommandPalette from "@/components/ui/CommandPalette";
import { AVAILABLE_MODELS } from "@/lib/models";
import { Shield, Sparkles, Brain } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModel, setSelectedModel] = useState("meta/llama-3.1-70b-instruct");

  useEffect(() => {
    const stored = sessionStorage.getItem("contractData");
    const model = sessionStorage.getItem("selectedModel");
    if (!stored) {
      router.push("/");
      return;
    }
    setData(JSON.parse(stored));
    if (model) {
      setSelectedModel(model);
    }
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
      {/* Cmd+K Palette */}
      <CommandPalette onNavigate={(tab) => setActiveTab(tab)} />

      {/* Decorative Blur Backdrops */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="truncate flex-1">
            <h1 className="text-xs text-slate-500 font-medium truncate">
              {data.document_summary?.type || "Contract analysis workspace"}
            </h1>
            <p className="text-sm font-bold text-white truncate mt-0.5">
              {data.document_summary?.title || "Contract Analysis"}
            </p>
          </div>
          <RiskBadge level={data.risk_score?.level} />
        </div>

        {/* Dynamic Model Dropdown and navigation buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap w-full sm:w-auto flex-shrink-0">
          {/* NIM Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedModel}
              onChange={(e) => { setSelectedModel(e.target.value); sessionStorage.setItem("selectedModel", e.target.value); }}
              className="bg-transparent text-xs text-slate-200 outline-none pr-6 cursor-pointer font-semibold border-none focus:ring-0"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200 text-xs">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-500 font-mono">
              <span>Press</span>
              <span className="font-bold">Ctrl + K</span>
            </kbd>
            <button
              onClick={() => { sessionStorage.clear(); router.push("/"); }}
              className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              ← Close
            </button>
          </div>
        </div>
      </header>

      {/* Tab Switcher Grid */}
      <nav className="border-b border-slate-900 bg-slate-950/40 px-6">
        <div className="flex gap-1 overflow-x-auto max-w-7xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all relative cursor-pointer flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500"
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Workspace Content rendering area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Executive summary block */}
                <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Executive AI Assessment — {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}
                    </h3>
                    <p className="text-sm text-slate-200 leading-relaxed max-w-3xl">
                      {data.document_summary?.summary}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono self-end md:self-center">
                    Jurisdiction: <span className="text-slate-300 font-semibold">{data.document_summary?.jurisdiction || "Not Specified"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
                  <div className="lg:col-span-1">
                    <RiskScoreCard data={data.risk_score} />
                  </div>
                  <div className="lg:col-span-3">
                    <MetricsRow data={data} />
                  </div>
                </div>

                {/* Priority checklist */}
                <ActionItems items={data.action_items} />
              </div>
            )}
            
            {activeTab === "clauses" && <ClauseDecoder clauses={data.clauses} />}
            {activeTab === "shield" && <ShieldAudit risks={data.hidden_risks} />}
            {activeTab === "timeline" && <TimelineEngine deadlines={data.deadlines} />}
            {activeTab === "negotiate" && <NegotiationPlayground data={data} modelId={selectedModel} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function RiskBadge({ level }) {
  const colors = {
    high: "bg-red-500/10 text-red-400 border-red-500/30",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    low: "bg-green-500/10 text-green-400 border-green-500/30",
  };
  const current = colors[level] || colors.medium;
  return (
    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase ${current} tracking-wide`}>
      {level || "medium"} risk
    </span>
  );
}

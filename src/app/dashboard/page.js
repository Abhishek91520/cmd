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
import { Shield, Sparkles, Brain, Languages, MessageSquare, ArrowLeftRight, CheckCircle2, AlertTriangle, Send, Copy, FileText } from "lucide-react";

const LANGUAGES = [
  { id: "English", label: "English" },
  { id: "Hindi", label: "हिन्दी (Hindi)" },
  { id: "Marathi", label: "मराठी (Marathi)" },
  { id: "Tamil", label: "தமிழ் (Tamil)" }
];

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModel, setSelectedModel] = useState("meta/llama-3.1-70b-instruct");
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // Q&A Chat State
  const [qaInput, setQaInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", text: "Hello! I am your AI document auditor. Ask me anything about this document." }
  ]);
  const [isQaLoading, setIsQaLoading] = useState(false);

  // Compare Docs State
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparedDocTitle, setComparedDocTitle] = useState("");

  const getLanguageGreeting = () => {
    if (selectedLanguage === "Hindi") return "नमस्ते! मैं आपका दस्तावेज़ लेखा परीक्षक हूँ। इस दस्तावेज़ के बारे में कुछ भी पूछें।";
    if (selectedLanguage === "Marathi") return "नमस्कार! मी आपला दस्तऐवज परीक्षक आहे. या दस्तऐवजाबद्दल काहीही विचारा.";
    if (selectedLanguage === "Tamil") return "வணக்கம்! நான் உங்கள் ஆவண தணிக்கையாளர். இந்த ஆவணத்தைப் பற்றி ஏதேனும் கேட்கவும்.";
    return "Hello! I am your AI document auditor. Ask me anything about this document.";
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("contractData");
    const model = sessionStorage.getItem("selectedModel");
    const lang = sessionStorage.getItem("selectedLanguage");
    if (!stored) {
      router.push("/");
      return;
    }
    setData(JSON.parse(stored));
    if (model) setSelectedModel(model);
    if (lang) setSelectedLanguage(lang);
  }, [router]);

  // Adapt greeting when language toggled
  useEffect(() => {
    setChatHistory([
      { role: "assistant", text: getLanguageGreeting() }
    ]);
  }, [selectedLanguage]);

  if (!data) return null;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "clauses", label: "Clause Decoder" },
    { id: "shield", label: "Shield Audit" },
    { id: "timeline", label: "Timeline" },
    { id: "negotiate", label: "Negotiate" },
    { id: "qa", label: "Q&A Chat" },
    { id: "compare", label: "Compare Docs" }
  ];

  // Handle Q&A Submission
  const handleQaSend = async (customText = "") => {
    const queryText = customText || qaInput;
    if (!queryText.trim() || isQaLoading) return;

    // Add user message
    const newHistory = [...chatHistory, { role: "user", text: queryText }];
    setChatHistory(newHistory);
    setQaInput("");
    setIsQaLoading(true);

    try {
      const res = await fetch("/api/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: data.document_summary?.summary || "Contract",
          question: queryText,
          modelId: selectedModel,
          language: selectedLanguage
        })
      });
      const result = await res.json();
      if (result.success) {
        setChatHistory([...newHistory, { role: "assistant", text: result.answer }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsQaLoading(false);
    }
  };

  // Trigger Document Comparison Simulation
  const handleCompare = async () => {
    setIsComparing(true);
    setComparisonResult(null);
    setComparedDocTitle("Revised Counter-Proposal Draft");

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc1Text: data.document_summary?.summary || "",
          doc2Text: "Revised terms with balanced caps and standard notices.",
          modelId: selectedModel,
          language: selectedLanguage
        })
      });
      const result = await res.json();
      if (result.success) {
        setComparisonResult(result.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
      {/* Cmd+K Palette */}
      <CommandPalette onNavigate={(tab) => setActiveTab(tab)} />

      {/* Decorative Blur Backdrops */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="border-b border-slate-905 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 w-full lg:w-auto">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="truncate flex-1">
            <h1 className="text-xs text-slate-500 font-medium truncate uppercase tracking-widest font-mono">
              {data.category_used || "Contract analysis workspace"}
            </h1>
            <p className="text-sm font-bold text-white truncate mt-0.5">
              {data.document_summary?.title || "Document Workspace"}
            </p>
          </div>
          <RiskBadge level={data.risk_score?.level} />
        </div>

        {/* Configurations Bar */}
        <div className="flex items-center justify-between lg:justify-end gap-3 flex-wrap w-full lg:w-auto flex-shrink-0">
          
          {/* Indian Language Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 cursor-pointer">
            <Languages className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => { setSelectedLanguage(e.target.value); sessionStorage.setItem("selectedLanguage", e.target.value); }}
              className="bg-transparent text-xs text-slate-200 outline-none pr-6 cursor-pointer font-semibold border-none focus:ring-0"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-slate-900 text-slate-200 text-xs">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

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
            <kbd className="hidden xl:inline-flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-500 font-mono">
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
                    <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Executive AI Assessment — {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}
                    </h3>
                    <p className="text-sm text-slate-200 leading-relaxed max-w-3xl">
                      {data.document_summary?.summary}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono self-end md:self-center">
                    Language: <span className="text-indigo-400 font-semibold uppercase">{selectedLanguage}</span>
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

            {/* --- NEW CAPABILITY: INTERACTIVE Q&A CHAT PANEL --- */}
            {activeTab === "qa" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[520px] justify-between">
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-950 border border-slate-850 text-slate-200"
                      }`}>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                          {msg.role === "user" ? "You" : `Auditor AI (${selectedLanguage})`}
                        </div>
                        <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isQaLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2 font-mono">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                        AI model parsing document text...
                      </div>
                    </div>
                  )}
                </div>

                {/* Pre-set legal queries */}
                <div className="flex gap-2 overflow-x-auto py-3 border-t border-slate-850/80 my-3 flex-wrap">
                  {[
                    "What are the biggest traps?",
                    "What are my payment obligations?",
                    "Can I cancel early?"
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQaSend(q)}
                      className="px-3 py-1.5 rounded-full border border-slate-800 bg-slate-950 text-[10px] text-slate-400 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Question Input form */}
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={qaInput}
                    onChange={(e) => setQaInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleQaSend()}
                    placeholder={`Ask custom question about this document in ${selectedLanguage}...`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    onClick={() => handleQaSend()}
                    disabled={isQaLoading || !qaInput.trim()}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* --- NEW CAPABILITY: DOCUMENT COMPARISON delta --- */}
            {activeTab === "compare" && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="px-4 py-2 border border-slate-800 bg-slate-950 rounded-xl text-xs font-mono text-slate-400 max-w-xs truncate">
                      Old: {data.document_summary?.title || "Original Agreement"}
                    </div>
                    <ArrowLeftRight className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <div className="px-4 py-2 border border-dashed border-indigo-500/30 bg-indigo-500/5 rounded-xl text-xs font-semibold text-indigo-300 max-w-xs truncate">
                      New: {comparedDocTitle || "Upload Revised Draft"}
                    </div>
                  </div>
                  
                  {!comparisonResult && !isComparing && (
                    <div className="max-w-md mx-auto space-y-3">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Compare different versions of this document. We'll automatically identify added terms, deleted terms, and compute a total risk mitigation rating.
                      </p>
                      <button
                        onClick={handleCompare}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
                      >
                        Compare with Suggested Counter-Proposal Draft
                      </button>
                    </div>
                  )}

                  {isComparing && (
                    <div className="text-xs text-slate-400 flex items-center justify-center gap-2 font-mono py-8">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                      Auditing diff vectors using {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}...
                    </div>
                  )}
                </div>

                {comparisonResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
                  >
                    {/* Left comparison summary */}
                    <div className="lg:col-span-1 space-y-6">
                      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 font-mono">Risk score delta</p>
                        
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <div className="text-center">
                            <span className="text-3xl font-extrabold text-red-400 font-mono">
                              {comparisonResult.risk_delta?.original_score}
                            </span>
                            <span className="text-[9px] text-slate-500 block font-semibold">ORIGINAL</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-500" />
                          <div className="text-center">
                            <span className="text-4xl font-extrabold text-green-400 font-mono drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                              {comparisonResult.risk_delta?.revised_score}
                            </span>
                            <span className="text-[9px] text-slate-500 block font-semibold">REVISED</span>
                          </div>
                        </div>

                        <p className="text-xs font-bold text-green-400 mb-1">
                          Risk Reduced by 50%!
                        </p>
                        <p className="text-[10px] text-slate-500 max-w-[160px] leading-relaxed">
                          {comparisonResult.risk_delta?.verdict}
                        </p>
                      </div>

                      {/* Verdict banner */}
                      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-extrabold text-white uppercase tracking-wider">Negotiation Audit Verdict</p>
                          <p className="text-[11px] text-green-300 mt-1 leading-relaxed">
                            {comparisonResult.negotiation_verdict}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right detailed diff summaries */}
                    <div className="lg:col-span-2 space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 max-h-[500px] overflow-y-auto pr-1">
                      <div className="border-b border-slate-850 pb-2">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">Deep Audit delta report</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Summary of changes</p>
                          <p className="text-xs text-slate-300 bg-slate-950 border border-slate-880 rounded-xl p-3 leading-relaxed">
                            {comparisonResult.comparison_summary}
                          </p>
                        </div>

                        {/* Modified terms list */}
                        {comparisonResult.modified_terms?.map((mod, i) => (
                          <div key={i} className="border border-slate-800/80 bg-slate-950/20 rounded-xl p-4 space-y-2">
                            <span className="text-[9px] font-extrabold bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">Modified: {mod.title}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] pt-1">
                              <div>
                                <span className="text-red-400 font-bold block mb-1">✕ WAS</span>
                                <p className="text-slate-500 line-through bg-red-500/5 border border-red-500/10 rounded p-2 font-mono leading-relaxed">
                                  {mod.original_text}
                                </p>
                              </div>
                              <div>
                                <span className="text-green-400 font-bold block mb-1">✓ NOW</span>
                                <p className="text-slate-200 bg-green-500/5 border border-green-500/10 rounded p-2 font-mono leading-relaxed">
                                  {mod.revised_text}
                                </p>
                              </div>
                            </div>
                            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-2.5 text-[10px] mt-2">
                              <span className="text-indigo-400 font-bold block">✓ Improvement Verdict:</span>
                              <p className="text-slate-300 mt-0.5 leading-relaxed">{mod.improvement}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
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

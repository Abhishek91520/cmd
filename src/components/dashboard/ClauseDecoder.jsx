"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ClauseDecoder({ clauses }) {
  const [selectedId, setSelectedId] = useState(clauses?.[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");

  if (!clauses || clauses.length === 0) {
    return <div className="text-slate-500 py-12 text-center">No clauses parsed.</div>;
  }

  const selectedClause = clauses.find((c) => c.id === selectedId) || clauses[0];

  const filtered = clauses.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.original_text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskIcon = (level) => {
    switch (level) {
      case "high":
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case "medium":
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case "low":
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    }
  };

  const getRiskStyles = (level) => {
    switch (level) {
      case "high":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "medium":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "low":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      default:
        return "bg-green-500/10 border-green-500/30 text-green-400";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[600px] h-auto items-stretch">
      {/* Left Sidebar List */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[300px] lg:h-full">
        {/* Search */}
        <div className="relative mb-4 flex-shrink-0">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clauses..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl 
                       text-xs text-white focus:outline-none focus:border-slate-700 placeholder:text-slate-500"
          />
        </div>

        {/* List scroll */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 cursor-pointer ${
                selectedId === c.id
                  ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-300"
                  : "bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="truncate">
                <p className="font-semibold text-white truncate">{c.title}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{c.section || "General"}</p>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase flex-shrink-0 ${getRiskStyles(c.risk_level)}`}>
                {c.risk_level}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-slate-600 text-center py-8">No matching clauses found.</p>
          )}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col h-auto lg:h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedClause ? (
            <motion.div
              key={selectedClause.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5 overflow-y-auto h-full pr-1"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-880 pb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
                    {selectedClause.section || "General Section"}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5 leading-tight">
                    {selectedClause.title}
                  </h3>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold ${getRiskStyles(selectedClause.risk_level)}`}>
                  {getRiskIcon(selectedClause.risk_level)}
                  <span className="uppercase">{selectedClause.risk_level} RISK</span>
                </div>
              </div>

              {/* Original text */}
              <div>
                <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-1.5">
                  Original Legal Text
                </p>
                <div className="bg-slate-950/80 border border-slate-880 rounded-xl p-4 text-xs font-mono text-slate-400 leading-relaxed max-h-40 overflow-y-auto">
                  {selectedClause.original_text}
                </div>
              </div>

              {/* Plain English Translation */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5 text-indigo-400">
                  <Eye className="w-4 h-4" />
                  <p className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase">
                    Plain-English Decoder
                  </p>
                </div>
                <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-4 text-xs text-slate-200 leading-relaxed">
                  {selectedClause.plain_english}
                </div>
              </div>

              {/* Risk explanation if dangerous */}
              {selectedClause.risk_level !== "safe" && selectedClause.risk_reason && (
                <div>
                  <p className="text-[10px] text-red-400 font-bold tracking-wider uppercase mb-1.5">
                    ⚠ Legal Vulnerability Verdict
                  </p>
                  <p className="text-xs text-slate-300 bg-red-500/5 border border-red-500/10 rounded-xl p-4 leading-relaxed">
                    {selectedClause.risk_reason}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-600 text-sm py-12">
              Select a clause from the sidebar to inspect its details
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

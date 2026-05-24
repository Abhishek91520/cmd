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
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors focus:outline-none"
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
                <p className="text-[10px] text-slate-500 font-bold mb-1">WHY IT MATTERS</p>
                <p className="text-sm text-slate-300">{risk.why_it_matters}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold mb-1">POTENTIAL IMPACT</p>
                <p className="text-sm text-slate-300">{risk.potential_impact}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-xs text-green-400 font-semibold mb-1">✓ SAFER ALTERNATIVE</p>
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
  const [showAll, setShowAll] = useState(false);

  if (!risks || risks.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 bg-slate-900/50 border border-slate-800 rounded-2xl">
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
                className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${config.bg} ${config.color} ${config.border}`}>
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
          className="w-full py-2 text-sm text-slate-400 hover:text-white cursor-pointer
                     border border-slate-800 rounded-xl hover:border-slate-600 transition-colors"
        >
          {showAll ? "Show less" : `Show ${risks.length - 5} more risks`}
        </button>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { DEMO_CONTRACTS } from "@/lib/demo-contracts";
import { FileText, Receipt, Shield, Activity, Landmark, CreditCard } from "lucide-react";

const riskColors = {
  high: "text-red-400 bg-red-500/10 border-red-500/30",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  low: "text-green-400 bg-green-500/10 border-green-500/30",
};

const CATEGORIES = [
  { id: "all", label: "All Docs", icon: FileText },
  { id: "Contract / Agreement", label: "Agreements", icon: Shield },
  { id: "Invoice / Receipt", label: "Invoices", icon: Receipt },
  { id: "Medical Report", label: "Medical", icon: Activity },
  { id: "Property Document", label: "Property", icon: Landmark },
  { id: "Tax Document", label: "Tax", icon: CreditCard },
  { id: "ID Document", label: "ID Cards", icon: FileText },
];

export default function DemoPresets({ onSelect }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = Object.values(DEMO_CONTRACTS).filter((contract) => {
    if (activeCategory === "all") return true;
    return contract.category === activeCategory;
  });

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-bold text-center">
          — Select Document Category —
        </p>
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 flex-wrap">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                  isActive
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                    : "bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.map((contract, i) => (
          <motion.button
            key={contract.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(contract)}
            className="text-left p-4 rounded-xl bg-slate-900 border border-slate-800/80 
                       hover:border-slate-600 hover:bg-slate-800 transition-all duration-200 
                       group flex flex-col justify-between cursor-pointer min-h-[140px]"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xl">{contract.icon}</span>
                <span className="text-[8px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                  {contract.category?.split(" / ")[0]}
                </span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-indigo-300 
                            transition-colors mb-1 truncate">
                {contract.title}
              </p>
              <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                {contract.description}
              </p>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase inline-block w-max
                             ${riskColors[contract.riskLevel]}`}>
              {contract.riskLevel} risk
            </span>
          </motion.button>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <p className="text-xs text-slate-600 text-center py-6">No presets available for this category yet. Upload a custom document above!</p>
      )}
    </div>
  );
}

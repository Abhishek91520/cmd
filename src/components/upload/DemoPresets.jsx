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
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-medium text-center">
        — or try a demo contract —
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
                       group flex flex-col justify-between"
          >
            <div>
              <div className="text-2xl mb-2">{contract.icon}</div>
              <p className="text-sm font-semibold text-white group-hover:text-indigo-300 
                            transition-colors mb-1">
                {contract.title}
              </p>
              <p className="text-xs text-slate-500 mb-3">{contract.description}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium inline-block w-max
                             ${riskColors[contract.riskLevel]}`}>
              {contract.riskLevel} risk
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

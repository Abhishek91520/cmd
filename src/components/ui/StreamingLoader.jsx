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

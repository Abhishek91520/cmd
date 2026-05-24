"use client";
import { motion } from "framer-motion";

export default function RiskScoreCard({ data }) {
  if (!data) return null;
  const score = data.score || 0;
  const level = data.level || "medium";

  const color = { high: "#EF4444", medium: "#F59E0B", low: "#10B981" }[level];
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 10) * circumference;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center h-full
                    flex flex-col items-center justify-center">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-4 font-medium">
        Risk Score
      </p>

      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90">
          <circle cx="72" cy="72" r="54" fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <motion.circle
            cx="72" cy="72" r="54" fill="none"
            stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-4xl font-bold"
            style={{ color }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-slate-500 font-medium">/10</span>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold" style={{ color }}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </p>
      <p className="text-xs text-slate-500 mt-1 max-w-[150px]">
        {data.summary || "Review required before signing"}
      </p>
    </div>
  );
}

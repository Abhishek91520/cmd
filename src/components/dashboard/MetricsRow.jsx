"use client";
import { motion } from "framer-motion";
import { DollarSign, Clock, AlertTriangle, Calendar } from "lucide-react";

export default function MetricsRow({ data }) {
  const metrics = [
    {
      icon: DollarSign,
      label: "Financial Exposure",
      value: data.financial_obligations?.[0]?.total_exposure || "—",
      sub: "Total identified",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      icon: AlertTriangle,
      label: "Hidden Risks",
      value: data.hidden_risks?.length || 0,
      sub: "Dangerous clauses",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      icon: Calendar,
      label: "Next Deadline",
      value: data.deadlines?.[0]?.date?.split(" (")?.[0] || "—",
      sub: data.deadlines?.[0]?.description || "No deadlines found",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: Clock,
      label: "Action Items",
      value: data.action_items?.length || 0,
      sub: "Required steps",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`${m.bg} border ${m.border} rounded-2xl p-5 flex flex-col justify-between`}
        >
          <div>
            <div className={`w-8 h-8 rounded-lg ${m.bg} border ${m.border} 
                            flex items-center justify-center mb-3`}>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <p className="text-xl font-bold text-white mb-0.5 break-words line-clamp-2 leading-tight">
              {m.value}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300">{m.label}</p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{m.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

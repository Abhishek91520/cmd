"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Square, AlertCircle, ArrowRight } from "lucide-react";

export default function ActionItems({ items }) {
  const [completed, setCompleted] = useState({});

  if (!items || items.length === 0) return null;

  const toggleItem = (index) => {
    setCompleted((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const priorityStyles = {
    urgent: "bg-red-500/10 border-red-500/30 text-red-400",
    high: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    medium: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    low: "bg-green-500/10 border-green-500/30 text-green-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            Priority Action Checklist
          </h2>
          <p className="text-sm text-slate-400">
            Recommended steps to protect your interests before executing this agreement.
          </p>
        </div>
        <span className="text-xs bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-slate-400 font-semibold font-mono">
          {Object.values(completed).filter(Boolean).length} / {items.length} DONE
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => {
          const isDone = !!completed[index];
          const style = priorityStyles[item.priority] || priorityStyles.medium;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleItem(index)}
              className={`p-4 border rounded-xl flex items-start gap-3 cursor-pointer transition-all duration-200 select-none ${
                isDone
                  ? "bg-slate-900/20 border-slate-900 text-slate-500"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-indigo-500" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600 hover:text-indigo-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold leading-none ${isDone ? "line-through text-slate-600" : "text-white"}`}>
                    {item.action}
                  </span>
                  {!isDone && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${style}`}>
                      {item.priority}
                    </span>
                  )}
                </div>
                <p className={`text-xs leading-relaxed ${isDone ? "line-through text-slate-700" : "text-slate-400"}`}>
                  {item.reason}
                </p>
                {item.deadline && !isDone && (
                  <p className="text-[10px] font-mono text-indigo-400 mt-1 flex items-center gap-1">
                    <span>Deadline Target:</span>
                    <span className="font-bold">{item.deadline}</span>
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

export default function TimelineEngine({ deadlines }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!deadlines || deadlines.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 bg-slate-900/50 border border-slate-800 rounded-2xl">
        <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30 text-green-400" />
        <p>No critical deadlines found in this contract.</p>
      </div>
    );
  }

  const urgencyColors = {
    high: "bg-red-500 border-red-400 text-red-400 text-red-500/20",
    medium: "bg-amber-500 border-amber-400 text-amber-400 text-amber-500/20",
    low: "bg-blue-500 border-blue-400 text-blue-400 text-blue-500/20",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Interactive Deadline Timeline
        </h2>
        <p className="text-sm text-slate-400">
          Visual schedule of critical renewal, payment, and notice milestones.
        </p>
      </div>

      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 overflow-hidden">
        {/* Visual Timeline Path */}
        <div className="absolute left-12 top-8 bottom-8 w-[2px] bg-slate-800 hidden md:block" />

        <div className="space-y-8 relative">
          {deadlines.map((item, index) => {
            const urgencyClass = urgencyColors[item.urgency] || urgencyColors.medium;
            const colors = urgencyClass.split(" ");
            const isHovered = hoverIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                className="flex flex-col md:flex-row gap-4 md:gap-8 items-start relative cursor-pointer"
              >
                {/* Visual node indicator */}
                <div className="flex items-center justify-center z-10">
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.25 : 1,
                      boxShadow: isHovered ? `0 0 12px ${colors[2]}` : "none",
                    }}
                    className={`w-8 h-8 rounded-full border-2 ${colors[1]} ${colors[0]} flex items-center justify-center text-slate-950 font-bold text-xs`}
                  >
                    {index + 1}
                  </motion.div>
                </div>

                {/* Deadline Content Card */}
                <motion.div
                  animate={{
                    borderColor: isHovered ? "rgba(99, 102, 241, 0.4)" : "rgba(255,255,255,0.05)",
                    backgroundColor: isHovered ? "rgba(99, 102, 241, 0.03)" : "rgba(15, 23, 42, 0.4)",
                  }}
                  className="flex-1 border bg-slate-950/40 p-5 rounded-xl transition-all duration-300 w-full"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-mono font-bold text-indigo-300">
                      {item.date?.split(" (")?.[0]}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase w-max ${item.urgency === "high" ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"}`}>
                      {item.urgency} urgency
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white mb-2">
                    {item.description}
                  </p>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/5 mt-3 pt-3 space-y-2 text-xs"
                      >
                        <div className="flex items-center gap-1.5 text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span className="font-semibold uppercase tracking-wider text-[10px]">
                            Missed Deadline Consequence
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed pl-5">
                          {item.consequence}
                        </p>
                        
                        <div className="flex items-center gap-1 text-slate-500 pl-5 pt-1">
                          <span>Milestone Type:</span>
                          <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[9px] bg-indigo-500/10 px-1.5 py-0.5 rounded">
                            {item.type}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isHovered && (
                    <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                      <span>Hover to inspect consequence</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

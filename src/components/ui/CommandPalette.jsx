"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, Calendar, DollarSign, FileText } from "lucide-react";

const COMMANDS = [
  { icon: Shield, label: "Show high-risk clauses (Shield Audit)", tab: "shield" },
  { icon: Calendar, label: "View deadlines timeline (Timeline)", tab: "timeline" },
  { icon: DollarSign, label: "Financial obligations (Overview)", tab: "overview" },
  { icon: FileText, label: "Clause decoder panel (Clause Decoder)", tab: "clauses" },
];

export default function CommandPalette({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-full max-w-md bg-slate-900 border border-slate-700 
                       rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-slate-800">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search risks, clauses, deadlines..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
              />
              <kbd className="text-[10px] bg-slate-800 border border-slate-750 rounded px-1.5 py-0.5 text-slate-400 font-mono">
                ESC
              </kbd>
            </div>
            <div className="p-2 max-h-60 overflow-y-auto">
              {filtered.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => { onNavigate(cmd.tab); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
                             text-xs text-slate-300 hover:bg-slate-800 hover:text-white 
                             transition-colors text-left"
                >
                  <cmd.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="flex-1 truncate">{cmd.label}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-[11px] text-slate-600 text-center py-6">No matching actions found.</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

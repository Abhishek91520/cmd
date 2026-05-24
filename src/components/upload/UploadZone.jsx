"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, AlertCircle } from "lucide-react";

export default function UploadZone({ onFileAccepted }) {
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError(null);
      if (rejectedFiles.length > 0) {
        setError("Only PDF and TXT files under 10MB are supported.");
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  return (
    <motion.div
      {...getRootProps()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
        transition-all duration-300
        ${isDragActive
          ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
          : "border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/50"
        }
      `}
    >
      <input {...getInputProps()} />

      {/* Animated background glow on drag */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl bg-indigo-500/5 blur-xl"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ y: isDragActive ? -8 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 
                     flex items-center justify-center"
        >
          {isDragActive ? (
            <FileText className="w-8 h-8 text-indigo-400" />
          ) : (
            <Upload className="w-8 h-8 text-slate-400" />
          )}
        </motion.div>

        <div>
          <p className="text-lg font-semibold text-white mb-1">
            {isDragActive ? "Drop to analyze" : "Drop your contract here"}
          </p>
          <p className="text-sm text-slate-400">
            PDF or TXT · Max 10MB ·{" "}
            <span className="text-indigo-400 hover:underline">
              Browse files
            </span>
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

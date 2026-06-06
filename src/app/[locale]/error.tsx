"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: Report to error reporting service like Sentry
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red" />
        </div>
        
        <h1 className="font-hindi text-4xl text-black dark:text-white font-bold mb-4">
          Something went wrong
        </h1>
        
        <p className="font-body text-black/60 dark:text-white/60 mb-8 leading-relaxed">
          We encountered an unexpected error while processing your request. Please try again or return to the home page.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black font-mono text-xs tracking-widest uppercase font-bold px-6 py-4 rounded-xl hover:bg-black/80 dark:hover:bg-white/80 transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-red text-white font-mono text-xs tracking-widest uppercase font-bold px-6 py-4 rounded-xl hover:bg-red/90 transition-colors"
          >
            <Home size={16} />
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

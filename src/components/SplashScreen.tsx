/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Cpu, HardDrive, RefreshCw } from "lucide-react";
import TeyzixLogo from "./TeyzixLogo";

interface SplashScreenProps {
  onComplete: () => void;
  isLoadingData: boolean;
}

export default function SplashScreen({
  onComplete,
  isLoadingData,
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Teyzix Core...");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        const step = Math.floor(Math.random() * 15) + 5;
        const next = Math.min(100, prev + step);

        if (next < 30) {
          setStatusText("Resolving secure system handshake (TLS v1.3)...");
        } else if (next < 60) {
          setStatusText(
            "Synchronizing analytics indices & cashflow databases...",
          );
        } else if (next < 90) {
          setStatusText("Caching regional telemetry vectors...");
        } else {
          setStatusText("Decrypting executive dashboard parameters...");
        }

        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100 && !isLoadingData) {
      const timeout = setTimeout(() => {
        setIsVisible(false);

        const exitTimeout = setTimeout(() => {
          onComplete();
        }, 500);
        return () => clearTimeout(exitTimeout);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, isLoadingData, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 text-white select-none overflow-hidden"
          id="teyzix-splash-screen"
        >
          {/* Futuristic ambient backing lights */}
          <span className="absolute top-1/4 left-1/4 w-[360px] h-[360px] bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-[100px] pointer-events-none"></span>
          <span className="absolute bottom-1/4 right-1/4 w-[360px] h-[360px] bg-cyan-500/10 dark:bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none"></span>

          <div className="relative flex flex-col items-center max-w-md w-full px-8 text-center space-y-6">
            {/* Spinning ring backdrop around Logo */}
            <div className="relative">
              <span className="absolute inset-0 rounded-full border border-indigo-500/25 border-dashed animate-spin duration-10000 scale-125"></span>

              {/* Pulsing scale logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 70, delay: 0.1 }}
                className="relative z-10"
              >
                <TeyzixLogo className="w-24 h-24" glow={true} />
              </motion.div>
            </div>

            {/* Typography */}
            <div className="space-y-1.5">
              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-2xl font-black tracking-widest font-sans text-white uppercase"
              >
                Teyzix{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-medium">
                  Analytics
                </span>
              </motion.h1>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold"
              >
                Secure Executive Intelligence Suite
              </motion.p>
            </div>

            {/* Premium Loading Progress Bar */}
            <div className="w-full space-y-2 pt-4">
              <div className="w-full bg-zinc-900 border border-zinc-850/60 h-1.5 rounded-full overflow-hidden p-[2px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-indigo-600 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-550">
                <span className="font-bold flex items-center gap-1">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin text-cyan-400 shrink-0" />
                  {statusText}
                </span>
                <span className="font-bold text-zinc-400">{progress}%</span>
              </div>
            </div>

            {/* Security Protocol Badges Footer */}
            <div className="grid grid-cols-3 gap-2.5 w-full pt-6 border-t border-zinc-900 mt-6 text-[9px] font-mono font-bold text-zinc-500">
              <div className="flex items-center justify-center gap-1 p-1 bg-zinc-90 w/40 border border-zinc-900 rounded-lg">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>SSL OK</span>
              </div>
              <div className="flex items-center justify-center gap-1 p-1 bg-zinc-90 w/40 border border-zinc-900 rounded-lg">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>UTC 11.06</span>
              </div>
              <div className="flex items-center justify-center gap-1 p-1 bg-zinc-90 w/40 border border-zinc-900 rounded-lg">
                <HardDrive className="w-3 h-3 text-indigo-400" />
                <span>WDB SYNCED</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

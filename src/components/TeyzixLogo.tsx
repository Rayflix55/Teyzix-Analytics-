/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface TeyzixLogoProps {
  className?: string;
  glow?: boolean;
}

export default function TeyzixLogo({
  className = "w-10 h-10",
  glow = false,
}: TeyzixLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${glow ? "layer-glow" : ""}`}
      id="teyzix-brand-box"
    >
      {/* Dynamic subtle ambient backdrop light */}
      {glow && (
        <span className="absolute inset-0 rounded-full bg-indigo-500/25 dark:bg-indigo-400/20 blur-xl animate-pulse scale-125"></span>
      )}

      <svg
        className={`relative ${className}`}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="teyzix-logo-svg"
      >
        <defs>
          {/* Main sleek cyan to high-contrast deep purple gradient for face facets */}
          <linearGradient
            id="tz-grad-cyan-indigo"
            x1="0"
            y1="0"
            x2="120"
            y2="120"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan */}
            <stop offset="50%" stopColor="#4f46e5" /> {/* Indigo */}
            <stop offset="100%" stopColor="#7c3aed" /> {/* Purple */}
          </linearGradient>

          {/* Accent secondary gradient for intersecting geometric wings */}
          <linearGradient
            id="tz-grad-amber-rose"
            x1="120"
            y1="20"
            x2="0"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f59e0b" /> {/* Amber */}
            <stop offset="100%" stopColor="#ec4899" /> {/* Pink/Rose */}
          </linearGradient>

          {/* Core high-contrast glass highlights */}
          <linearGradient
            id="tz-glass-sheen"
            x1="20"
            y1="20"
            x2="100"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Hexagonal Shield Boundary for Tech Authority style */}
        <polygon
          points="60,6 112,36 112,96 60,114 8,96 8,36"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-zinc-200/40 dark:text-zinc-800/60"
        />

        {/* Isometric interlocking ribbons to create the letter 'T' */}
        {/* Left top horizontal arm facet of 'T' */}
        <polygon
          points="24,34 58,48 58,36 24,22"
          fill="url(#tz-grad-cyan-indigo)"
        />

        {/* Right top horizontal arm facet of 'T' */}
        <polygon
          points="58,48 96,34 96,22 58,36"
          fill="url(#tz-grad-cyan-indigo)"
          opacity="0.9"
        />

        {/* Central stem prism column of 'T' - Left face */}
        <polygon
          points="52,48 52,94 36,84 36,38"
          fill="url(#tz-grad-cyan-indigo)"
          opacity="0.8"
        />

        {/* Central stem prism column of 'T' - Right face */}
        <polygon
          points="52,48 68,38 68,84 52,94"
          fill="url(#tz-grad-amber-rose)"
        />

        {/* Top Flat Surface Hex-Head */}
        <polygon
          points="58,36 82,26 58,16 34,26"
          fill="url(#tz-grad-cyan-indigo)"
          opacity="0.95"
        />

        {/* Upper glass highlight streak */}
        <path
          d="M 28,26 L 58,38 L 88,26"
          stroke="url(#tz-glass-sheen)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Central core node sensor representing precision data */}
        <circle
          cx="60"
          cy="42"
          r="4.5"
          fill="#10b981"
          className="animate-pulse shadow-sm"
        />
      </svg>
    </div>
  );
}

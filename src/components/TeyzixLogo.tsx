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

        {/* Isometric interlocking ribbons to create a perfect symmetrical, 3D premium industrial 'T' */}
        {/* 1. Flat Top Cap Surface of the T Crossbar */}
        <polygon
          points="60,14 96,26 60,38 24,26"
          fill="url(#tz-grad-cyan-indigo)"
          opacity="0.95"
          id="teyzix-logo-top-cap"
        />

        {/* 2. Left Front Face of the T Crossbar (Shadow Side) */}
        <polygon
          points="24,26 60,38 60,50 24,38"
          fill="url(#tz-grad-cyan-indigo)"
          opacity="0.75"
          id="teyzix-logo-left-arm"
        />

        {/* 3. Right Front Face of the T Crossbar (Light Side) */}
        <polygon
          points="60,38 96,26 96,38 60,50"
          fill="url(#tz-grad-cyan-indigo)"
          opacity="0.95"
          id="teyzix-logo-right-arm"
        />

        {/* 4. Vertical Stem of the 'T' - Left Shadow Face */}
        <polygon
          points="48,46 60,50 60,96 48,92"
          fill="url(#tz-grad-cyan-indigo)"
          opacity="0.65"
          id="teyzix-logo-stem-left"
        />

        {/* 5. Vertical Stem of the 'T' - Right Illuminated Amber/Rose Face */}
        <polygon
          points="60,50 72,46 72,92 60,96"
          fill="url(#tz-grad-amber-rose)"
          opacity="0.9"
          id="teyzix-logo-stem-right"
        />

        {/* Dynamic laser path indicator running down the spine */}
        <line
          x1="60"
          y1="50"
          x2="60"
          y2="95"
          stroke="#22d3ee"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.8"
          id="teyzix-logo-laser"
        />

        {/* Upper glass highlight streak */}
        <path
          d="M 28,27 L 60,39 L 92,27"
          stroke="url(#tz-glass-sheen)"
          strokeWidth="2"
          strokeLinecap="round"
          id="teyzix-logo-sheen"
        />

        {/* Central glowing core node representing real-time system synchronization */}
        <circle cx="60" cy="38" r="4" fill="#06b6d4" id="teyzix-logo-sensor" />
        <circle
          cx="60"
          cy="38"
          r="8"
          fill="#22d3ee"
          opacity="0.25"
          className="animate-ping"
          id="teyzix-logo-glowing-ring"
        />
      </svg>
    </div>
  );
}

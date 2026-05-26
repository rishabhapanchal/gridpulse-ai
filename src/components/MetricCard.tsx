/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  iconColorClass: string; // e.g. text-amber-400
  bgColorClass: string;   // e.g. bg-amber-500/10
  borderColorClass: string; // e.g. border-amber-500/20
  glowingOrb?: boolean;
}

export default function MetricCard({
  label,
  value,
  subValue,
  icon: Icon,
  iconColorClass,
  bgColorClass,
  borderColorClass,
  glowingOrb = false,
}: MetricCardProps) {
  return (
    <div className={`relative glass-panel rounded-[28px] p-5 flex items-start space-x-3.5 transition-all duration-300 hover:scale-[1.01] shadow-[0_8px_32px_rgba(0,0,0,0.5)] group overflow-hidden`}>
      {/* Absolute Ambient Background Lights */}
      {glowingOrb && (
        <div className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-15 pointer-events-none -mr-4 -mt-4 transition-transform duration-700 group-hover:scale-130`}
             style={{ background: 'currentColor' }}
        />
      )}

      {/* Glow highlight line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-slate-600/40 to-transparent"></div>

      {/* Icon Frame */}
      <div className={`flex items-center justify-center p-2.5 rounded-2xl shrink-0 ${bgColorClass} border border-slate-800/40 shadow-inner transition-transform duration-350 group-hover:scale-105`}>
        <Icon className={`w-5 h-5 ${iconColorClass}`} />
      </div>

      {/* Content wrapper */}
      <div className="flex-1 min-w-0 pr-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400 font-bold block">
          {label}
        </span>
        <div className="text-xl font-glass-title font-bold tracking-tight mt-1 truncate">
          {value}
        </div>
        {subValue && (
          <p className="text-[11px] font-glass-body-muted leading-normal mt-1 flex items-center space-x-1 font-sans">
            <span className="w-1 h-1 rounded-full bg-slate-500 inline-block shrink-0"></span>
            <span className="truncate">{subValue}</span>
          </p>
        )}
      </div>
    </div>
  );
}

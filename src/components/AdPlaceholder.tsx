/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';

interface AdPlaceholderProps {
  type: 'top' | 'bottom';
  onActionClick?: () => void;
}

export default function AdPlaceholder({ type, onActionClick }: AdPlaceholderProps) {
  if (type === 'top') {
    return (
      <div 
        id="ad-top"
        className="w-full h-[90px] min-h-[90px] max-h-[90px] bg-slate-950/40 backdrop-blur-xl border border-slate-850 rounded-2xl relative overflow-hidden flex items-center justify-between px-6 select-none shadow-[0_4px_30px_rgba(0,0,0,0.3)] font-sans text-xs"
      >
        <script 
          src="https://quge5.com/88/tag.min.js" 
          data-zone="242852" 
          async 
          data-cfasync="false"
        />
        <div className="flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-500 block">Clean Tech Partner Space</span>
            <span className="font-semibold text-slate-300">Renewable Grid Energy Hardware</span>
          </div>
        </div>
        <button 
          onClick={onActionClick}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-[10px] font-mono tracking-wider uppercase rounded-lg transition duration-200"
        >
          Explore Clean Solutions
        </button>
      </div>
    );
  }

  // Bottom 250px square/responsive ad layout block
  return (
    <div 
      id="ad-bottom"
      className="w-[250px] h-[250px] min-h-[250px] max-h-[250px] bg-slate-950/60 backdrop-blur-xl border border-slate-850 rounded-3xl relative overflow-hidden flex flex-col justify-between p-6 select-none shadow-[0_12px_40px_rgba(0,0,0,0.4)] font-sans text-xs"
    >
      <script 
        src="https://quge5.com/88/tag.min.js" 
        data-zone="242852" 
        async 
        data-cfasync="false"
      />
      <div className="flex justify-between items-start">
        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-[8px] font-mono font-bold text-amber-500 uppercase tracking-widest">
          Partner Spotlight
        </span>
        <span className="text-[9px] font-mono text-slate-500 uppercase">Interactive</span>
      </div>

      <div className="space-y-1 my-3">
        <h4 className="font-bold text-slate-200 tracking-tight text-sm">Smart Energy Node Co.</h4>
        <p className="text-[11px] text-slate-450 leading-relaxed">
          Unlock high-fidelity smart-meter utility telemetry with native solar calibration. 
        </p>
      </div>

      <button 
        onClick={onActionClick}
        className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 border border-amber-450/35 text-slate-950 font-bold text-xs rounded-xl shadow-md transition duration-200 cursor-pointer"
      >
        Recalibrate Smart Nodes
      </button>
    </div>
  );
}

// src/components/LegalModal.tsx
import React from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, Scale } from 'lucide-react';
import { legalContent } from '../data/legalContent';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export default function LegalModal({ isOpen, type, onClose }: LegalModalProps) {
  if (!isOpen) return null;

  const content = legalContent[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark Backdrop overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Main Modal Frame Layout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-slate-950 border border-white/10 rounded-[32px] w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-[0_20px_50px_rgba(245,158,11,0.1)] flex flex-col z-10"
      >
        {/* Glowing header accent boundary */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

        {/* Header content box */}
        <div className="p-6 border-b border-white/5 flex items-start justify-between bg-slate-950/50">
          <div className="flex gap-3 items-center">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              {type === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
            </div>
            <div className="text-left">
              <h3 className="text-sm font-mono font-black text-slate-200 tracking-wider uppercase">
                {content.title}
              </h3>
              <p className="text-[9px] font-mono text-slate-500 mt-0.5 tracking-widest uppercase">
                {content.subtitle}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Document Text blocks */}
        <div className="p-6 overflow-y-auto text-left font-sans text-xs sm:text-sm text-slate-400 space-y-4 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {content.paragraphs.map((p, idx) => (
            <p key={idx} className="border-l-2 border-slate-900 pl-3">
              {p}
            </p>
          ))}
        </div>

        {/* Bottom confirmation footer row */}
        <div className="p-4 border-t border-white/5 bg-slate-950/60 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 font-mono text-xs font-bold tracking-wider rounded-xl border border-slate-800 transition cursor-pointer"
          >
            ACKNOWLEDGE & CLOSE
          </button>
        </div>
      </motion.div>
    </div>
  );
}

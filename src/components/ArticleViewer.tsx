// src/components/ArticleViewer.tsx
import React from 'react';
import { articlesData } from '../data/articles';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

interface ArticleViewerProps {
  articleId: string;
  onBack: () => void;
}

export default function ArticleViewer({ articleId, onBack }: ArticleViewerProps) {
  const article = articlesData.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="relative z-10 flex-grow max-w-3xl w-full mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 font-mono">Data pipeline node missing.</p>
        <button onClick={onBack} className="text-amber-400 text-xs mt-4 font-bold underline cursor-pointer">RETURN TO INDEX</button>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex-grow max-w-3xl w-full mx-auto px-4 py-12">
      
      {/* Return Back Button Navigation Action */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[11px] font-mono font-bold tracking-wider text-slate-400 hover:text-amber-400 transition-colors mb-8 group cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
        BACK TO KNOWLEDGE BASE
      </button>

      {/* Main Core Text Article Wrapper */}
      <article className="glass-panel rounded-[32px] p-6 sm:p-10 border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        
        {/* Article Metadata Frame */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-4">
          <span>{article.date}</span>
          <span>•</span>
          <span>TECHNICAL FORECAST</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-glass-title font-black text-slate-100 tracking-tight leading-tight mb-8">
          {article.title}
        </h1>

        {/* Big Visual Header Hero Frame */}
        <div className="w-full aspect-video rounded-2xl border border-white/5 overflow-hidden bg-slate-900 mb-10 shadow-inner">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover opacity-90" />
        </div>

        {/* FUTURE ADSENSE REAL ESTATE HOOK 1 */}
        <div className="w-full bg-slate-950/90 border border-dashed border-white/10 rounded-xl p-4 my-8 text-center text-[10px] font-mono text-slate-600 flex items-center justify-center gap-2 tracking-widest uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
          Google AdSense Engine Placeholder Unit [Top Banner]
        </div>

        {/* Longform Paragraph Typography Core Body */}
        <div className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans space-y-6 whitespace-pre-wrap">
          {article.content}
        </div>

        {/* FUTURE ADSENSE REAL ESTATE HOOK 2 */}
        <div className="w-full bg-slate-950/90 border border-dashed border-white/10 rounded-xl p-4 mt-12 text-center text-[10px] font-mono text-slate-600 flex items-center justify-center gap-2 tracking-widest uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
          Google AdSense Engine Placeholder Unit [Bottom Banner]
        </div>

      </article>
    </div>
  );
}

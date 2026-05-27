// src/components/BlogHub.tsx
import React, { useState } from 'react';
import { articlesData, Article } from '../data/articles';
import { BookOpen, Calendar, ArrowRight, ChevronDown, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogHubProps {
  onSelectArticle: (id: string) => void;
}

export default function BlogHub({ onSelectArticle }: BlogHubProps) {
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const trendingArticles = articlesData.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(articlesData.length);
  };

  return (
    <div className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 py-12">
      
      {/* Premium Hub Header Hero Frame */}
      <div className="relative glass-panel p-8 rounded-[28px] overflow-hidden mb-12 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
        <div className="max-w-3xl">
          <span className="text-[9px] font-mono text-amber-400 uppercase tracking-[0.15em] font-extrabold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 w-max mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            TODAY'S TRENDING ENERGY ANALYTICS // 2026 MARKET
          </span>
          <h1 className="text-2xl sm:text-4xl font-glass-title font-black text-slate-100 tracking-tight leading-none">
            Grid Pulse Intelligence Hub
          </h1>
          <p className="text-xs sm:text-sm font-glass-body mt-3 text-slate-400 leading-relaxed">
            Deep technical investigations, commercial infrastructure load profiles, regional subsidy application tracking, and next-generation policy updates.
          </p>
        </div>
      </div>

      {/* Grid Interface Mapping Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingArticles.map((article: Article) => (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            key={article.id}
            onClick={() => onSelectArticle(article.id)}
            className="glass-panel rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 group cursor-pointer flex flex-col h-full overflow-hidden hover:shadow-[0_8px_25px_rgba(245,158,11,0.05)] bg-slate-950/45"
          >
            <div className="relative aspect-video w-full bg-slate-900 border-b border-white/5 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-80 group-hover:opacity-100"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600";
                }}
              />
            </div>

            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mb-3 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {article.date}
                </div>
                
                <h3 className="text-base font-bold text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug mb-3">
                  {article.title}
                </h3>
                
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6 font-glass-body">
                  {article.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-mono font-bold tracking-wider text-amber-400 gap-1 pt-4 border-t border-white/5">
                READ METRIC EVALUATION
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SHOW MORE CONTROLLER ACTION TRIGGER */}
      {visibleCount < articlesData.length && (
        <div className="flex justify-center mt-12">
          <motion.button
            onClick={handleShowMore}
            whileHover={{ scale: 1.03, backgroundColor: "rgba(245,158,11,0.1)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-4 bg-slate-950/80 border border-amber-500/30 hover:border-amber-400 text-amber-400 font-mono text-xs font-black tracking-widest uppercase rounded-2xl shadow-lg cursor-pointer transition-all duration-300"
          >
            SHOW MORE ARTICLES
            <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
          </motion.button>
        </div>
      )}
    </div>
  );
}

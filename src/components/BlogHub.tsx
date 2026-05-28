import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { motion } from 'motion/react';

// Assuming you have a mock or imported data asset for articles
// Replace this mock structure with your actual database or JSON import path if different
const SAMPLE_ARTICLES = [
  {
    id: 'pm-surya-ghar',
    title: 'Step-by-Step Guide: How to Track Your PM Surya Ghar Application Status',
    excerpt: 'Learn how to navigate the national solar portal, interpret internal DISCOM engineering review logs, and avoid regional net-metering processing bottlenecks.',
    date: '2026-05-27',
    readTime: '6 min read',
    author: 'Grid Pulse Analytics',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'commercial-solar-roi',
    title: 'Commercial Solar ROI: Calculating True Payback Periods for Industrial Arrays',
    excerpt: 'A financial modeling deep-dive into accelerated depreciation curves, power purchase agreements, and grid-parity calculations.',
    date: '2026-05-25',
    readTime: '9 min read',
    author: 'E. R. Panchal',
    imageUrl: 'invalid-image-url-test-package.jpg' // This will trigger the automatic fallback safely
  },
  {
    id: 'bifacial-vs-monofacial',
    title: 'Bifacial vs. Monofacial Solar Panels: Which Yields Better ROI in 2026?',
    excerpt: 'An empirical look at dual-sided albedo reflection gains versus premium module procurement costs in residential infrastructure setups.',
    date: '2026-05-24',
    readTime: '7 min read',
    author: 'Grid Pulse AI Core',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop'
  }
];

interface BlogHubProps {
  onSelectArticle: (id: string) => void;
  onBack: () => void;
}

export default function BlogHub({ onSelectArticle, onBack }: BlogHubProps) {
  return (
    <div className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 py-6 flex flex-col gap-8">
      
      {/* BLOG HEADER TITLE HUB BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono text-amber-400 hover:text-amber-300 mb-3 bg-transparent border-none cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            RETURN TO FORECASTER COMMAND TERMINAL
          </button>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <BookOpen className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-glass-title font-bold text-slate-100">
              Grid Pulse Intelligence Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-glass-body mt-2 max-w-3xl">
            Deep technical investigations, commercial infrastructure load profiles, regional subsidy application tracking, and next-generation policy updates.
          </p>
        </div>
      </div>

      {/* ARTICLES LAYOUT MATRIX */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-6">
        {SAMPLE_ARTICLES.map((article) => (
          <BlogCard 
            key={article.id} 
            article={article} 
            onSelect={onSelectArticle} 
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   ISOLATED CHILD COMPONENT: Prevents error bubbling across the virtual DOM matrix
   ============================================================================ */
function BlogCard({ article, onSelect }: { article: any; onSelect: (id: string) => void }) {
  // Premium fallback illustration asset used if user paths run into offline or broken imagery
  const PREMIUM_FALLBACK_URL = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop';
  
  const [imageSource, setImageSource] = useState<string>(article.imageUrl || PREMIUM_FALLBACK_URL);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 bg-slate-900/20 flex flex-col h-full hover:border-amber-500/20 transition-all duration-300 group shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      
      {/* CARD COVERS VIEW CONTAINER */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img 
          src={imageSource} 
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={() => {
            // RECTIFIED: Catches 404/broken links instantly and maps back to premium baseline photo
            setImageSource(PREMIUM_FALLBACK_URL);
          }}
        />
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md text-[10px] font-mono text-amber-400 font-semibold uppercase tracking-wider">
          {article.readTime}
        </div>
      </div>

      {/* CARD CONTENT LAYER */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2">
          {/* Metadata Meta Layer */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
          </div>
          
          <h2 className="text-sm font-bold text-slate-100 font-glass-title group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h2>
          <p className="text-xs text-slate-400 font-glass-body line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(article.id)}
          className="w-full text-center py-2.5 rounded-xl border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 text-xs font-mono font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer"
        >
          Read Metric Evaluation &rarr;
        </button>
      </div>
    </div>
  );
}

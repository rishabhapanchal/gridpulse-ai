import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ArticleViewerProps {
  articleId: string;
  onBack: () => void;
}

export default function ArticleViewer({ articleId, onBack }: ArticleViewerProps) {
  const PREMIUM_FALLBACK_URL = 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop';
  
  const [headerImage, setHeaderImage] = useState<string>(PREMIUM_FALLBACK_URL);

  // Simple runtime hydration hook mimicking fetch retrieval from an asset dictionary matrix
  // Replace or connect with your live real data storage configurations
  const [articleData, setArticleData] = useState<any>(null);

  useEffect(() => {
    // Mimicking local content routing assembly mapping array matching loops
    const mockArticlesDb: Record<string, any> = {
      'pm-surya-ghar': {
        title: 'How to Track Your PM Surya Ghar Application Status',
        date: '2026-05-27',
        readTime: '6 min read',
        author: 'Grid Pulse Analytics',
        imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop',
        content: `The deployment of the national residential rooftop subsidy portal represents a structural transformation in distributed energy accessibility. However, navigating the intersection of local DISCOM validation loops, site inspection schedules, and field feasibility sign-offs introduces complex information delays for homeowners.`
      },
      'commercial-solar-roi': {
        title: 'Commercial Solar ROI: Calculating True Payback Periods for Industrial Arrays',
        date: '2026-05-25',
        readTime: '9 min read',
        author: 'E. R. Panchal',
        imageUrl: 'broken-asset-path-simulation.jpg', // Triggers the safety filter
        content: `Industrial capital expense deployments into utility-scale solar asset generation require granular depreciation evaluations. By mapping MACRS write-offs alongside avoided grid peak capacity tariffs, asset developers can calculate true risk-adjusted performance models.`
      },
      'bifacial-vs-monofacial': {
        title: 'Bifacial vs. Monofacial Solar Panels: Which Yields Better ROI in 2026?',
        date: '2026-05-24',
        readTime: '7 min read',
        author: 'Grid Pulse AI Core',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
        content: `Bifacial photovoltaic generation introduces ground-level reflection configurations known as albedo efficiency modifiers. While dual-glass modules scale capital procurement costs by up to 15%, tracking arrays positioned above high-reflection surfaces generate compound energy output expansions.`
      }
    };

    const targetData = mockArticlesDb[articleId];
    if (targetData) {
      setArticleData(targetData);
      setHeaderImage(targetData.imageUrl || PREMIUM_FALLBACK_URL);
    }
  }, [articleId]);

  if (!articleData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto animate-spin" />
        <p className="text-sm font-mono text-slate-400">Assembling Document Framework...</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex-grow max-w-4xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
      
      {/* TOP NAVIGATION BARS */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-slate-200 bg-transparent border-none cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          BACK TO INSIGHTS INDEX
        </button>
        <button 
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="text-slate-500 hover:text-amber-400 p-2 bg-slate-900/60 border border-white/5 rounded-xl transition-colors cursor-pointer"
          title="Copy Article link"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* ARTICLE DATA HEADERS */}
      <div className="space-y-3">
        <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] font-glass-title font-black text-slate-100 tracking-tight leading-tight">
          {articleData.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-slate-450 pt-1">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-500" /> {articleData.date}</span>
          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-amber-500" /> By {articleData.author}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-500" /> {articleData.readTime}</span>
        </div>
      </div>

      {/* LARGE CINEMATIC HERO IMAGE BANNER COMPONENT */}
      <div className="relative w-full h-[240px] sm:h-[420px] rounded-[24px] overflow-hidden bg-slate-950 shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/5">
        <img 
          src={headerImage} 
          alt={articleData.title}
          className="w-full h-full object-cover"
          onError={() => {
            // RECTIFIED: Swaps banner automatically if background link hosting experiences disruption
            setHeaderImage(PREMIUM_FALLBACK_URL);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* ARTICLE EDITORIAL TEXT Real Estate CONTENT HOOK LAYERS */}
      <article className="prose prose-invert prose-amber max-w-none text-slate-300 font-glass-body leading-relaxed text-sm sm:text-base space-y-6 pt-2">
        <p className="first-letter:text-5xl first-letter:font-black first-letter:text-amber-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
          {articleData.content}
        </p>
        
        {/* AdSense Unit In-Feed Placeholder */}
        <div className="my-8 p-4 bg-slate-950/80 border border-dashed border-slate-800 rounded-xl text-center">
          <span className="text-[9px] font-mono tracking-widest text-slate-600 block mb-1">GOOGLE ADSENSE ENGINE PLACEHOLDER UNIT [MID CONTENT BANNER]</span>
          <div className="w-full h-20 bg-slate-900/40 rounded flex items-center justify-center text-slate-500 text-xs italic">
            Contextual Native Advertisements Automatically Render Here
          </div>
        </div>

        <p>
          As clean energy frameworks continue to mature globally, maintaining live computational accuracy over physical layout arrays ensures predictive security for individual long-term hardware investments.
        </p>
      </article>
    </div>
  );
}

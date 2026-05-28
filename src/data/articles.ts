import React from 'react';
import { Article, articlesData } from '../data/articles';

interface ArticleViewerProps {
  currentArticleId: string;
  onBackToHub: () => void;
  onNavigateToCalculator: () => void;
}

const ArticleViewer: React.FC<ArticleViewerProps> = ({ 
  currentArticleId, 
  onBackToHub,
  onNavigateToCalculator
}) => {
  // Find the active article from your database matching the active selection state
  const article = articlesData.find(item => item.id === currentArticleId || item.slug === currentArticleId);

  // Fallback safety layer in case an incorrect slug or id routing parameter is passed
  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-slate-950 text-white">
        <h2 className="text-xl font-bold text-amber-400">Article Missing Matrix Node</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          The structural content asset you are looking for has been re-indexed or shifted.
        </p>
        <button 
          onClick={onBackToHub}
          className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs uppercase tracking-wider transition-all"
        >
          Return to Intelligence Hub
        </button>
      </div>
    );
  }

  // THE PERFORMANCE-FIRST WEB SHARE ENGINE
  const handleShare = async () => {
    const shareTitle = article.title;
    const shareText = article.description || article.excerpt;
    
    // Constructs the exact deep-link parameter for your production domain loop
    const shareUrl = `${window.location.origin}/?view=blog&article=${article.slug || article.id}`;

    if (navigator.share) {
      try {
        // Leverages native mobile/OS system sheet (WhatsApp, Apple AirDrop, X, etc.)
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        console.log("Core asset routing shared successfully via native interface.");
      } catch (error) {
        console.log("Sharing pipeline closed gracefully by client agent:", error);
      }
    } else {
      // Premium Fallback: Clipboard write for old or desktop browser windows
      try {
        await navigator.clipboard.writeText(shareUrl);
        
        // Fires a clean alert box (or you can link this to a custom modal/toast banner)
        alert("Article link copied to clipboard successfully! Ready to share on Pinterest.");
      } catch (err) {
        console.error("System structural failure writing string variable to clipboard context: ", err);
      }
    }
  };

  return (
    <article className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 pb-20">
      {/* HEADER TOP-BAR NAVIGATION MATRIX */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between border-b border-white/5">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 hover:text-amber-400 font-medium transition-colors group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transform group-hover:-translate-x-1 transition-transform"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Insights Index
        </button>

        {/* ACTIVATED HIGH-CONVERSION SHARE BUTTON */}
<button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Explicit inline execution matrix
    const shareTitle = article.title;
    const shareText = article.description || article.excerpt;
    const shareUrl = `${window.location.origin}/?view=blog&article=${article.slug || article.id}`;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      })
      .then(() => console.log("Successful share alignment"))
      .catch((err) => console.log("Share skipped:", err));
    } else {
      // Direct browser fallback execution
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          alert("Link copied to clipboard successfully!");
        })
        .catch((err) => {
          console.error("Clipboard routing blocked:", err);
        });
    }
  }}
  className="p-2.5 rounded-full border border-white/10 bg-slate-900/40 hover:bg-white/5 text-slate-400 hover:text-amber-400 transition-all duration-200 shadow-md flex items-center justify-center group relative z-50 cursor-pointer"
  title="Share this article"
  aria-label="Share article"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="pointer-events-none"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
</button>
      </div>

      {/* ARTICLE CONTENT FRAMEWORK HERO */}
      <header className="max-w-3xl mx-auto px-4 pt-12 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-widest font-mono text-slate-500 mb-4">
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-white/5 text-amber-400/90">
            {article.category}
          </span>
          <span>•</span>
          <span>{article.date}</span>
          <span>•</span>
          <span className="text-slate-400">{article.readTime}</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight md:leading-snug">
          {article.title}
        </h1>

        <p className="text-xs text-slate-400 mt-3 font-medium tracking-wide">
          By <span className="text-slate-300 font-semibold">{article.author}</span>
        </p>
      </header>

      {/* PREMIUM VISUAL CONTENT WRAPPER */}
      <div className="max-w-4xl mx-auto px-4 mt-8 rounded-[28px] overflow-hidden border border-white/5 shadow-2xl relative aspect-[21/9]">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
      </div>

      {/* ARTICLE BODY CORE CONTAINER */}
      <main className="max-w-2xl mx-auto px-4 mt-12">
        <div className="text-slate-300 text-base md:text-lg leading-relaxed space-y-6 font-normal tracking-wide whitespace-pre-line drop-shadow-sm">
          {/* Dynamically renders the complete engineering copy from your database array */}
          {article.content}
        </div>

        {/* HIGH-CONVERTING CUSTOM AMZN NATIVE AFFILIATE INLINE BRIDGE */}
        <div className="mt-14 p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-amber-500/10" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-amber-400 font-bold text-base tracking-wide">
                Calculate Your Real-World System Layout Requirements
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 max-w-lg leading-relaxed">
                Don't guess component allocations blindly or get stuck with unfair retail vendor kits. Run your home bills through our free system analyzer to find verified hardware models directly on Amazon.
              </p>
            </div>
            <button 
              onClick={onNavigateToCalculator}
              className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl tracking-widest uppercase transition-all whitespace-nowrap shadow-lg shadow-amber-500/15 border border-amber-400/20 active:scale-98"
            >
              Open Forecaster
            </button>
          </div>
        </div>
      </main>

      {/* CONTEXTUAL FOOTER INFRASTRUCTURE */}
      <footer className="max-w-2xl mx-auto px-4 mt-16 pt-6 border-t border-white/5 flex items-center justify-between text-xxs font-mono text-slate-600 tracking-wider">
        <p>© 2026 Grid Pulse AI . Diagnostic Assessments.</p>
        <button onClick={onBackToHub} className="hover:text-slate-400 transition-colors">
          Index Matrix
        </button>
      </footer>
    </article>
  );
};

export default ArticleViewer;

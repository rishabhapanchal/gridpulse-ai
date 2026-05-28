import React, { useState, useMemo } from 'react';
import { BookOpen, ArrowRight, Grid, Filter, Sparkles, ChevronDown } from 'lucide-react';
import { ARTICLES } from '../data/articles';

interface BlogHubProps {
  onSelectArticle: (slug: string) => void;
}

export const BlogHub: React.FC<BlogHubProps> = ({ onSelectArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(`All`);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // 1. Extract unified unique categories and dynamically calculate item counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { All: ARTICLES.length };
    ARTICLES.forEach((article) => {
      counts[article.category] = (counts[article.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  // 2. Separate the Top 2 Articles to serve as prominent, cinematic Hero Features
  const featuredArticles = useMemo(() => {
    return ARTICLES.slice(0, 2);
  }, []);

  // 3. Filter the remaining articles dynamically based on the active category pill
  const filteredArticles = useMemo(() => {
    if (selectedCategory === `All`) {
      return ARTICLES.slice(2); // Exclude heroes from the grid feed
    }
    return ARTICLES.filter((article) => article.category === selectedCategory);
  }, [selectedCategory]);

  // 4. Paginate out display parameters slice
  const displayedGridArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  const hasMore = filteredArticles.length > visibleCount;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(6); // Reset pagination index on matrix shift
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 antialiased font-sans px-4 sm:px-6 lg:px-8 py-12 selection:bg-amber-500/20 selection:text-amber-400">
      
      {/* HEADER ARCHITECTURE */}
      <header className="max-w-6xl mx-auto text-center mb-16 relative">
        <div className="absolute inset-x-0 -top-12 h-40 bg-gradient-to-b from-amber-500/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-4 tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Command Intelligence Terminal
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-100 mb-4 leading-none">
          Grid Pulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">Intelligence Hub</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Deep technical investigations, commercial infrastructure load profiles, regional subsidy application tracking, and next-generation clean energy data modeling.
        </p>
      </header>

      {/* FEATURED HERO MATRIX (Top 2 Large Cinematic Cards) */}
      {selectedCategory === `All` && (
        <section className="max-w-6xl mx-auto mb-16">
          <div className="flex items-center gap-2 mb-6 border-b border-neutral-900 pb-3">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold">Featured Analysis Focus</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <div 
                key={article.slug}
                onClick={() => onSelectArticle(article.slug)}
                className="group relative h-[420px] rounded-2xl overflow-hidden border border-neutral-900 hover:border-neutral-800 cursor-pointer flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 shadow-2xl bg-neutral-950/40"
              >
                {article.image && (
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transform scale-[1.01] group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/70 to-[#070709]/10" />
                  </div>
                )}
                <div className="relative z-10 w-full">
                  <span className="inline-block text-[10px] font-mono tracking-widest uppercase bg-amber-500 text-[#070709] px-2 py-0.5 rounded font-bold mb-3 shadow-md">
                    {article.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-slate-100 group-hover:text-amber-400 transition-colors duration-300 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60 text-xs font-mono text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime || `6 min read`}</span>
                    </div>
                    <span className="flex items-center gap-1 text-amber-500 font-semibold group-hover:translate-x-1 transition-transform duration-300 text-[11px] uppercase tracking-wider">
                      Evaluate <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CATEGORY FILTER PILLS */}
      <nav className="max-w-6xl mx-auto mb-10 flex flex-wrap items-center justify-start gap-2 border-b border-neutral-900/60 pb-6">
        <div className="text-slate-500 flex items-center gap-1.5 mr-2 text-xs font-mono uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" /> Filters:
        </div>
        {categoriesWithCounts.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryChange(cat.name)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 border flex items-center gap-1.5 ${
              selectedCategory === cat.name
                ? `bg-amber-500/10 border-amber-500 text-amber-400 font-bold shadow-lg`
                : `bg-neutral-900/40 border-neutral-900/80 text-slate-400 hover:border-neutral-800 hover:text-slate-200`
            }`}
          >
            {cat.name}
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
              selectedCategory === cat.name ? `bg-amber-500/20 text-amber-400` : `bg-neutral-950 text-slate-500`
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </nav>

      {/* ARTICLE FEED GRID MATRIX */}
      <main className="max-w-6xl mx-auto">
        {displayedGridArticles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-900 rounded-2xl bg-neutral-950/20">
            <Grid className="w-8 h-8 text-neutral-800 mx-auto mb-3" />
            <p className="text-sm font-mono text-slate-500">No telemetry nodes matching this parameters frame.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedGridArticles.map((article) => (
              <article
                key={article.slug}
                onClick={() => onSelectArticle(article.slug)}
                className="group flex flex-col h-full bg-[#0d0d11]/40 border border-neutral-900 hover:border-neutral-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                {article.image && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950 border-b border-neutral-900/40">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#070709]/80 backdrop-blur-sm text-[10px] font-mono font-medium uppercase tracking-wider text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                      {article.category}
                    </div>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-base sm:text-17px font-bold text-slate-200 line-clamp-2 group-hover:text-amber-400 transition-colors duration-200 mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed mb-5 flex-grow">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-auto pt-3 border-t border-neutral-900/60">
                    <span>{article.date}</span>
                    <span>{article.readTime || `5 min`}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* PAGINATION INTERFACE: "SHOW MORE" TRIGGER MODULE */}
        {hasMore && (
          <div className="flex justify-center mt-12 border-t border-neutral-900/40 pt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 hover:bg-neutral-900 text-slate-300 hover:text-amber-400 text-xs sm:text-sm font-mono tracking-wider border border-neutral-900 hover:border-neutral-800 rounded-xl transition-all duration-200 shadow-lg group font-medium"
            >
              Show More Analytical Content 
              <ChevronDown className="w-4 h-4 transform group-hover:translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

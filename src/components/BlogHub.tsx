import React, { useMemo } from 'react';
import { ArrowLeft, Clock, Calendar, Tag, Share2, BookOpen } from 'lucide-react';

// Define the absolute structure of an Article to match your shared array data
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  content: string;
  image?: string;
  readTime?: string;
  tags?: string[];
}

interface ArticleViewerProps {
  currentSlug: string;
  articles: Article[];
  onBack: () => void;
  onNavigateToArticle: (slug: string) => void;
}

export const ArticleViewer: React.FC<ArticleViewerProps> = ({
  currentSlug,
  articles,
  onBack,
  onNavigateToArticle,
}) => {
  // 1. Find the current active article safely
  const article = useMemo(() => {
    return articles.find((a) => a.slug === currentSlug);
  }, [currentSlug, articles]);

  // 2. Generate Related Articles automatically (Same category, excluding current article)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return articles
      .filter((a) => a.category === article.category && a.slug !== article.slug)
      .slice(0, 3); // Cap at 3 related layout recommendations
  }, [article, articles]);

  // If the slug doesn't match anything, render a clean fallback state
  if (!article) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-slate-200 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-amber-500 mb-4">Article Not Found</h2>
          <p className="text-slate-400 mb-6">The engineering analysis or forecast model you are looking for has been moved or updated.</p>
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-all text-sm font-medium text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Command Terminal
          </button>
        </div>
      </div>
    );
  }

  // 3. Robust Content Renderer Component
  // Formats plain text blocks containing headers (###), bold statements, and bullet points safely into clean Tailwind UI elements
  const renderContent = (plainText: string) => {
    const lines = plainText.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) return <div key={index} className="h-4" />;

      // H3 Headings (e.g., ### Sub-heading)
      if (trimmedLine.startsWith('###')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-amber-500 mt-8 mb-4 tracking-wide">
            {trimmedLine.replace('###', '').trim()}
          </h3>
        );
      }

      // H2 Headings (e.g., ## Main Section)
      if (trimmedLine.startsWith('##')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-slate-100 mt-10 mb-5 border-b border-neutral-800/60 pb-2 tracking-tight">
            {trimmedLine.replace('##', '').trim()}
          </h2>
        );
      }

      // Bullet Points
      if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) {
        const cleanContent = trimmedLine.substring(1).trim();
        return (
          <ul key={index} className="list-disc list-outside pl-6 my-2 text-slate-300 space-y-1">
            <li>{parseBoldText(cleanContent)}</li>
          </ul>
        );
      }

      // Regular Paragraphs
      return (
        <p key={index} className="text-slate-300 leading-relaxed text-[16px] mb-5 tracking-normal">
          {parseBoldText(trimmedLine)}
        </p>
      );
    });
  };

  // Helper function to turn dynamic inline markdown **text** into bold html JSX tags securely
  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-amber-400 font-semibold">{part}</strong> : part));
  };

  return (
    <article className="min-h-screen bg-[#070709] text-slate-100 antialiased selection:bg-amber-500/20 selection:text-amber-400">
      
      {/* 1. TOP UTILITY BAR (Floating Navigation) */}
      <div className="sticky top-0 z-40 bg-[#070709]/80 backdrop-blur-md border-b border-neutral-900 px-4 py-3 sm:px-8 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-amber-500 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 font-mono font-medium uppercase tracking-wider">
            {article.category}
          </span>
          <button 
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md hover:bg-neutral-900 transition-all"
            title="Copy link to share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. HERO HEADER SECTION */}
      <header className="relative w-full max-w-5xl mx-auto pt-8 px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-600" />
            <span>{article.date}</span>
          </div>
          <span className="text-neutral-800">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-600" />
            <span>{article.readTime || '6 min read'}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 max-w-4xl mx-auto tracking-tight leading-[1.15] mb-6">
          {article.title}
        </h1>

        <p className="text-lg text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-8 border-l-2 border-amber-500/30 pl-4 sm:pl-6 text-left italic">
          {article.excerpt}
        </p>

        {/* Cinematic Featured Banner Frame */}
        {article.image && (
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-neutral-900 my-8 group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent z-10 opacity-60" />
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover transform scale-[1.01] group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
            />
          </div>
        )}
      </header>

      {/* 3. CORE ARTICLE COMPONENT WRAPPER */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20">
        <div className="prose prose-invert max-w-none prose-amber">
          {renderContent(article.content)}
        </div>

        {/* Explicit Tag Footer */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-neutral-900 mt-12 pt-6">
            <Tag className="w-3.5 h-3.5 text-neutral-600 mr-1" />
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs bg-neutral-900/60 border border-neutral-800 text-slate-400 px-2.5 py-1 rounded-md font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>

      {/* 4. DYNAMIC RELATED ARTICLES DRAWER */}
      {relatedArticles.length > 0 && (
        <section className="bg-[#0b0b0e] border-t border-neutral-900/80 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-10">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <h4 className="text-lg font-bold tracking-tight text-slate-100">
                Related Technical Metric Evaluations
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <div 
                  key={item.slug}
                  onClick={() => {
                    onNavigateToArticle(item.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-[#0e0e12] border border-neutral-900 hover:border-neutral-800/80 rounded-xl overflow-hidden cursor-pointer flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  {item.image && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900 border-b border-neutral-900/40">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-[#070709]/80 backdrop-blur-sm text-[10px] font-mono font-medium uppercase tracking-wider text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                        {item.category}
                      </div>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <h5 className="text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-amber-400 transition-colors duration-200 mb-2 leading-snug">
                      {item.title}
                    </h5>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-grow">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-auto pt-2 border-t border-neutral-900/60">
                      <span>{item.date}</span>
                      <span>{item.readTime || '5 min'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </article>
  );
};

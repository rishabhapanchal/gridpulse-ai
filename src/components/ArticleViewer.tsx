import React, { useMemo } from 'react';
import { ArrowLeft, Clock, Calendar, BookOpen } from 'lucide-react';
import { ARTICLES, Article } from '../data/articles';

interface ArticleViewerProps {
  currentSlug: string;
  onBack: () => void;
  onNavigateToArticle: (slug: string) => void;
}

export const ArticleViewer: React.FC<ArticleViewerProps> = ({
  currentSlug,
  onBack,
  onNavigateToArticle,
}) => {
  const article = useMemo(() => {
    return ARTICLES.find((a) => a.slug === currentSlug);
  }, [currentSlug]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return ARTICLES
      .filter((a) => a.category === article.category && a.slug !== article.slug)
      .slice(0, 3);
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-[60vh] bg-[#070709] text-slate-200 flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-xl font-bold text-amber-500">Article Missing Matrix Node</h2>
        <p className="text-sm text-slate-400 mt-2 mb-6 max-w-sm">
          The requested engineering forecast telemetry could not be found.
        </p>
        <button 
          onClick={onBack} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-slate-300 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Terminal
        </button>
      </div>
    );
  }

  const renderContent = (plainText: string) => {
    return plainText.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={index} className="h-4" />;

      if (trimmedLine.startsWith('###')) {
        return (
          <h3 key={index} className="text-lg font-bold text-amber-500 mt-6 mb-3 tracking-wide uppercase font-mono">
            {trimmedLine.replace('###', '').trim()}
          </h3>
        );
      }

      if (trimmedLine.startsWith('##')) {
        return (
          <h2 key={index} className="text-xl sm:text-2xl font-black text-slate-100 mt-8 mb-4 border-b border-neutral-900 pb-2 tracking-tight">
            {trimmedLine.replace('##', '').trim()}
          </h2>
        );
      }

      if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) {
        return (
          <ul key={index} className="list-disc list-outside pl-6 my-2 text-slate-300 text-sm sm:text-base space-y-1">
            <li>{parseBoldText(trimmedLine.substring(1).trim())}</li>
          </ul>
        );
      }

      return (
        <p key={index} className="text-slate-300 leading-relaxed text-sm sm:text-base mb-4 tracking-normal">
          {parseBoldText(trimmedLine)}
        </p>
      );
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-amber-400 font-semibold">{part}</strong> : part));
  };

  return (
    <article className="min-h-screen bg-[#070709] text-slate-100 antialiased selection:bg-amber-500/20 selection:text-amber-400">
      <div className="sticky top-0 z-40 bg-[#070709]/80 backdrop-blur-md border-b border-neutral-900 px-4 py-3 sm:px-8 flex items-center justify-between">
        <button onClick={onBack} className="group flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-amber-500 transition-colors">
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> Back to Hub
        </button>
        <span className="text-xs px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 font-mono font-medium uppercase tracking-wider">
          {article.category}
        </span>
      </div>

      <header className="max-w-4xl mx-auto pt-8 px-4 text-center">
        <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500 mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readTime || `5 min read`}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-100 mb-6 leading-tight max-w-3xl mx-auto tracking-tight">
          {article.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto border-l-2 border-amber-500/30 pl-4 text-left italic leading-relaxed mb-8">
          {article.excerpt}
        </p>

        {article.image && (
          <div className="w-full aspect-[21/9] rounded-xl overflow-hidden shadow-2xl border border-neutral-900 my-6">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-20">
        <div className="prose prose-invert max-w-none">{renderContent(article.content)}</div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-neutral-900 mt-10 pt-4">
            {article.tags.map((tag) => (
              <span key={tag} className="text-[11px] bg-neutral-900/60 border border-neutral-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>

      {relatedArticles.length > 0 && (
        <section className="bg-[#0b0b0e] border-t border-neutral-900 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Related Forecast Models</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <div 
                  key={item.slug} 
                  onClick={() => { onNavigateToArticle(item.slug); window.scrollTo({ top: 0 }); }} 
                  className="group bg-[#0e0e12] border border-neutral-900 hover:border-neutral-800 rounded-xl overflow-hidden p-4 cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <h5 className="text-xs sm:text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-amber-400 transition-colors mb-2">{item.title}</h5>
                  <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

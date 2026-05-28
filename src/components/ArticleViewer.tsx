import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, Tag } from 'lucide-react';
import { ARTICLES } from './BlogHub';

interface ArticleViewerProps {
  articleId: string;
  onBack: () => void;
}

export default function ArticleViewer({ articleId, onBack }: ArticleViewerProps) {
  const FALLBACK = 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1400&auto=format&fit=crop';

  const article = ARTICLES.find(a => a.id === articleId || a.slug === articleId);
  const [imgSrc, setImgSrc] = useState(article?.image || FALLBACK);

  const handleShare = () => {
    const url = `${window.location.origin}/?view=blog&article=${article?.slug || articleId}`;
    if (navigator.share) {
      navigator.share({ title: article?.title, text: article?.excerpt, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!')).catch(() => {});
    }
  };

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 text-white">
        <h2 className="text-xl font-bold text-amber-400">Article Not Found</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">This article may have been moved or renamed.</p>
        <button
          onClick={onBack}
          className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          Back to Solar Intelligence Hub
        </button>
      </div>
    );
  }

  // Render markdown-style bold (**text**) and paragraph breaks
  const renderContent = (text: string) => {
    return text.split('\n\n').map((para, i) => {
      if (para.startsWith('**') && para.includes('**\n')) {
        // Section heading
        const heading = para.match(/\*\*(.+?)\*\*/)?.[1] || '';
        const rest = para.replace(/\*\*(.+?)\*\*\n?/, '').trim();
        return (
          <div key={i} className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-amber-400 tracking-tight">{heading}</h2>
            {rest && <p className="text-slate-300 leading-relaxed">{renderInlineBold(rest)}</p>}
          </div>
        );
      }
      if (para.startsWith('- ') || para.includes('\n- ')) {
        // Bullet list
        const lines = para.split('\n').filter(l => l.trim());
        return (
          <ul key={i} className="space-y-2 pl-4">
            {lines.map((line, j) => (
              <li key={j} className="text-slate-300 leading-relaxed flex gap-2">
                <span className="text-amber-500 shrink-0 mt-1">▸</span>
                <span>{renderInlineBold(line.replace(/^-\s*/, ''))}</span>
              </li>
            ))}
          </ul>
        );
      }
      // Regular paragraph
      return (
        <p key={i} className="text-slate-300 leading-relaxed">
          {renderInlineBold(para)}
        </p>
      );
    });
  };

  const renderInlineBold = (text: string) => {
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1
        ? <strong key={i} className="text-slate-100 font-semibold">{part}</strong>
        : <React.Fragment key={i}>{part}</React.Fragment>
    );
  };

  // Related articles (same category, exclude current)
  const related = ARTICLES.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

  return (
    <article className="min-h-screen text-slate-100 pb-20 selection:bg-amber-500/30 selection:text-amber-200">

      {/* ── TOP NAV ── */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between border-b border-white/5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 hover:text-amber-400 font-mono transition-colors group bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </button>
        <button
          onClick={handleShare}
          className="p-2 rounded-xl border border-white/10 bg-slate-900/40 hover:bg-white/5 text-slate-400 hover:text-amber-400 transition-all cursor-pointer"
          title="Share this article"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* ── ARTICLE HEADER ── */}
      <header className="max-w-3xl mx-auto px-4 pt-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            {article.category}
          </span>
          {article.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/5 text-slate-500 text-[9px] font-mono">
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="text-2xl md:text-[2rem] font-extrabold tracking-tight text-white leading-snug">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-500" /> {article.date}</span>
          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-amber-500" /> {article.author}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-500" /> {article.readTime}</span>
        </div>
      </header>

      {/* ── HERO IMAGE ── */}
      <div className="max-w-4xl mx-auto px-4 mt-8 rounded-[28px] overflow-hidden border border-white/5 shadow-2xl relative aspect-[21/9]">
        <img
          src={imgSrc}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={() => setImgSrc(FALLBACK)}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
      </div>

      {/* ── ARTICLE BODY ── */}
      <main className="max-w-2xl mx-auto px-4 mt-12 space-y-6 text-sm sm:text-base">
        {/* Drop cap on first paragraph */}
        <div className="first-of-type:first-letter:text-5xl first-of-type:first-letter:font-black first-of-type:first-letter:text-amber-400 first-of-type:first-letter:mr-3 first-of-type:first-letter:float-left first-of-type:first-letter:leading-none">
          {renderContent(article.content)}
        </div>

        {/* ── CTA CARD ── */}
        <div className="mt-12 p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-amber-500/10 transition-all" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h3 className="text-amber-400 font-bold text-sm tracking-wide">
                Calculate Your Solar Savings
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 max-w-md leading-relaxed">
                Use the free Grid Pulse AI forecaster to model your exact payback period, system size, and Amazon hardware recommendations — personalised to your country and electricity bill.
              </p>
            </div>
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl tracking-widest uppercase transition-all whitespace-nowrap shadow-lg shadow-amber-500/15 border border-amber-400/20 cursor-pointer"
            >
              Open Forecaster →
            </button>
          </div>
        </div>
      </main>

      {/* ── RELATED ARTICLES ── */}
      {related.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 mt-16 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-amber-500 rounded-full" />
            <h2 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">Related Articles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(rel => {
              const [rImgSrc, setRImgSrc] = useState(rel.image);
              return (
                <div
                  key={rel.id}
                  onClick={onBack}
                  className="rounded-2xl overflow-hidden border border-white/5 bg-slate-900/30 cursor-pointer hover:border-amber-500/20 transition-all group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={rImgSrc}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => setRImgSrc(FALLBACK)}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] font-mono text-amber-400/80 uppercase tracking-widest mb-1">{rel.category}</p>
                    <h3 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                      {rel.title}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-500 mt-2">{rel.readTime}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="max-w-2xl mx-auto px-4 mt-12 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-600 tracking-wider">
        <p>© 2026 Grid Pulse AI · Solar Intelligence</p>
        <button onClick={onBack} className="hover:text-slate-400 transition-colors cursor-pointer bg-transparent border-none">
          ← Intelligence Hub
        </button>
      </footer>
    </article>
  );
}

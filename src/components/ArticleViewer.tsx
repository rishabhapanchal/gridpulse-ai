// src/components/ArticleViewer.tsx
import { articlesData } from '../data/articles';
import AdPlaceholder from './AdPlaceholder'; // Pulling in your existing placeholder file!

interface ArticleViewerProps {
  articleId: string;
  onBack: () => void;
}

export default function ArticleViewer({ articleId, onBack }: ArticleViewerProps) {
  const article = articlesData.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p className="text-neutral-400 mb-4">Resource path not found.</p>
        <button onClick={onBack} className="text-emerald-400 font-medium">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-200 px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Return Hook */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-8 group font-mono"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> BACK TO RESOURCES
        </button>

        {/* Header Metadata */}
        <p className="text-xs text-emerald-400 font-mono tracking-widest uppercase mb-3">{article.date} // INSIGHTS</p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-8">
          {article.title}
        </h1>

        {/* Feature Hero Frame */}
        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden border border-neutral-800 mb-10">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Monetization Block 1 */}
        <div className="my-6">
          <AdPlaceholder />
        </div>

        {/* Body Copy Layout Container */}
        <div className="prose prose-invert max-w-none text-base md:text-lg text-neutral-300 leading-relaxed space-y-6 whitespace-pre-wrap font-sans">
          {article.content}
        </div>

        {/* Monetization Block 2 */}
        <div className="mt-12 pt-8 border-t border-neutral-900">
          <AdPlaceholder />
        </div>
      </div>
    </div>
  );
}

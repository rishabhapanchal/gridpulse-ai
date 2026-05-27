// src/components/BlogHub.tsx
import { articlesData, Article } from '../data/articles';

interface BlogHubProps {
  onSelectArticle: (id: string) => void;
}

export default function BlogHub({ onSelectArticle }: BlogHubProps) {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 max-w-7xl mx-auto">
      {/* Header Layout Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Grid Pulse Resource Center
        </h1>
        <p className="mt-4 text-neutral-400 max-w-2xl mx-auto text-base md:text-lg">
          Expert insights, technical analysis, and regulatory breakdowns for modern solar infrastructures.
        </p>
      </div>

      {/* 30-Card Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articlesData.map((article: Article) => (
          <div 
            key={article.id}
            onClick={() => onSelectArticle(article.id)}
            className="group cursor-pointer bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
          >
            {/* Visual Thumbnail Frame */}
            <div className="h-48 overflow-hidden bg-neutral-800 relative">
              <div className="absolute inset-0 bg-neutral-900 animate-pulse group-hover:opacity-0 transition-opacity" />
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback if image doesn't exist yet
                  e.currentTarget.src = "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600";
                }}
              />
            </div>

            {/* Content Meta Frame */}
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-xs text-neutral-500 font-mono tracking-wider uppercase mb-2">{article.date}</span>
              <h3 className="text-xl font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors line-clamp-2 mb-3">
                {article.title}
              </h3>
              <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed flex-grow">
                {article.description}
              </p>
              <div className="mt-6 flex items-center text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 gap-1">
                Read Analysis 
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

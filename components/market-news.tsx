'use client';

import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface NewsArticle {
  id: string;
  publisher: {
    name: string;
    homepage_url: string;
    logo_url: string;
    favicon_url: string;
  };
  title: string;
  author: string;
  published_utc: string;
  article_url: string;
  tickers: string[];
  amp_url: string;
  image_url: string;
  description: string;
  keywords: string[];
}

interface MarketNewsProps {
  limit?: number;
}

export function MarketNews({ limit = 6 }: MarketNewsProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      setArticles(data.articles || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hr ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Newspaper className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Market News</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-800/50 rounded-lg p-4">
              <div className="h-4 bg-slate-800 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Newspaper className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Market News</h3>
        </div>
        <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 rounded-lg p-4">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">Unable to load market news at this time</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Newspaper className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Market News</h3>
        </div>
        <p className="text-slate-500 text-sm">No recent market news available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Newspaper className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Market News</h3>
            <p className="text-xs text-slate-500">Latest financial headlines</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <TrendingUp className="w-4 h-4" />
          <span>Live updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.article_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-slate-800/30 hover:bg-slate-800/50 rounded-lg p-4 transition-colors"
          >
            <div className="flex gap-3">
              {/* Publisher Icon */}
              <div className="flex-shrink-0">
                {article.publisher.favicon_url ? (
                  <img
                    src={article.publisher.favicon_url}
                    alt={article.publisher.name}
                    className="w-8 h-8 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).className = 'w-8 h-8 rounded bg-slate-700 flex items-center justify-center';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
                    <Newspaper className="w-4 h-4 text-slate-500" />
                  </div>
                )}
              </div>
              
              {/* Article Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-400">{article.publisher.name}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(article.published_utc)}
                  </span>
                </div>
                
                <h4 className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                
                {/* Related Tickers */}
                {article.tickers && article.tickers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tickers.slice(0, 4).map((ticker) => (
                      <span
                        key={ticker}
                        className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
                      >
                        {ticker}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* External Link */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, AlertCircle } from 'lucide-react';

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

interface StockNewsProps {
  symbol: string;
  limit?: number;
}

export function StockNews({ symbol, limit = 5 }: StockNewsProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news?symbol=${symbol}&limit=${limit}`);
      
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
    if (symbol) {
      fetchNews();
    }
  }, [symbol, limit]);

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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Newspaper className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Latest News</h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
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
          <Newspaper className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Latest News</h3>
        </div>
        <div className="flex items-center gap-2 text-amber-400">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">Unable to load news at this time</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Newspaper className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Latest News</h3>
        </div>
        <p className="text-slate-500 text-sm">No recent news available for {symbol}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Newspaper className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Latest News</h3>
        </div>
        <span className="text-xs text-slate-500">{articles.length} articles</span>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <a
            key={article.id}
            href={article.article_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className={`flex gap-4 ${index !== articles.length - 1 ? 'pb-4 border-b border-slate-800' : ''}`}>
              {/* Article Image */}
              {article.image_url && (
                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-slate-800">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Article Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {article.publisher.favicon_url && (
                    <img
                      src={article.publisher.favicon_url}
                      alt={article.publisher.name}
                      className="w-4 h-4 rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="text-xs text-slate-400">{article.publisher.name}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(article.published_utc)}
                  </span>
                </div>
                
                <h4 className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                  {article.title}
                </h4>
                
                {article.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {article.description}
                  </p>
                )}
                
                {/* Tickers */}
                {article.tickers && article.tickers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tickers.slice(0, 3).map((ticker) => (
                      <span
                        key={ticker}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          ticker.toUpperCase() === symbol.toUpperCase()
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {ticker}
                      </span>
                    ))}
                    {article.tickers.length > 3 && (
                      <span className="text-xs text-slate-500">
                        +{article.tickers.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* External Link Icon */}
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

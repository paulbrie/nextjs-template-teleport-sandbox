'use client';

import { useState, useEffect } from 'react';

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
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span style={{fontSize: '1.25rem'}}>📰</span>
          <h3 className="text-lg font-bold">Latest News</h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{height: '60px', backgroundColor: '#f3f4f6', borderRadius: '0.25rem'}}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span style={{fontSize: '1.25rem'}}>📰</span>
          <h3 className="text-lg font-bold">Latest News</h3>
        </div>
        <div className="flex items-center gap-2 text-red-600">
          <span>⚠️</span>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span style={{fontSize: '1.25rem'}}>📰</span>
          <h3 className="text-lg font-bold">Latest News</h3>
        </div>
        <p className="text-gray-600">No news available for {symbol}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span style={{fontSize: '1.25rem'}}>📰</span>
        <h3 className="text-lg font-bold">Latest News</h3>
      </div>
      
      <div className="space-y-4">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.article_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:bg-gray-50 p-3 rounded-lg transition-colors"
            style={{textDecoration: 'none'}}
          >
            <div className="flex gap-4">
              {/* Article Image */}
              {article.image_url && (
                <div style={{flexShrink: 0, width: '80px', height: '60px', borderRadius: '0.5rem', overflow: 'hidden'}}>
                  <img
                    src={article.image_url}
                    alt={article.title}
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Article Content */}
              <div style={{flex: 1, minWidth: 0}}>
                <div className="flex items-center gap-2 mb-1" style={{flexWrap: 'wrap'}}>
                  {article.publisher.favicon_url && (
                    <img
                      src={article.publisher.favicon_url}
                      alt={article.publisher.name}
                      style={{width: '16px', height: '16px', borderRadius: '2px'}}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="text-sm text-gray-600">{article.publisher.name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{formatDate(article.published_utc)}</span>
                </div>
                
                <h4 className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">
                  {article.title}
                </h4>
                
                {article.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {article.description.substring(0, 100)}...
                  </p>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

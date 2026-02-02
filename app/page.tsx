'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  vwap: number;
  lastUpdate: string;
  isMock?: boolean;
}

const stockLogos: Record<string, string> = {
  AMZN: 'https://logo.clearbit.com/amazon.com',
  GOOG: 'https://logo.clearbit.com/google.com',
  GOOGL: 'https://logo.clearbit.com/google.com',
  AMD: 'https://logo.clearbit.com/amd.com',
  NVDA: 'https://logo.clearbit.com/nvidia.com',
};

export default function Home() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchStockData = async () => {
    try {
      const response = await fetch('/api/stocks');
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();
      setStocks(data.stocks);
      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };
  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toLocaleString();
  };
  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    return `$${(cap / 1e6).toFixed(2)}M`;
  };

  if (loading && stocks.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-medium text-slate-300">
            Loading market data...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MarketPulse</h1>
                <p className="text-xs text-slate-400">Real-Time Tracker</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Updates
              </div>
              {lastUpdate && (
                <span className="text-xs text-slate-500">
                  Last update: {lastUpdate}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Market <span className="gradient-text">Overview</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Track your favorite stocks with real-time data updates
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock, index) => {
            const isPositive = stock.change >= 0;
            const delay = index * 100;

            return (
              <Link
                key={stock.symbol}
                href={`/stock/${stock.symbol}`}
                className="group animate-fade-in"
                style={{ animationDelay: `${delay}ms` }}
              >
                <div className="card-hover bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">
                  {/* Stock Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                        {stockLogos[stock.symbol] ? (
                          <img
                            src={stockLogos[stock.symbol]}
                            alt={stock.symbol}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-lg font-bold text-slate-400">${stock.symbol[0]}</span>`;
                            }}
                          />
                        ) : (
                          <span className="text-lg font-bold text-slate-400">{stock.symbol[0]}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
                        <p className="text-xs text-slate-500">{stock.isMock ? 'Demo Data' : 'Live'}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isPositive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {isPositive ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">
                      {formatPrice(stock.price)}
                    </span>
                    <span className={`ml-2 text-sm font-medium ${
                      isPositive ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {formatChange(stock.change, stock.changePercent)}
                    </span>
                  </div>

                  {/* Mini Chart Placeholder */}
                  <div className="h-12 mb-4 flex items-end gap-1">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const height = 30 + Math.random() * 70;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm ${isPositive ? 'bg-emerald-500/30' : 'bg-red-500/30'}`}
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1">Volume</p>
                      <p className="text-slate-300 font-medium">{formatVolume(stock.volume)}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1">Market Cap</p>
                      <p className="text-slate-300 font-medium">{formatMarketCap(stock.marketCap)}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1">High</p>
                      <p className="text-emerald-400 font-medium">{formatPrice(stock.high)}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1">Low</p>
                      <p className="text-red-400 font-medium">{formatPrice(stock.low)}</p>
                    </div>
                  </div>

                  {/* Hover Indicator */}
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Click for details</span>
                    <svg className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Data updates every 5 seconds • Powered by Massive API
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-slate-500">System Operational</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

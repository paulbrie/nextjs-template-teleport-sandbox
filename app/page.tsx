'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StocksOverviewChart } from '@/components/stocks-overview-chart';
import { VolumeChart } from '@/components/volume-chart';

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
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">StockTracker</h1>
                <p className="text-xs text-slate-400">Real-time Market Data</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Live</span>
                <span className="text-slate-600">|</span>
                <span>Last update: {lastUpdate}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StocksOverviewChart stocks={stocks} />
          <VolumeChart stocks={stocks.map(s => ({ symbol: s.symbol, volume: s.volume, price: s.price }))} />
        </div>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Tracked Stocks</h2>
          <p className="text-slate-400">Real-time data for major tech stocks</p>
        </div>

        {/* Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock) => {
            const isPositive = stock.change >= 0;
            const logoUrl = stockLogos[stock.symbol];

            return (
              <Link
                key={stock.symbol}
                href={`/stock/${stock.symbol}`}
                className="group block bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt={`${stock.symbol} logo`}
                        className="w-10 h-10 rounded-lg bg-white p-1 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
                      <p className="text-xs text-slate-500">
                        {new Date(stock.lastUpdate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    isPositive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-white">{formatPrice(stock.price)}</p>
                  <p className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatChange(stock.change, stock.changePercent)}
                  </p>
                </div>

                {/* Mini Chart Visualization */}
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

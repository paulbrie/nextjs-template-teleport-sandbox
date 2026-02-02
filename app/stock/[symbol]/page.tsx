'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface DetailedStockData {
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

const stockInfo: Record<string, { name: string; sector: string; logo: string }> = {
  AMZN: { name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', logo: 'https://logo.clearbit.com/amazon.com' },
  GOOG: { name: 'Alphabet Inc.', sector: 'Technology', logo: 'https://logo.clearbit.com/google.com' },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Technology', logo: 'https://logo.clearbit.com/google.com' },
  AMD: { name: 'Advanced Micro Devices', sector: 'Technology', logo: 'https://logo.clearbit.com/amd.com' },
  NVDA: { name: 'NVIDIA Corporation', sector: 'Technology', logo: 'https://logo.clearbit.com/nvidia.com' },
};

export default function StockDetail() {
  const params = useParams();
  const symbol = params?.symbol as string;
  const [stock, setStock] = useState<DetailedStockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = async () => {
    if (!symbol) return;
    
    try {
      const response = await fetch('/api/stocks');
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();
      const stockData = data.stocks.find((s: any) => s.symbol === symbol.toUpperCase());
      
      if (stockData) {
        setStock(stockData);
        setError(null);
      } else {
        setError(`Stock data for ${symbol} not found`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchStockData();
      const interval = setInterval(fetchStockData, 5000);
      return () => clearInterval(interval);
    }
  }, [symbol]);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-medium text-slate-300">
            Loading {symbol} data...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {error || 'Stock not found'}
          </h2>
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to overview
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;
  const info = stockInfo[stock.symbol] || { name: stock.symbol, sector: 'Unknown', logo: '' };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MarketPulse</h1>
                <p className="text-xs text-slate-400">Real-Time Tracker</p>
              </div>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stock Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
                {info.logo ? (
                  <img
                    src={info.logo}
                    alt={stock.symbol}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-2xl font-bold text-slate-400">${stock.symbol[0]}</span>`;
                    }}
                  />
                ) : (
                  <span className="text-2xl font-bold text-slate-400">{stock.symbol[0]}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{stock.symbol}</h1>
                <p className="text-slate-400">{info.name}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-500">
                  {info.sector}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-4xl font-bold text-white">{formatPrice(stock.price)}</div>
              <div className={`flex items-center gap-2 mt-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                <span className="text-lg font-semibold">
                  {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
                <span className="text-sm">Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-xs mb-1">Open</p>
            <p className="text-white font-semibold">{formatPrice(stock.open)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-xs mb-1">Previous Close</p>
            <p className="text-white font-semibold">{formatPrice(stock.previousClose)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-xs mb-1">Volume</p>
            <p className="text-white font-semibold">{formatVolume(stock.volume)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-xs mb-1">Market Cap</p>
            <p className="text-white font-semibold">{formatMarketCap(stock.marketCap)}</p>
          </div>
        </div>

        {/* Price Range & VWAP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Day's Range</h3>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-red-400">Low: {formatPrice(stock.low)}</span>
              <span className="text-emerald-400">High: {formatPrice(stock.high)}</span>
            </div>
            <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-red-500 via-slate-500 to-emerald-500"
                style={{
                  left: '0%',
                  right: '0%'
                }}
              />
              <div
                className="absolute w-3 h-3 bg-white rounded-full shadow-lg top-1/2 -translate-y-1/2"
                style={{
                  left: `${((stock.price - stock.low) / (stock.high - stock.low)) * 100}%`
                }}
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-slate-500">Current price position in range</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-4">VWAP</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{formatPrice(stock.vwap)}</p>
                <p className="text-xs text-slate-500 mt-1">Volume Weighted Average Price</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                stock.price >= stock.vwap
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {stock.price >= stock.vwap ? 'Above VWAP' : 'Below VWAP'}
              </div>
            </div>
          </div>
        </div>

        {/* Market Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-slate-300">
                Market Status: <span className="text-white font-medium">{isPositive ? 'Bullish' : 'Bearish'}</span>
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Last updated: {new Date(stock.lastUpdate).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Data updates every 5 seconds • Powered by Massive API
            </p>
            {stock.isMock && (
              <span className="text-xs text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                Demo Data Mode
              </span>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}

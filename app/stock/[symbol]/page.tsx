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

export default function StockDetail() {
  const params = useParams();
  const symbol = params?.symbol as string;
  const [stock, setStock] = useState<DetailedStockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

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
        setLastUpdate(new Date().toLocaleTimeString());
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
      // Initial fetch
      fetchStockData();

      // Set up interval to fetch every 5 seconds
      const interval = setInterval(fetchStockData, 5000);

      return () => clearInterval(interval);
    }
  }, [symbol]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="text-xl font-semibold mt-4 text-gray-700 dark:text-gray-300">
            Loading {symbol} data...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading {symbol}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'Stock not found'}</p>
          <Link 
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-500 hover:text-blue-600 font-semibold mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {stock.symbol}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time stock data
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {formatPrice(stock.price)}
              </div>
              <div className={`text-lg font-medium ${
                isPositive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatChange(stock.change, stock.changePercent)}
              </div>
            </div>
          </div>
          
          {lastUpdate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {lastUpdate}
            </p>
          )}
        </div>

        {/* Stock Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Price Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Price Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Current Price</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(stock.price)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Open</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(stock.open)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">High</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {formatPrice(stock.high)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Low</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {formatPrice(stock.low)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Previous Close</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(stock.previousClose)}
                </span>
              </div>
              {stock.vwap > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">VWAP</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatPrice(stock.vwap)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Performance Overview
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Change</span>
                <span className={`font-semibold ${
                  isPositive 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatChange(stock.change, stock.changePercent)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Direction</span>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    isPositive ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`font-semibold ${
                    isPositive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {isPositive ? 'Up' : 'Down'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Day Range</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(stock.high - stock.low)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Volume</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatVolume(stock.volume)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Market Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Symbol</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stock.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Last Update</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Date(stock.lastUpdate).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className={`px-4 py-2 rounded-full font-semibold ${
                  isPositive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {isPositive ? '📈 Bullish' : '📉 Bearish'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Indicator */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Price Movement
          </h2>
          <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`absolute h-full transition-all duration-500 ${
                isPositive ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min(Math.abs(stock.changePercent) * 5, 100)}%`,
                left: isPositive ? '50%' : `${50 - Math.min(Math.abs(stock.changePercent) * 5, 50)}%`
              }}
            />
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-400"></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span>Down</span>
            <span>0%</span>
            <span>Up</span>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>Data provided by Massive API • Updates every 5 seconds</p>
          {stock.isMock && (
            <p className="text-yellow-600 dark:text-yellow-400 mt-1">
              ⚠️ Currently showing mock data - API integration in progress
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}

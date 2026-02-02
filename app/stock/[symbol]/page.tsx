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
            Error Loading Stock Data
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || 'Stock data not available'}
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {stock.symbol}
            </h1>
            {stock.isMock && (
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                Mock Data
              </span>
            )}
          </div>
          
          {lastUpdate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {lastUpdate}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Price Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Current Price
            </h2>
            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {formatPrice(stock.price)}
            </div>
            <div className={`text-xl font-semibold ${
              isPositive 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatChange(stock.change, stock.changePercent)}
            </div>
          </div>

          {/* Market Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Market Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Volume</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stock.volume.toLocaleString()}
                </span>
              </div>
              {stock.marketCap > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${(stock.marketCap / 1e9).toFixed(2)}B
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Daily Range Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Today's Range
            </h2>
            <div className="space-y-4">
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
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Performance Overview
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Change</span>
                <span className={`font-semibold ${
                  isPositive 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatPrice(Math.abs(stock.change))} ({Math.abs(stock.changePercent).toFixed(2)}%)
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
                <span className="text-gray-600 dark:text-gray-400">Range (H-L)</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(stock.high - stock.low)}
                </span>
              </div>
            </div>
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

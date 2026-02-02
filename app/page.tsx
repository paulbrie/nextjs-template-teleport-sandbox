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

export default function Home() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const symbols = ['AMZN', 'GOOG', 'GOOGL', 'AMD', 'NVDA'];

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
    // Initial fetch
    fetchStockData();

    // Set up interval to fetch every 5 seconds
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

  if (loading && stocks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="text-xl font-semibold mt-4 text-gray-700 dark:text-gray-300">
            Loading stock data...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📈 Stock Market Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Real-time stock prices updated every 5 seconds
          </p>
          {lastUpdate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {lastUpdate}
            </p>
          )}
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-2xl mx-auto">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {symbols.map((symbol) => {
            const stock = stocks.find(s => s.symbol === symbol);
            const isPositive = stock ? stock.change >= 0 : false;

            return (
              <Link
                key={symbol}
                href={`/stock/${symbol}`}
                className="block transform hover:scale-105 transition-all duration-200"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 p-6 cursor-pointer h-full">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {symbol}
                      </h2>
                      {stock?.isMock && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded">
                          MOCK
                        </span>
                      )}
                    </div>
                    
                    {stock ? (
                      <>
                        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                          {formatPrice(stock.price)}
                        </div>
                        
                        <div className={`text-sm font-medium mb-4 ${
                          isPositive 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatChange(stock.change, stock.changePercent)}
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex justify-between">
                            <span>Volume:</span>
                            <span className="font-medium">
                              {formatVolume(stock.volume)}
                            </span>
                          </div>
                          {stock.marketCap > 0 && (
                            <div className="flex justify-between">
                              <span>Market Cap:</span>
                              <span className="font-medium">
                                ${(stock.marketCap / 1e9).toFixed(2)}B
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>High:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {formatPrice(stock.high)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Low:</span>
                            <span className="font-medium text-red-600 dark:text-red-400">
                              {formatPrice(stock.low)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-xs text-blue-500 dark:text-blue-400 font-medium">
                            Click for details →
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>Data provided by Massive API • Updates every 5 seconds</p>
          <p className="text-sm mt-2">
            Tracking: AMZN, GOOG, GOOGL, AMD, NVDA
          </p>
        </footer>
      </div>
    </div>
  );
}

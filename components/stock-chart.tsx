"use client";

interface PricePoint {
  time: string;
  price: number;
  volume: number;
}

interface StockChartProps {
  symbol: string;
  data?: PricePoint[];
  currentPrice?: number;
  change?: number;
  changePercent?: number;
}

export function StockChart({ symbol, data, currentPrice, change, changePercent }: StockChartProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Stock Chart: {symbol}</h3>
      {data && data.length > 0 ? (
        <div className="h-64 bg-gray-100 rounded flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-2">Chart data available</p>
          <p className="text-sm text-gray-400">Current: ${currentPrice?.toFixed(2)}</p>
          <p className="text-sm text-gray-400">
            Change: {change !== undefined && change >= 0 ? '+' : ''}{change?.toFixed(2)} ({changePercent?.toFixed(2)}%)
          </p>
        </div>
      ) : (
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Stock chart placeholder</p>
        </div>
      )}
    </div>
  );
}

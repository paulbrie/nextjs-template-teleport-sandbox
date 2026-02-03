"use client";

export function StockChart({ symbol }: { symbol: string }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Stock Chart: {symbol}</h3>
      <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
        <p className="text-gray-500">Stock chart placeholder</p>
      </div>
    </div>
  );
}

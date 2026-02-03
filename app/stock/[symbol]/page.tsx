"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  lastUpdate: string;
  open?: number;
  high?: number;
  low?: number;
  previousClose?: number;
  vwap?: number;
  isMock?: boolean;
}

export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  
  const [stock, setStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchStockData = useCallback(async () => {
    try {
      const response = await fetch("/api/stocks");
      
      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }

      const data = await response.json();
      const foundStock = data.stocks.find((s: StockData) => s.symbol === symbol.toUpperCase());
      
      if (foundStock) {
        setStock(foundStock);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } else {
        setError(`Stock ${symbol} not found`);
      }
    } catch (err) {
      console.error("Error fetching stock:", err);
      setError("Failed to fetch stock data");
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    if (symbol) {
      fetchStockData();
      const interval = setInterval(fetchStockData, 5000);
      return () => clearInterval(interval);
    }
  }, [symbol, fetchStockData]);

  if (loading && !stock) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p>Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (error && !stock) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Link href="/" style={{ color: "#2563eb", textDecoration: "none" }}>← Back to Dashboard</Link>
          <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "1rem", borderRadius: "0.5rem", marginTop: "1rem" }}>
            ⚠️ {error}
          </div>
        </div>
      </div>
    );
  }

  if (!stock) return null;

  const isPositive = stock.change >= 0;
  const colorClass = isPositive ? "#10b981" : "#ef4444";
  const sign = isPositive ? "+" : "";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <header style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontSize: "0.875rem" }}>← Back to Dashboard</Link>
              <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "#111827", margin: "0.25rem 0 0 0" }}>
                {stock.symbol}
                {stock.isMock && <span style={{ fontSize: "0.75rem", marginLeft: "0.5rem", padding: "0.125rem 0.5rem", backgroundColor: "#f3f4f6", color: "#6b7280", borderRadius: "0.25rem" }}>DEMO</span>}
              </h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Last updated: {lastUpdated}</p>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "0.75rem", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#374151", marginBottom: "1rem" }}>Price Information</h2>
            <div style={{ fontSize: "3rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
              ${stock.price.toFixed(2)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.125rem", fontWeight: "600", color: colorClass }}>
              <span>{sign}{stock.change.toFixed(2)}</span>
              <span>({sign}{stock.changePercent.toFixed(2)}%)</span>
              <span>{isPositive ? "📈" : "📉"}</span>
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", borderRadius: "0.75rem", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#374151", marginBottom: "1rem" }}>Trading Info</h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#6b7280" }}>Volume</span>
                <span style={{ fontWeight: "500" }}>{(stock.volume / 1000000).toFixed(2)}M</span>
              </div>
              {stock.open !== undefined && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>Open</span>
                  <span style={{ fontWeight: "500" }}>${stock.open.toFixed(2)}</span>
                </div>
              )}
              {stock.high !== undefined && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>High</span>
                  <span style={{ fontWeight: "500" }}>${stock.high.toFixed(2)}</span>
                </div>
              )}
              {stock.low !== undefined && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>Low</span>
                  <span style={{ fontWeight: "500" }}>${stock.low.toFixed(2)}</span>
                </div>
              )}
              {stock.previousClose !== undefined && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>Previous Close</span>
                  <span style={{ fontWeight: "500" }}>${stock.previousClose.toFixed(2)}</span>
                </div>
              )}
              {stock.vwap !== undefined && stock.vwap > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>VWAP</span>
                  <span style={{ fontWeight: "500" }}>${stock.vwap.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", borderRadius: "0.75rem", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb", gridColumn: "1 / -1" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#374151", marginBottom: "1rem" }}>Performance Overview</h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: "1", minWidth: "200px", padding: "1rem", backgroundColor: isPositive ? "#ecfdf5" : "#fef2f2", borderRadius: "0.5rem" }}>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Today's Change</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "700", color: colorClass, margin: "0.25rem 0 0 0" }}>
                  {sign}{stock.change.toFixed(2)} ({sign}{stock.changePercent.toFixed(2)}%)
                </p>
              </div>
              <div style={{ flex: "1", minWidth: "200px", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem" }}>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Day Range</p>
                <p style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827", margin: "0.25rem 0 0 0" }}>
                  ${stock.low?.toFixed(2) || "--"} - ${stock.high?.toFixed(2) || "--"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "0.5rem",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>

      <footer style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e5e7eb", padding: "1.5rem", marginTop: "2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
            Data provided by Massive API • Updates every 5 seconds
          </p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

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

const symbols = ["AMZN", "GOOG", "GOOGL", "AMD", "NVDA"];

function StockCard({ stock }: { stock: StockData }) {
  const isPositive = stock.change >= 0;
  const colorClass = isPositive ? "#10b981" : "#ef4444";
  const sign = isPositive ? "+" : "";

  return (
    <Link 
      href={`/stock/${stock.symbol}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.75rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#111827",
              margin: 0,
            }}
          >
            {stock.symbol}
          </h3>
          {stock.isMock && (
            <span
              style={{
                fontSize: "0.625rem",
                padding: "0.125rem 0.375rem",
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
                borderRadius: "0.25rem",
              }}
            >
              DEMO
            </span>
          )}
        </div>

        <div
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "0.5rem",
          }}
        >
          ${stock.price.toFixed(2)}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: colorClass,
          }}
        >
          <span>{sign}{stock.change.toFixed(2)}</span>
          <span>({sign}{stock.changePercent.toFixed(2)}%)</span>
          <span style={{ fontSize: "1rem" }}>{isPositive ? "📈" : "📉"}</span>
        </div>

        <div
          style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "#6b7280",
          }}
        >
          <span>Vol: {(stock.volume / 1000000).toFixed(2)}M</span>
          <span>Updated: {new Date(stock.lastUpdate).toLocaleTimeString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [stocks, setStocks] = useState<StockData[]>([]);
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
      setStocks(data.stocks);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error("Error fetching stocks:", err);
      setError("Failed to fetch stock data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockData();

    // Set up auto-refresh every 5 seconds
    const interval = setInterval(fetchStockData, 5000);

    return () => clearInterval(interval);
  }, [fetchStockData]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "1rem 1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#111827",
                  margin: 0,
                }}
              >
                📈 Stock Market Tracker
              </h1>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0.25rem 0 0 0" }}>
                Real-time stock prices updated every 5 seconds
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
                Last updated: {lastUpdated || "Loading..."}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  marginTop: "0.25rem",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: loading ? "#fbbf24" : "#10b981",
                    borderRadius: "50%",
                    animation: loading ? "pulse 1.5s infinite" : "none",
                  }}
                />
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  {loading ? "Updating..." : "Live"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {loading && stocks.length === 0 ? (
            // Loading skeleton
            symbols.map((symbol) => (
              <div
                key={symbol}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    height: "1.5rem",
                    width: "80px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "0.25rem",
                    marginBottom: "0.75rem",
                  }}
                />
                <div
                  style={{
                    height: "2.5rem",
                    width: "120px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "0.25rem",
                    marginBottom: "0.5rem",
                  }}
                />
                <div
                  style={{
                    height: "1rem",
                    width: "100px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "0.25rem",
                  }}
                />
              </div>
            ))
          ) : (
            stocks.map((stock) => <StockCard key={stock.symbol} stock={stock} />)
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          padding: "1.5rem",
          marginTop: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
            Data provided by Massive API • Updates every 5 seconds
          </p>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.5rem" }}>
            Tracking: AMZN, GOOG, GOOGL, AMD, NVDA
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

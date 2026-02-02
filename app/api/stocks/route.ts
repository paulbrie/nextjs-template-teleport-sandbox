import { NextResponse } from 'next/server';

const symbols = ['AMZN', 'GOOG', 'GOOGL', 'AMD', 'NVDA'];

// Massive API (formerly Polygon.io) base URL
const MASSIVE_API_BASE = 'https://api.massive.com';

interface MassiveSnapshotResponse {
  ticker?: {
    ticker?: string;
    day?: {
      o?: number;  // open
      h?: number;  // high
      l?: number;  // low
      c?: number;  // close
      v?: number;  // volume
      vw?: number; // volume weighted average price
    };
    prevDay?: {
      c?: number;  // previous close
    };
    min?: {
      c?: number;  // current price (last minute close)
    };
    todaysChange?: number;
    todaysChangePerc?: number;
    updated?: number; // Unix timestamp in milliseconds
  };
}

async function fetchStockSnapshot(symbol: string, apiKey: string): Promise<MassiveSnapshotResponse | null> {
  try {
    // Using the Massive Snapshot API to get real-time stock data
    const url = `${MASSIVE_API_BASE}/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}?apiKey=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Error fetching ${symbol}: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as MassiveSnapshotResponse;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    const apiKey = process.env.MASSIVE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'MASSIVE_API_KEY not configured' },
        { status: 500 }
      );
    }

    const stocks = [];

    // Fetch data for each symbol
    for (const symbol of symbols) {
      try {
        const response = await fetchStockSnapshot(symbol, apiKey);
        
        if (response && response.ticker) {
          const ticker = response.ticker;
          const dayData = ticker.day || {};
          const prevDay = ticker.prevDay || {};
          const minData = ticker.min || {};
          
          // Current price - use minute close if available, otherwise day close
          const currentPrice = minData.c || dayData.c || 0;
          const previousClose = prevDay.c || 0;
          const change = ticker.todaysChange || (currentPrice - previousClose);
          const changePercent = ticker.todaysChangePerc || (previousClose > 0 ? (change / previousClose) * 100 : 0);
          
          // Handle the timestamp - it's a Unix timestamp in milliseconds
          let lastUpdate: string;
          try {
            if (ticker.updated && typeof ticker.updated === 'number') {
              lastUpdate = new Date(ticker.updated).toISOString();
            } else {
              lastUpdate = new Date().toISOString();
            }
          } catch (e) {
            lastUpdate = new Date().toISOString();
          }
          
          stocks.push({
            symbol,
            price: currentPrice,
            change: change,
            changePercent: changePercent,
            volume: dayData.v || 0,
            marketCap: 0, // Not directly available from snapshot
            lastUpdate: lastUpdate,
            open: dayData.o || 0,
            high: dayData.h || 0,
            low: dayData.l || 0,
            previousClose: previousClose,
            vwap: dayData.vw || 0,
          });
        } else {
          throw new Error(`No data returned for ${symbol}`);
        }
      } catch (stockError) {
        console.error(`Error fetching data for ${symbol}:`, stockError);
        
        // Provide mock data if API fails (for testing purposes)
        const mockPrice = 100 + Math.random() * 200;
        const mockChange = (Math.random() - 0.5) * 10;
        const mockChangePercent = (mockChange / mockPrice) * 100;
        
        stocks.push({
          symbol,
          price: mockPrice,
          change: mockChange,
          changePercent: mockChangePercent,
          volume: Math.floor(Math.random() * 10000000),
          marketCap: Math.floor(Math.random() * 1000000000000),
          lastUpdate: new Date().toISOString(),
          open: mockPrice + (Math.random() - 0.5) * 5,
          high: mockPrice + Math.random() * 10,
          low: mockPrice - Math.random() * 10,
          previousClose: mockPrice - mockChange,
          isMock: true, // Flag to indicate this is mock data
        });
      }
    }

    return NextResponse.json({
      stocks,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in stocks API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stock data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

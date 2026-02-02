import { NextResponse } from 'next/server';
import { MassiveClient } from '@massive.com/client-js';

const symbols = ['AMZN', 'GOOG', 'GOOGL', 'AMD', 'NVDA'];

export async function GET() {
  try {
    const apiKey = process.env.MASSIVE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'MASSIVE_API_KEY not configured' },
        { status: 500 }
      );
    }

    const client = new MassiveClient(apiKey);
    const stocks = [];

    // Fetch data for each symbol
    for (const symbol of symbols) {
      try {
        // Using the Massive API to get real-time stock data
        const response = await client.stocks.getQuote(symbol);
        
        if (response && response.data) {
          const stockData = response.data;
          
          stocks.push({
            symbol,
            price: stockData.price || 0,
            change: stockData.change || 0,
            changePercent: stockData.changePercent || 0,
            volume: stockData.volume || 0,
            marketCap: stockData.marketCap || 0,
            lastUpdate: new Date().toISOString(),
            // Additional data for detail page
            open: stockData.open || 0,
            high: stockData.high || 0,
            low: stockData.low || 0,
            previousClose: stockData.previousClose || 0,
          });
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

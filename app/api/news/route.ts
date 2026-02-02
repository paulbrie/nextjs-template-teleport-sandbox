import { NextResponse } from 'next/server';

const MASSIVE_API_BASE = 'https://api.massive.com';

interface NewsArticle {
  id: string;
  publisher: {
    name: string;
    homepage_url: string;
    logo_url: string;
    favicon_url: string;
  };
  title: string;
  author: string;
  published_utc: string;
  article_url: string;
  tickers: string[];
  amp_url: string;
  image_url: string;
  description: string;
  keywords: string[];
}

interface NewsResponse {
  results: NewsArticle[];
  status: string;
  count: number;
  next_url?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const apiKey = process.env.MASSIVE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'MASSIVE_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Build the URL with query parameters
    let url = `${MASSIVE_API_BASE}/v2/reference/news?limit=${limit}&apiKey=${apiKey}`;
    
    // If a symbol is provided, filter news for that ticker
    if (symbol) {
      url += `&ticker=${symbol.toUpperCase()}`;
    }
    
    // Sort by published date (newest first)
    url += '&order=desc&sort=published_utc';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Error fetching news: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch news: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json() as NewsResponse;
    
    return NextResponse.json({
      articles: data.results || [],
      count: data.count || 0,
      symbol: symbol || null,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in news API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch news',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

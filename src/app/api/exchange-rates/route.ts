import { NextRequest, NextResponse } from 'next/server';

const EXCHANGE_RATE_API_KEY = 'e55bb1917f56be389d205cef';
const BASE_CURRENCY = 'IDR'; // Indonesian Rupiah as base

// Cache the exchange rates for 1 hour to avoid hitting API limits
let cachedRates: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetCurrency = searchParams.get('currency') || 'USD';
    
    // Check if we have cached rates and they're still fresh
    const now = Date.now();
    if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
      const rate = cachedRates.conversion_rates[targetCurrency] || 1;
      return NextResponse.json({
        base: BASE_CURRENCY,
        target: targetCurrency,
        rate: rate,
        cached: true,
        lastUpdate: new Date(lastFetchTime).toISOString()
      });
    }

    // Fetch fresh rates from ExchangeRate-API
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${BASE_CURRENCY}`,
      {
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`ExchangeRate-API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.result !== 'success') {
      throw new Error('Failed to fetch exchange rates');
    }

    // Cache the rates
    cachedRates = data;
    lastFetchTime = now;

    const rate = data.conversion_rates[targetCurrency] || 1;

    return NextResponse.json({
      base: BASE_CURRENCY,
      target: targetCurrency,
      rate: rate,
      cached: false,
      lastUpdate: new Date(data.time_last_update_unix * 1000).toISOString(),
      allRates: data.conversion_rates // Return all rates for client-side switching
    });
  } catch (error) {
    console.error('Exchange rate API error:', error);
    
    // Fallback to 1:1 rate if API fails
    return NextResponse.json(
      { 
        base: BASE_CURRENCY,
        target: request.nextUrl.searchParams.get('currency') || 'USD',
        rate: 1,
        error: 'Failed to fetch exchange rates, using fallback',
        cached: false
      },
      { status: 200 } // Return 200 with fallback instead of error
    );
  }
}

// GET all available currencies
export async function POST(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
      return NextResponse.json({
        base: BASE_CURRENCY,
        rates: cachedRates.conversion_rates,
        cached: true,
        lastUpdate: new Date(lastFetchTime).toISOString()
      });
    }

    // Fetch fresh rates
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${BASE_CURRENCY}`
    );

    if (!response.ok) {
      throw new Error(`ExchangeRate-API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.result !== 'success') {
      throw new Error('Failed to fetch exchange rates');
    }

    // Cache the rates
    cachedRates = data;
    lastFetchTime = now;

    return NextResponse.json({
      base: BASE_CURRENCY,
      rates: data.conversion_rates,
      cached: false,
      lastUpdate: new Date(data.time_last_update_unix * 1000).toISOString()
    });
  } catch (error) {
    console.error('Exchange rate API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch exchange rates',
        base: BASE_CURRENCY,
        rates: {}
      },
      { status: 500 }
    );
  }
}

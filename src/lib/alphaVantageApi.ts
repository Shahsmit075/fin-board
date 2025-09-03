import { AlphaVantageData, AlphaVantageMetaData, AlphaVantageWidget } from '@/store/alphaVantageStore';
import { getCachedData, setCachedData, CACHE_TTL, generateCacheKey } from './cache';

export interface AlphaVantageResponse {
  data: AlphaVantageData[];
  metaData: AlphaVantageMetaData;
  isCached?: boolean;
}

export class AlphaVantageError extends Error {
  constructor(
    message: string, 
    public code?: string, 
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'AlphaVantageError';
    
    // Default retry after 1 minute for rate limits
    if (!retryAfter && message.toLowerCase().includes('rate limit')) {
      this.retryAfter = 60; // 60 seconds
    }
  }
}

/**
 * Fetch data from AlphaVantage API with caching support
 * @param widget The widget configuration
 * @param apiKey AlphaVantage API key
 * @returns Promise with the API response and metadata
 */
export const fetchAlphaVantageData = async (
  widget: AlphaVantageWidget,
  apiKey: string
): Promise<AlphaVantageResponse> => {
  const baseUrl = 'https://www.alphavantage.co/query';
  const params = new URLSearchParams({
    function: widget.function,
    symbol: widget.symbol,
    apikey: apiKey,
  });

  // Add interval parameter for intraday data
  if (widget.function === 'TIME_SERIES_INTRADAY') {
    params.append('interval', widget.interval);
  }

  const url = `${baseUrl}?${params.toString()}`;
  
  // Generate cache key based on widget properties
  const cacheKey = generateCacheKey('alphavantage', widget.symbol, widget.interval || widget.function);
  
  // Determine TTL based on data type
  const ttl = widget.function === 'TIME_SERIES_INTRADAY' 
    ? CACHE_TTL.INTRADAY 
    : CACHE_TTL.DAILY;
    
  // Try to get data from cache first
  const cachedData = await getCachedData<AlphaVantageResponse>(cacheKey);
  if (cachedData) {
    return { ...cachedData, isCached: true };
  }

  try {
    const response = await fetch(url, {
      cache: 'no-cache', // Bypass browser cache, we handle our own caching
    });

    if (!response.ok) {
      // If we have cached data and the API fails, return cached data with a warning
      if (cachedData) {
        console.warn('API request failed, returning cached data');
        return { ...cachedData, isCached: true };
      }
      throw new AlphaVantageError(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    // Handle rate limit response
    if (json['Note'] || json['Information']?.includes('API key')) {
      // If we have cached data and hit rate limit, return cached data with a warning
      if (cachedData) {
        console.warn('Rate limit hit, returning cached data');
        return { ...cachedData, isCached: true };
      }
      
      throw new AlphaVantageError(
        'API rate limit exceeded. Please try again later.',
        'RATE_LIMIT_EXCEEDED',
        60 // 1 minute cooldown
      );
    }

    // Extract metadata
    const metaDataKey = Object.keys(json).find(key => key.includes('Meta Data'));
    if (!metaDataKey) {
      throw new AlphaVantageError('Invalid API response format');
    }

    const rawMetaData = json[metaDataKey];
    const metaData: AlphaVantageMetaData = {
      information: rawMetaData['1. Information'] || rawMetaData['Information'] || '',
      symbol: rawMetaData['2. Symbol'] || rawMetaData['Symbol'] || widget.symbol,
      lastRefreshed: rawMetaData['3. Last Refreshed'] || rawMetaData['Last Refreshed'] || '',
      interval: rawMetaData['4. Interval'] || rawMetaData['Interval'],
      outputSize: rawMetaData['5. Output Size'] || rawMetaData['Output Size'],
      timeZone: rawMetaData['6. Time Zone'] || rawMetaData['Time Zone'] || 'US/Eastern',
    };

    // Extract time series data
    const timeSeriesKey = Object.keys(json).find(key => 
      key.includes('Time Series') || key.includes('Weekly') || key.includes('Monthly')
    );
    
    if (!timeSeriesKey) {
      throw new AlphaVantageError('No time series data found in response');
    }

    const timeSeriesData = json[timeSeriesKey];
    if (!timeSeriesData || Object.keys(timeSeriesData).length === 0) {
      throw new AlphaVantageError('No data available for this symbol');
    }

    // Convert time series data to our format
    const data: AlphaVantageData[] = Object.entries(timeSeriesData)
      .map(([timestamp, values]: [string, any]) => ({
        timestamp,
        open: parseFloat(values['1. open'] || values['open'] || '0'),
        high: parseFloat(values['2. high'] || values['high'] || '0'),
        low: parseFloat(values['3. low'] || values['low'] || '0'),
        close: parseFloat(values['4. close'] || values['close'] || '0'),
        volume: parseInt(values['5. volume'] || values['volume'] || '0'),
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-50); // Keep last 50 data points for performance

    return { data, metaData };
  } catch (error) {
    if (error instanceof AlphaVantageError) {
      throw error;
    }
    
    console.error('Alpha Vantage API Error:', error);
    throw new AlphaVantageError(
      error instanceof Error ? error.message : 'Failed to fetch data from Alpha Vantage'
    );
  }
};
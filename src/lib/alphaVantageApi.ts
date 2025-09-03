import { AlphaVantageData, AlphaVantageMetaData, AlphaVantageWidget } from '@/store/alphaVantageStore';

export interface AlphaVantageResponse {
  data: AlphaVantageData[];
  metaData: AlphaVantageMetaData;
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

  try {
    const response = await fetch(url, {
      cache: 'no-store', // Disable caching for real-time data
    });

    if (!response.ok) {
      throw new AlphaVantageError(`HTTP ${response.status}: ${response.statusText}`);
    }

    const jsonData = await response.json();

    // Check for API errors
    if (jsonData['Error Message']) {
      throw new AlphaVantageError('Invalid symbol or API request');
    }

    if (jsonData['Note'] || jsonData['Information']) {
      // Extract retry time from the note if available
      let retryAfter: number | undefined;
      const note = jsonData['Note'] || jsonData['Information'];
      const timeMatch = note?.match(/(\d+)\s+minute/);
      if (timeMatch) {
        retryAfter = parseInt(timeMatch[1]) * 60; // Convert minutes to seconds
      }
      
      throw new AlphaVantageError(
        'API rate limit exceeded. Please try again later.',
        'RATE_LIMIT_EXCEEDED',
        retryAfter
      );
    }

    // Extract metadata
    const metaDataKey = Object.keys(jsonData).find(key => key.includes('Meta Data'));
    if (!metaDataKey) {
      throw new AlphaVantageError('Invalid API response format');
    }

    const rawMetaData = jsonData[metaDataKey];
    const metaData: AlphaVantageMetaData = {
      information: rawMetaData['1. Information'] || rawMetaData['Information'] || '',
      symbol: rawMetaData['2. Symbol'] || rawMetaData['Symbol'] || widget.symbol,
      lastRefreshed: rawMetaData['3. Last Refreshed'] || rawMetaData['Last Refreshed'] || '',
      interval: rawMetaData['4. Interval'] || rawMetaData['Interval'],
      outputSize: rawMetaData['5. Output Size'] || rawMetaData['Output Size'],
      timeZone: rawMetaData['6. Time Zone'] || rawMetaData['Time Zone'] || 'US/Eastern',
    };

    // Extract time series data
    const timeSeriesKey = Object.keys(jsonData).find(key => 
      key.includes('Time Series') || key.includes('Weekly') || key.includes('Monthly')
    );
    
    if (!timeSeriesKey) {
      throw new AlphaVantageError('No time series data found in response');
    }

    const timeSeriesData = jsonData[timeSeriesKey];
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
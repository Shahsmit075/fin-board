import { useState, useEffect } from "react";
import { X, AlertCircle, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Widget, StockData, ApiResponse } from "@/components/types";
import { FinancialChart } from "./FinancialChart";

interface WidgetCardProps {
  widget: Widget;
  onRemove: () => void;
}

export const WidgetCard = ({ widget, onRemove }: WidgetCardProps) => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    // Add timestamp to prevent caching
    const timestamp = '';
    const url = `${buildApiUrl()}${timestamp}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const json = await response.json();
      
      // Handle rate limiting
      if (json['Note'] || json['Information']?.includes('API key')) {
        throw new Error('API rate limit exceeded. Please wait a moment and try again.');
      }
      
      const timeSeriesKey = Object.keys(json).find(key => key.includes('Time Series'));
      if (!timeSeriesKey) {
        throw new Error('Invalid API response format');
      }
      
      const timeSeries = json[timeSeriesKey];
      const formattedData = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
        timestamp: date,
        open: parseFloat(values['1. open'] || values['open'] || '0'),
        high: parseFloat(values['2. high'] || values['high'] || '0'),
        low: parseFloat(values['3. low'] || values['low'] || '0'),
        close: parseFloat(values['4. close'] || values['close'] || '0'),
        volume: parseInt(values['5. volume'] || values['volume'] || '0'),
      }));
      
      setData(formattedData);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = () => {
    fetchData(true); // Force refresh with new timestamp
  };
  
  const buildApiUrl = () => {
    const baseUrl = "https://www.alphavantage.co/query";
    const params = new URLSearchParams();

    // Add function parameter first
    switch (widget.dataType) {
      case "intraday":
        params.append("function", "TIME_SERIES_INTRADAY");        
        // Add symbol parameter second
        params.append("symbol", widget.company);
        params.append("interval", "5min");
        if (widget.intraday?.month) {
          params.append("outputsize", "full");
        }
        break;
      case "daily":
        params.append("function", "TIME_SERIES_DAILY");
        // params.append("symbol", widget.company);
        break;
      case "weekly":
        params.append("function", "TIME_SERIES_WEEKLY");
        // params.append("symbol", widget.company);
        break;
      case "monthly":
        params.append("function", "TIME_SERIES_MONTHLY");
        // params.append("symbol", widget.company);
        break;
      default:
        params.append("function", "TIME_SERIES_DAILY");
        params.append("symbol", widget.company);
    }
    if(widget.dataType !== "intraday") {
      params.append("symbol", widget.company);
    }
    params.append("apikey", "demo");

    return `${baseUrl}?${params.toString()}`;
  };

  const parseApiResponse = (response: ApiResponse): StockData[] => {
    const timeSeries = Object.keys(response).find(key => 
      key.includes("Time Series") || key.includes("Weekly") || key.includes("Monthly")
    );

    if (!timeSeries) {
      throw new Error("No time series data found");
    }

    const data = response[timeSeries];
    const entries = Object.entries(data).slice(0, 100); // Limit to last 100 data points

    return entries.map(([timestamp, values]: [string, any]) => ({
      timestamp,
      open: parseFloat(values["1. open"]),
      high: parseFloat(values["2. high"]),
      low: parseFloat(values["3. low"]),
      close: parseFloat(values["4. close"]),
      volume: parseInt(values["5. volume"]),
    })).reverse(); // Reverse to show chronological order
  };

  useEffect(() => {
    fetchData(false);
  }, [widget]);

  const getDataTypeLabel = () => {
    if (widget.dataType === "intraday") {
      return `Intraday (custom) - ${widget.intraday?.outputSize || 'compact'}`;
    }
    return widget.dataType.charAt(0).toUpperCase() + widget.dataType.slice(1);
  };

  return (
    <Card className="card-hover bg-gradient-surface border border-border/50 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {widget.company} ({widget.dataType})
        </CardTitle>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
            className="h-6 w-6 text-muted-foreground hover:text-primary"
            title="Refresh data"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${loading ? 'animate-spin' : ''}`}
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            title="Remove widget"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      {lastRefreshed && (
        <div className="px-6 py-1 -mt-2">
          <p className="text-xs text-muted-foreground">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
      )}
      <CardContent>
        {loading && (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading market data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-16 h-16 mx-auto bg-error-light rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-error" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Unable to Load Data</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="space-y-4">
            <FinancialChart data={data} symbol={widget.company} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
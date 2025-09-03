import { useState, useEffect } from "react";
import { X, RefreshCw, AlertCircle, TrendingUp, TrendingDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteWidget as QuoteWidgetType, QuoteData, useDashboardStore } from "@/store/dashboardStore";
import { useToast } from "@/hooks/use-toast";
import { RateLimitError } from "@/components/ui/rate-limit-error";
import { getCachedData, setCachedData, CACHE_TTL, generateCacheKey } from "@/lib/cache";

class FinnhubError extends Error {
  constructor(message: string, public code?: string, public retryAfter?: number) {
    super(message);
    this.name = 'FinnhubError';
  }
}

interface QuoteWidgetProps {
  widget: QuoteWidgetType;
  apiKey: string;
}

export const QuoteWidget = ({ widget, apiKey }: QuoteWidgetProps) => {
  const [data, setData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryAfter, setRetryAfter] = useState<number>();
  const { removeWidget } = useDashboardStore();
  const { toast } = useToast();

  const fetchQuoteData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = generateCacheKey('finnhub', `quote:${widget.symbol}`);
      
      // Try to get data from cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedData = await getCachedData<QuoteData>(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      // If not in cache or forcing refresh, fetch from API
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${widget.symbol}&token=${apiKey}`
      );
      
      if (!response.ok) {
        // If we have cached data and the API fails, use cached data
        const cachedData = await getCachedData<QuoteData>(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          toast({
            title: "Using Cached Data",
            description: "Couldn't fetch fresh data, showing cached data.",
            variant: "default",
          });
          return;
        }
        
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
          throw new FinnhubError(
            'API rate limit exceeded. Please try again later.',
            'RATE_LIMIT_EXCEEDED',
            retryAfter
          );
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const quoteData: QuoteData = await response.json();
      
      // Cache the successful response for 1 minute
      await setCachedData(cacheKey, quoteData, CACHE_TTL.INTRADAY);
      
      // Check if the response indicates an invalid symbol (current price is 0)
      if (quoteData.c === 0) {
        throw new Error("Invalid symbol or no data available");
      }

      setData(quoteData);
    } catch (err) {
      console.error("Error fetching quote data:", err);
      const error = err instanceof Error 
        ? (err as FinnhubError).code === 'RATE_LIMIT_EXCEEDED'
          ? err as FinnhubError
          : new Error(err.message)
        : new Error("Failed to fetch quote data");
      
      setError(error);
      
      if (error instanceof FinnhubError && error.code === 'RATE_LIMIT_EXCEEDED') {
        setRetryAfter(error.retryAfter);
        toast({
          title: "Rate Limit Exceeded",
          description: `API rate limit reached. Please wait ${error.retryAfter || 60} seconds before retrying.`,
          variant: "destructive",
        });
      } else if (error.message.includes("Invalid symbol")) {
        toast({
          title: "Invalid Symbol",
          description: `The symbol "${widget.symbol}" is not valid or has no data available.`,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuoteData();
  }, [widget.symbol, apiKey]);

  const handleRemove = () => {
    removeWidget(widget.id);
    toast({
      title: "Widget Removed",
      description: `${widget.symbol} widget has been removed from your dashboard.`,
    });
  };

  const handleRefresh = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    fetchQuoteData(true); // Force refresh
  };

  const calculateChange = () => {
    if (!data) return { change: 0, changePercent: 0, isPositive: false };
    
    const change = data.c - data.pc;
    const changePercent = (change / data.pc) * 100;
    const isPositive = change >= 0;
    
    return { change, changePercent, isPositive };
  };

  const { change, changePercent, isPositive } = calculateChange();

  if (loading) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (error) {
    // Special handling for rate limit errors
    if (error instanceof FinnhubError && error.code === 'RATE_LIMIT_EXCEEDED') {
      return (
        <Card className="w-full h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {widget.symbol}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeWidget(widget.id)}
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RateLimitError 
              error={error}
              onRetry={fetchQuoteData}
              retryAfter={retryAfter}
            />
          </CardContent>
        </Card>
      );
    }
    
    // Fallback error UI for other errors
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-destructive">
            Error: {widget.symbol}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="h-6 w-6"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeWidget(widget.id)}
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error.message}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover bg-gradient-surface border border-border/50 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isPositive ? 'bg-success/10' : 'bg-error/10'}`}>
              {isPositive ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-error" />
              )}
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {widget.symbol}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="h-8 w-8 p-0 hover:bg-primary/10 rounded-lg"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-8 w-8 p-0 hover:bg-error-light hover:text-error rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Current Price */}
          <div className="text-center pb-4 border-b border-border/50">
            <div className="text-3xl font-bold text-foreground mb-2">
              ${data.c.toFixed(2)}
            </div>
            <div className={`flex items-center justify-center gap-1 text-sm font-medium ${
              isPositive ? 'text-success' : 'text-error'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {isPositive ? '+' : ''}${change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Quote Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Open</div>
              <div className="font-medium text-foreground">${data.o.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">High</div>
              <div className="font-medium text-success">${data.h.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Low</div>
              <div className="font-medium text-error">${data.l.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Previous Close</div>
              <div className="font-medium text-foreground">${data.pc.toFixed(2)}</div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/30">
            Last updated: {new Date(data.t * 1000).toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
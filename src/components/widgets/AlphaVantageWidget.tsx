import { useState, useEffect } from "react";
import { X, RefreshCw, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialChart } from "@/components/widgets/FinancialChart";
import { AlphaVantageWidget as AlphaVantageWidgetType, useAlphaVantageStore } from "@/store/alphaVantageStore";
import { fetchAlphaVantageData, AlphaVantageResponse, AlphaVantageError } from "@/lib/alphaVantageApi";
import { useToast } from "@/hooks/use-toast";

interface AlphaVantageWidgetProps {
  widget: AlphaVantageWidgetType;
  apiKey: string;
}

export const AlphaVantageWidget = ({ widget, apiKey }: AlphaVantageWidgetProps) => {
  const [data, setData] = useState<AlphaVantageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { removeWidget } = useAlphaVantageStore();
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchAlphaVantageData(widget, apiKey);
      setData(response);
    } catch (err) {
      console.error("Error fetching Alpha Vantage data:", err);
      
      let errorMessage = "Failed to fetch data";
      if (err instanceof AlphaVantageError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Show toast for specific errors
      if (errorMessage.includes("rate limit")) {
        toast({
          title: "Rate Limit Exceeded",
          description: "You've reached the Alpha Vantage API limit. Please wait before refreshing.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("Invalid symbol")) {
        toast({
          title: "Invalid Symbol",
          description: `The symbol "${widget.symbol}" is not valid.`,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [widget.symbol, widget.interval, apiKey]);

  const handleRemove = () => {
    removeWidget(widget.id);
    toast({
      title: "Widget Removed",
      description: `${widget.symbol} (${getIntervalDisplayName(widget.interval)}) widget has been removed.`,
    });
  };

  const handleRefresh = () => {
    fetchData();
  };

  const getIntervalDisplayName = (interval: string) => {
    const displayMap: Record<string, string> = {
      'daily': 'Daily',
      'weekly': 'Weekly', 
      'monthly': 'Monthly',
      '5min': '5 Minutes',
      '15min': '15 Minutes',
      '30min': '30 Minutes',
      '60min': '1 Hour',
    };
    return displayMap[interval] || interval;
  };

  return (
    <Card className="card-hover bg-gradient-surface border border-border/50 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              {widget.symbol}
              <span className="text-sm font-normal text-muted-foreground bg-primary/10 px-2 py-1 rounded-md">
                {getIntervalDisplayName(widget.interval)}
              </span>
            </CardTitle>
            {data?.metaData && (
              <p className="text-xs text-muted-foreground">
                Last refreshed: {new Date(data.metaData.lastRefreshed).toLocaleString()}
              </p>
            )}
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
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground text-sm">Loading chart data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-12 h-12 mx-auto bg-error-light rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-error" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Unable to Load Chart</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                {error.includes("rate limit") && (
                  <div className="mt-3 p-3 bg-warning-light rounded-lg">
                    <div className="flex items-center gap-2 text-warning">
                      <Info className="w-4 h-4" />
                      <span className="text-sm font-medium">Rate Limit Info</span>
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Free tier: 5 requests/min, 500/day
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && data && data.data.length > 0 && (
          <div className="space-y-4">
            <FinancialChart 
              data={data.data.map(item => ({
                timestamp: item.timestamp,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume,
              }))}
              symbol={widget.symbol}
            />
            
            {/* Data source info */}
            <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="w-3 h-3" />
                <span>Powered by Alpha Vantage • {data.metaData.information}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
import { useState, useEffect } from "react";
import { X, RefreshCw, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteWidget as QuoteWidgetType, QuoteData, useDashboardStore } from "@/store/dashboardStore";
import { useToast } from "@/hooks/use-toast";

interface QuoteWidgetProps {
  widget: QuoteWidgetType;
  apiKey: string;
}

export const QuoteWidget = ({ widget, apiKey }: QuoteWidgetProps) => {
  const [data, setData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { removeWidget } = useDashboardStore();
  const { toast } = useToast();

  const fetchQuoteData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${widget.symbol}&token=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const quoteData: QuoteData = await response.json();
      
      // Check if the response indicates an invalid symbol (current price is 0)
      if (quoteData.c === 0) {
        throw new Error("Invalid symbol or no data available");
      }

      setData(quoteData);
    } catch (err) {
      console.error("Error fetching quote data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch quote data";
      setError(errorMessage);
      
      if (errorMessage.includes("Invalid symbol")) {
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

  const handleRefresh = () => {
    fetchQuoteData();
  };

  const calculateChange = () => {
    if (!data) return { change: 0, changePercent: 0, isPositive: false };
    
    const change = data.c - data.pc;
    const changePercent = (change / data.pc) * 100;
    const isPositive = change >= 0;
    
    return { change, changePercent, isPositive };
  };

  const { change, changePercent, isPositive } = calculateChange();

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
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground text-sm">Loading quote data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-12 h-12 mx-auto bg-error-light rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-error" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Unable to Load Data</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && data && (
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
                <div className="text-muted-foreground">Previous Close</div>
                <div className="font-medium text-foreground">${data.pc.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">High</div>
                <div className="font-medium text-success">${data.h.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Low</div>
                <div className="font-medium text-error">${data.l.toFixed(2)}</div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/30">
              Last updated: {new Date(data.t * 1000).toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
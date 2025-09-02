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
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = buildApiUrl();
        const response = await fetch(url);
        const data = await response.json();

        if (data.Note) {
          throw new Error("API call frequency exceeded. Please try again later.");
        }

        if (data.Error || data["Error Message"]) {
          throw new Error(data.Error || data["Error Message"]);
        }

        const parsedData = parseApiResponse(data);
        setData(parsedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [widget]);

  const getDataTypeLabel = () => {
    if (widget.dataType === "intraday") {
      return `Intraday (custom) - ${widget.intraday?.outputSize || 'compact'}`;
    }
    return widget.dataType.charAt(0).toUpperCase() + widget.dataType.slice(1);
  };

  return (
    <Card className="card-hover bg-gradient-surface border border-border/50 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {widget.company}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {getDataTypeLabel()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 hover:bg-error-light hover:text-error rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

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
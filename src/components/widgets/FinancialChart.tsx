import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { StockData } from "@/components/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface FinancialChartProps {
  data: StockData[];
  symbol: string;
}

interface CandlestickData extends StockData {
  shadowTop: number;
  shadowBottom: number;
  bodyTop: number;
  bodyBottom: number;
  isPositive: boolean;
  formattedDate: string;
}

export const FinancialChart = ({ data, symbol }: FinancialChartProps) => {
  // Process data for candlestick visualization
  const processedData: CandlestickData[] = data.map((item) => {
    const isPositive = item.close >= item.open;
    return {
      ...item,
      shadowTop: item.high,
      shadowBottom: item.low,
      bodyTop: isPositive ? item.close : item.open,
      bodyBottom: isPositive ? item.open : item.close,
      isPositive,
      formattedDate: new Date(item.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: item.timestamp.includes(':') ? 'numeric' : undefined,
        minute: item.timestamp.includes(':') ? '2-digit' : undefined,
      }),
    };
  });

  const latestData = processedData[processedData.length - 1];
  const previousData = processedData[processedData.length - 2];
  const priceChange = latestData && previousData ? latestData.close - previousData.close : 0;
  const percentChange = latestData && previousData ? (priceChange / previousData.close) * 100 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border/50 rounded-lg p-4 shadow-lg">
          <p className="font-medium text-sm text-foreground mb-2">
            {data.formattedDate}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Open:</span>
              <span className="font-medium">${data.open.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">High:</span>
              <span className="font-medium price-positive">${data.high.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Low:</span>
              <span className="font-medium price-negative">${data.low.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Close:</span>
              <span className={`font-medium ${data.isPositive ? 'price-positive' : 'price-negative'}`}>
                ${data.close.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-border/30">
              <span className="text-muted-foreground">Volume:</span>
              <span className="font-medium">{data.volume.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Price Summary */}
      <div className="flex items-center justify-between p-4 bg-gradient-hero rounded-xl border border-border/30">
        <div>
          <h3 className="text-lg font-semibold text-foreground">${latestData?.close.toFixed(2)}</h3>
          <p className="text-sm text-muted-foreground">Current Price</p>
        </div>
        {latestData && previousData && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
            priceChange >= 0 ? 'bg-success-light text-success' : 'bg-error-light text-error'
          }`}>
            {priceChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%)
            </span>
          </div>
        )}
      </div>

      {/* Price Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" strokeOpacity={0.3} />
            <XAxis 
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Candlestick shadows (high-low lines) */}
            <Line
              type="monotone"
              dataKey="high"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="low"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              dot={false}
              connectNulls={false}
            />
            
            {/* Price line */}
            <Line
              type="monotone"
              dataKey="close"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" strokeOpacity={0.2} />
            <XAxis 
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString()}`, 'Volume']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar 
              dataKey="volume" 
              fill="hsl(var(--chart-volume))"
              radius={[2, 2, 0, 0]}
              opacity={0.7}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
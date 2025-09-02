import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard2() {
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem("alphaVantageApiKey") || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    localStorage.setItem("alphaVantageApiKey", apiKey);
    toast({
      title: "API Key Saved",
      description: "Your Alpha Vantage API key has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alpha Vantage: API Usecase</h1>
            <p className="text-muted-foreground mt-2">
              Using Alpha Vantage API to fetch and display financial data
            </p>
          </div>
        </div>

        {/* API Key Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Alpha Vantage API Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apikey">Alpha Vantage API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="apikey"
                    type="password"
                    placeholder="Enter your Alpha Vantage API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSaveApiKey}
                    disabled={!apiKey.trim()}
                  >
                    Save Key
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your API key is stored locally in your browser.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Alpha Vantage Integration</h2>
          <p className="text-muted-foreground mb-6">
            This is the Alpha Vantage dashboard. More features coming soon!
          </p>
          <Button disabled={!apiKey}>
            Add Alpha Vantage Widget
          </Button>
        </div>

        {/* Rate Limits Notice */}
        <div className="mt-8 bg-muted/30 border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 bg-warning rounded-full"></span>
            </div>
            <div>
              <h2 className="font-semibold text-sm text-foreground">Rate Limits</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Alpha Vantage has rate limits based on your subscription plan.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Free tier: 5 API requests per minute and 500 requests per day
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

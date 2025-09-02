import { useState } from "react";
import { Plus, Key, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/store/dashboardStore";
import { QuoteWidget } from "@/components/widgets/QuoteWidget";
import { AddQuoteWidgetModal } from "@/components/modals/AddQuoteWidgetModal";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";

export default function Dashboard() {
  const {
    apiKey,
    setApiKey,
    widgets,
    isAddModalOpen,
    setIsAddModalOpen,
  } = useDashboardStore();
  
  const [tempApiKey, setTempApiKey] = useState(apiKey || "");
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Finnhub API key has been saved securely in your browser.",
      });
    }
  };

  const handleAddWidget = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Finnhub API key first to add widgets.",
        variant: "destructive",
      });
      return;
    }
    setIsAddModalOpen(true);
  };

  return (
    <>
     <div className="min-h-screen bg-gradient-surface">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <Header/>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
  <h1 className="text-3xl font-bold text-foreground">Finnhub : API Usecase</h1>
  <p className="text-muted-foreground mt-2">
    Using /quote endpoint by Finnhub API, gives following data of a stock:
    <ul className="mt-3 list-disc list-inside text-sm text-muted-foreground space-y-1">
      <li><strong>c</strong> → Current price of the stock</li>
      <li><strong>d</strong> → Change in price since previous close</li>
      <li><strong>dp</strong> → Change in percentage (%) since previous close</li>
      <li><strong>h</strong> → Highest price of the day</li>
      <li><strong>l</strong> → Lowest price of the day</li>
      <li><strong>o</strong> → Opening price of the day</li>
      <li><strong>pc</strong> → Previous closing price</li>
      <li><strong>t</strong> → Timestamp (when this quote was last updated)</li>
    </ul>
  </p>
</div>

          <Button
            onClick={handleAddWidget}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Widget
          </Button>
        </div>

        {/* API Key Setup */}
        {!apiKey && (
          <Card className="mb-8 border-warning/20 bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <Key className="w-5 h-5" />
                Finnhub API Key Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-warning mb-1">Security Notice</p>
                  <p className="text-muted-foreground">
                    Your API key will be stored locally in your browser and never shared with our servers. 
                    Get a free API key at{" "}
                    <a 
                      href="https://finnhub.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary underline hover:no-underline"
                    >
                      finnhub.io
                    </a>
                  </p>
                </div>
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="apikey">Finnhub API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="apikey"
                    type="password"
                    placeholder="Enter your Finnhub API key..."
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveApiKey()}
                  />
                  <Button 
                    onClick={handleSaveApiKey}
                    disabled={!tempApiKey.trim()}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Key Management (when set) */}
        {apiKey && (
          <Card className="mb-8 border-success/20 bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-success">
                  <Key className="w-4 h-4" />
                  <span className="text-sm font-medium">API Key Configured</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTempApiKey(apiKey);
                    setApiKey("");
                  }}
                >
                  Update Key
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Widgets Grid */}
        {widgets.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="max-w-sm mx-auto space-y-4">
                <div>
                  <p className="text-muted-foreground mb-4">
                    Click 'Add Widget' to get started with real-time stock quotes.
                  </p>
                  <Button 
                    onClick={handleAddWidget}
                    className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Widget
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {widgets.map((widget) => (
              <QuoteWidget key={widget.id} widget={widget} apiKey={apiKey!} />
            ))}
          </div>
        )}
        <div className="mt-6"> </div>
<div className="bg-muted/30 border border-border rounded-lg p-4 shadow-sm w-full">
  <div className="flex items-start gap-2">
    <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
    <div>
      <h2 className="font-semibold text-sm text-foreground">Rate Limits</h2>
      <p className="text-xs text-muted-foreground mt-1">
        If your limit is exceeded, you will receive a response with{" "}
        <code className="bg-muted px-1 rounded">status code 429</code>.
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        On top of all plan limits, there is a{" "}
        <span className="font-medium">30 API calls / second</span> cap.
      </p>
    </div>
  </div>
</div>


        {/* Add Widget Modal */}
        <AddQuoteWidgetModal 
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
        />
      </div>
    </div>
    </div>
    </div>
    </>
  );
}
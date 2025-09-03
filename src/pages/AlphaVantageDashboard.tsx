import { Plus, TrendingUp, AlertCircle, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlphaVantageWidget } from "@/components/widgets/AlphaVantageWidget";
import { AddAlphaVantageWidgetModal } from "@/components/modals/AddAlphaVantageWidgetModal";
import { useAlphaVantageStore } from "@/store/alphaVantageStore";
import { Header } from "@/components/layout/Header";

export default function AlphaVantageDashboard() {
  const { widgets, apiKey, isAddModalOpen, setIsAddModalOpen } = useAlphaVantageStore();

  return (
    <>
         <div className="min-h-screen bg-gradient-surface">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header/>
    <div className="min-h-screen bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              Alpha Vantage API Usecase
            </h1>
            <p className="text-muted-foreground mt-2">
              Create financial chart widgets using Alpha Vantage data
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Widget
          </Button>
        </div>

        {/* Info Section */}
        <div className="grid gap-4 mb-8 lg:grid-cols-2">
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Alpha Vantage API Limits</p>
                <ul className="text-sm space-y-1">
                  <li>• Free tier: 5 requests per minute</li>
                  <li>• Daily limit: 500 requests</li>
                  <li>• Rate limit status code: 429</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <Alert className="border-warning/20 bg-warning/5">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Important Notes</p>
                <p className="text-sm">
                  Always check the{" "}
                  <a
                    href="https://www.alphavantage.co/documentation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Alpha Vantage documentation <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  for supported parameters and functions.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content */}
        {widgets.length === 0 ? (
          <Card className="border-dashed border-2 border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-center mb-2">Your dashboard is empty!</CardTitle>
              <CardDescription className="text-center mb-6 max-w-md">
                Click "Add Widget" to create your first Alpha Vantage financial chart widget.
              </CardDescription>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Widget
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
            {widgets.map((widget) => (
              <AlphaVantageWidget
                key={widget.id}
                widget={widget}
                apiKey={apiKey || ""}
              />
            ))}
          </div>
        )}

        {/* Additional Resources */}
        <div className="mt-12">
          <Card className="bg-gradient-hero border-border/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Getting Started with Alpha Vantage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Available Functions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• TIME_SERIES_DAILY - Daily stock data</li>
                    <li>• TIME_SERIES_WEEKLY - Weekly aggregated data</li>
                    <li>• TIME_SERIES_MONTHLY - Monthly aggregated data</li>
                    <li>• TIME_SERIES_INTRADAY - Real-time intraday data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Useful Links</h4>
                  <div className="space-y-2 text-sm">
                    <a
                      href="https://www.alphavantage.co/support/#api-key"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      Get Free API Key <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href="https://www.alphavantage.co/documentation/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      API Documentation <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddAlphaVantageWidgetModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </div>
    </div>
    </div>
    </>
  );
}
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from 'lucide-react';

type RateLimitErrorProps = {
  error: Error;
  onRetry?: () => void;
  retryAfter?: number; // in seconds
};

export function RateLimitError({ error, onRetry, retryAfter = 60 }: RateLimitErrorProps) {
  const [countdown, setCountdown] = useState(retryAfter);
  const canRetry = countdown === 0;

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleRetry = () => {
    if (canRetry && onRetry) {
      setCountdown(retryAfter);
      onRetry();
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Alert className="max-w-md" variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Rate Limit Exceeded</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error.message || 'API rate limit has been exceeded. Please wait before trying again.'}</p>
          
          <div className="pt-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {canRetry ? 'Ready to retry' : `Retry in ${countdown}s`}
            </span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRetry}
              disabled={!canRetry}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${!canRetry ? 'opacity-50' : ''}`} />
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAlphaVantageStore, AlphaVantageWidget } from "@/store/alphaVantageStore";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Info } from "lucide-react";

const formSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  symbol: z.string().min(1, "Stock symbol is required").max(10, "Symbol must be less than 10 characters"),
  interval: z.enum(['daily', 'weekly', 'monthly', '5min', '15min', '30min', '60min']),
});

interface AddAlphaVantageWidgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddAlphaVantageWidgetModal = ({ open, onOpenChange }: AddAlphaVantageWidgetModalProps) => {
  const { addWidget, setApiKey, apiKey } = useAlphaVantageStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: apiKey || "",
      symbol: "",
      interval: "daily",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const symbol = values.symbol.toUpperCase().trim();
      
      // Save API key
      setApiKey(values.apiKey);
      
      // Add widget to store
      addWidget(symbol, values.interval);
      
      // Close modal and reset form
      onOpenChange(false);
      form.reset({ 
        apiKey: values.apiKey,
        symbol: "",
        interval: "daily",
      });
      
      toast({
        title: "Widget Added",
        description: `${symbol} (${getIntervalDisplayName(values.interval)}) widget has been added to your dashboard.`,
      });
    } catch (error) {
      console.error("Error adding widget:", error);
      toast({
        title: "Error",
        description: "Failed to add widget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset({
      apiKey: apiKey || "",
      symbol: "",
      interval: "daily",
    });
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Alpha Vantage Chart Widget</DialogTitle>
          <DialogDescription>
            Create a financial chart widget using Alpha Vantage API data.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alpha Vantage API Key *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your Alpha Vantage API key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Get your free API key at{" "}
                    <a 
                      href="https://www.alphavantage.co/support/#api-key" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      alphavantage.co
                    </a>
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Symbol *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., IBM, AAPL, MSFT"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Interval *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time interval" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="5min">5 Minutes (Intraday)</SelectItem>
                      <SelectItem value="15min">15 Minutes (Intraday)</SelectItem>
                      <SelectItem value="30min">30 Minutes (Intraday)</SelectItem>
                      <SelectItem value="60min">1 Hour (Intraday)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                {isSubmitting ? "Adding..." : "Add Chart Widget"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
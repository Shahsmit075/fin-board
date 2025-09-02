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
import { useDashboardStore } from "@/store/dashboardStore";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  symbol: z.string().min(1, "Stock symbol is required").max(15, "Symbol must be less than 15 characters"),
});

interface AddQuoteWidgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddQuoteWidgetModal = ({ open, onOpenChange }: AddQuoteWidgetModalProps) => {
  const { addWidget } = useDashboardStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const symbol = values.symbol.toUpperCase().trim();
      
      // Add widget to store
      addWidget(symbol);
      
      // Close modal and reset form
      onOpenChange(false);
      form.reset();
      
      toast({
        title: "Widget Added",
        description: `${symbol} widget has been added to your dashboard.`,
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
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Quote Widget</DialogTitle>
          <DialogDescription>
            Enter a stock symbol to add a real-time quote widget to your dashboard.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Symbol</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., AAPL, TSLA, MSFT"
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
                {isSubmitting ? "Adding..." : "Add Widget"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
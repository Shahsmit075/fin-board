import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Widget } from "@/components/types";
import { TrendingUp } from "lucide-react";

const formSchema = z.object({
  company: z.string().min(1, "Please select a company"),
  dataType: z.string().min(1, "Please select a data type"),
  outputSize: z.string().optional(),
  month: z.string().optional(),
}).refine((data) => {
  if (data.dataType === "intraday" && !data.outputSize) {
    return false;
  }
  return true;
}, {
  message: "Please select an output size for intraday data",
  path: ["outputSize"],
});

interface AddWidgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: Widget) => void;
}

export const AddWidgetModal = ({ open, onOpenChange, onAddWidget }: AddWidgetModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      dataType: "",
      outputSize: "",
      month: "",
    },
  });

  const watchedDataType = form.watch("dataType");
  const watchedOutputSize = form.watch("outputSize");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const widget: Omit<Widget, 'id'> = {
        company: values.company,
        dataType: values.dataType,
      };

      if (values.dataType === "intraday") {
        widget.intraday = {
          outputSize: values.outputSize as 'compact' | 'full',
          month: values.month || undefined,
        };
      }

      onAddWidget(widget as Widget);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding widget:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-surface border border-border/50 shadow-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">Add New Widget</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Create a financial chart widget with real market data
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Company</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border/50 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border/50 shadow-lg">
                      <SelectItem value="IBM">IBM</SelectItem>
                      <SelectItem value="MSFT">Microsoft (MSFT)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Data Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border/50 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border/50 shadow-lg">
                      <SelectItem value="intraday">Intraday (5min)</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedDataType === "intraday" && (
              <FormField
                control={form.control}
                name="outputSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Output Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border/50 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select output size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border/50 shadow-lg">
                        <SelectItem value="compact">Compact(latest 100)</SelectItem>
                        <SelectItem value="full">Last Month</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* {watchedDataType === "intraday" && watchedOutputSize === "full" && (
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Specific Month (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 2024-01"
                        className="bg-input border-border/50 focus:ring-2 focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-border/50 hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-primary hover:bg-gradient-primary border-0 shadow-primary text-primary-foreground font-medium"
              >
                {isSubmitting ? "Adding..." : "Add Widget"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
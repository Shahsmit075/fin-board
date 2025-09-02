import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WidgetCard } from "@/components/widgets/WidgetCard";
import { Widget } from "@/components/types";

interface InteractiveDemoProps {
  widgets: Widget[];
  onAddWidget: () => void;
  onRemoveWidget: (id: string) => void;
}

export const InteractiveDemo = ({ widgets, onAddWidget, onRemoveWidget }: InteractiveDemoProps) => {
  return (
    <section className="py-16">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Interactive Trial Demo</h2>
            <p className="text-muted-foreground mt-2">
              Create using above steps - this doesnt require API...
            </p>
          </div>

          <Button
            onClick={onAddWidget}
            className="btn-hover bg-gradient-primary hover:bg-gradient-primary border-0 shadow-primary text-primary-foreground font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Widget
          </Button>
        </div>

        {widgets.length === 0 ? (
          <div className="text-center py-16 bg-gradient-hero rounded-2xl border border-border/50">
            <div className="max-w-md mx-auto space-y-4">
            
              <h3 className="text-xl font-semibold text-foreground">
                No widgets yet
              </h3>
              <p className="text-muted-foreground">
                Click "Add New Widget" to create your first financial chart
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {widgets.map((widget) => (
              <WidgetCard
                key={widget.id}
                widget={widget}
                onRemove={() => onRemoveWidget(widget.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
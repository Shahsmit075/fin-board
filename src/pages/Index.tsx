import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { InteractiveDemo } from "@/components/layout/InteractiveDemo";
import { Footer } from "@/components/layout/Footer";
import { AddWidgetModal } from "@/components/modals/AddWidgetModal";
import { Widget } from "@/components/types";

const Index = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addWidget = (widget: Widget) => {
    setWidgets(prev => [...prev, { ...widget, id: Date.now().toString() }]);
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <Hero />
        <InteractiveDemo
          widgets={widgets}
          onAddWidget={() => setIsModalOpen(true)}
          onRemoveWidget={removeWidget}
        />
        <Footer />
      </div>

      <AddWidgetModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddWidget={addWidget}
      />
    </div>
  );
};

export default Index;
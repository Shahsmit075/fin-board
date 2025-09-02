import { BarChart3, Zap, Eye } from "lucide-react";
import { LineChart, ListChecks, SlidersHorizontal, PlayCircle } from "lucide-react";


export const Hero = () => {
  const steps = [
    {
      icon: <LineChart className="w-5 h-5 text-primary" />,
      title: "Select a stock",
      desc: "Try symbols like IBM or MSFT.",
    },
    {
      icon: <ListChecks className="w-5 h-5 text-success" />,
      title: "Choose a data type",
      desc: "Daily, Weekly, Monthly, or Intraday.",
    },
    {
      icon: <SlidersHorizontal className="w-5 h-5 text-warning" />,
      title: "Customize options",
      desc: "For Intraday: Compact(Latest 100) or Last Month.",
    },
    {
      icon: <PlayCircle className="w-5 h-5 text-indigo-500" />,
      title: "Generate your chart",
      desc: "Click 'Add Widget' to view instantly.",
    },
  ];
  return (
    <section className="py-16 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
          Create interactive financial charts,{" "}
            <span className="bg-gradient-primary bg-clip-text text-green-600">
            No signup required!
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          No signup required.{" "}
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
            Bring your own API key
          </span>, multiple platform compatible.  
          Just pure visualization power at your fingertips.
        </p>
        </div>
        <div className="max-w-3xl mx-auto pt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {i + 1}
          </div>
          <div>
            <div className="flex items-center gap-2 font-medium">
              {step.icon}
              {step.title}
            </div>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>

      </div>
    </section>
  );
};
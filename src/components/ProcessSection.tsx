import { Upload, Zap, Download } from "lucide-react";

export const ProcessSection = () => {
  const steps = [
    {
      number: "1",
      title: "Provide some media",
      description: "Upload your own, or record your screen and camera.",
      icon: Upload,
    },
    {
      number: "2", 
      title: "Set Keyframes",
      description: "Control the camera movement to tell your story clearly and beautifully.",
      icon: Zap,
    },
    {
      number: "3",
      title: "Export",
      description: "Download your video or post it directly to social media.",
      icon: Download,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Easy as <span className="text-brand">One-Two-Three</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            The intuitive interfaces ensure a smooth and quick editing experience.
          </p>
          <p className="text-lg text-foreground">
            It's as simple as follows:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
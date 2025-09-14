import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const CTASection = () => {
  const benefits = [
    "No Credit Card needed",
    "No registration needed"
  ];

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-12">
          Ready to create <span className="text-brand">quality videos</span>?
        </h2>
        
        <div className="mb-8">
          <Button className="btn-hero text-lg px-8 py-4">
            Try demo project
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-primary" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
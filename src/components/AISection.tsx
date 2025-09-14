import { Button } from "@/components/ui/button";
import featureAI from "@/assets/feature-ai.jpg";

export const AISection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Repurpose your content with
              <span className="text-brand block">Artificial Intelligence</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8">
              Create powerful, engaging content with two clicks.
            </p>
            
            <p className="text-lg text-foreground mb-8">
              Keyframes Studio will automatically create keyframes and catchy subtitles!
            </p>
            
            <Button className="btn-hero">
              Try this template
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <img 
              src={featureAI} 
              alt="AI Processing Visualization" 
              className="w-full h-auto rounded-lg shadow-xl"
            />
            
            {/* Overlay labels */}
            <div className="absolute top-4 left-4 bg-surface-2 rounded-lg px-3 py-2 border border-border">
              <span className="text-sm font-medium text-foreground">Horizontal vs. Vertical</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
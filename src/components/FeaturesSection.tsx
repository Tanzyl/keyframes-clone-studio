import { Button } from "@/components/ui/button";
import featureConversion from "@/assets/feature-conversion.jpg";
import featureEditor from "@/assets/feature-editor.jpg";
import featureAI from "@/assets/feature-ai.jpg";
import { Play, Wand2, Users, Sparkles } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-surface-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Content Fitting Feature */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src={featureConversion} 
              alt="Content Fitting Feature" 
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-6">
              Fit your content perfectly
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Displaying horizontal videos on mobile screens is painful - at least it used to be. 
              You want to fill the screen as much as possible but also tell your story clearly.
            </p>
            <p className="text-lg text-foreground mb-8">
              Keyframes Studio helps you in creating beautiful videos that are enjoyable on all screens.
            </p>
            <Button className="btn-hero">
              Try demo project
            </Button>
          </div>
        </div>

        {/* AI Heavy Lifting Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let <span className="text-brand">AI</span> do the heavy lifting
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            We will process your video and highlight the most important parts.
          </p>
          <p className="text-lg text-foreground mb-12">
            Check out how easy it is!
          </p>
          <img 
            src={featureAI} 
            alt="AI Processing" 
            className="w-full max-w-4xl mx-auto rounded-lg shadow-xl"
          />
        </div>

        {/* Platform Features */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            One platform with <span className="text-brand">all the solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-16">
            We have everything you need from getting started to posting your video.
          </p>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Easy-to-use editor */}
            <div className="feature-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Easy-to-use editor</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Simplicity is the main focus while also providing all the best practices for video editing.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• No previous editing experience needed</li>
                <li>• Resize, trim, crop, cut, zoom, move and more</li>
                <li>• Live preview</li>
              </ul>
            </div>

            {/* Create subtitles automatically */}
            <div className="feature-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Wand2 className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Create subtitles automatically</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Videos with subtitles perform better - this is a fact. With Keyframes Studio generating them is as simple as clicking a button.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Subtitle generation in minutes</li>
                <li>• 12 supported languages</li>
                <li>• Highlight words karaoke-style</li>
              </ul>
            </div>

            {/* Images, GIFs, Viral sounds */}
            <div className="feature-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Images, GIFs, Viral sounds</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Make your videos pop with some extra elements. Keyframes Studio integrates sound and image libraries to help you with this.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Stock images and videos</li>
                <li>• Curated list of sounds</li>
                <li>• Search for any keyword</li>
              </ul>
            </div>

            {/* Effortless collaboration */}
            <div className="feature-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Effortless collaboration</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Invite your team to your workspace to share your videos and work together.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Unlimited projects</li>
                <li>• Save your work and continue later</li>
                <li>• Use the brand kit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
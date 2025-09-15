import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroMockup from "@/assets/hero-editor-mockup.jpg";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 hero-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Text Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Create videos for{" "}
            <span className="text-brand">socials</span>
            <span className="text-brand">*</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Keyframes Studio is an all-in-one platform for creating, editing and repurposing 
            beautiful videos for all social media platforms.
          </p>
          
          <p className="text-sm text-muted-foreground mb-8">
            *Without all the hassle
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
            <Button 
              className="btn-hero text-lg px-8 py-4"
              onClick={() => navigate('/editor')}
            >
              Try demo project
            </Button>
            <p className="text-sm text-muted-foreground self-center">
              No registration required
            </p>
          </div>
        </div>

        {/* Right Column - Hero Image */}
        <div className="relative">
          <div className="relative z-10">
            <img 
              src={heroMockup} 
              alt="Keyframes Studio Video Editor Interface" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
          
          {/* Floating elements to match original design */}
          <div className="absolute top-4 right-4 bg-card rounded-lg p-3 shadow-lg border border-border">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">12:30</span>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 bg-card rounded-lg p-3 shadow-lg border border-border">
            <div className="flex space-x-2">
              <button className="text-sm text-muted-foreground hover:text-foreground">Following</button>
              <button className="text-sm text-foreground font-medium">For you</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none"></div>
    </section>
  );
};
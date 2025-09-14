import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { AISection } from "@/components/AISection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { TargetAudienceSection } from "@/components/TargetAudienceSection";
import { CTASection } from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TestimonialSection />
        <AISection />
        <FeaturesSection />
        <ProcessSection />
        <TargetAudienceSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;

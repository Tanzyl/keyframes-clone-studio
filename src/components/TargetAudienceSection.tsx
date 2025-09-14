import { Users, Building, Heart } from "lucide-react";
import featureEditor from "@/assets/feature-editor.jpg";

export const TargetAudienceSection = () => {
  const audiences = [
    {
      title: "For content creators",
      description: "Boost your engagement and efficiency by using Keyframes Studio. Be it podcasts, vlogs of your trips or random gameplays - you can count on Keyframes Studio.",
      icon: Heart,
    },
    {
      title: "For digital agencies", 
      description: "Digital marketers, social media agencies are more in demand then ever. Keyframes Studio offers brand-kit features to make life even easier.",
      icon: Building,
    },
    {
      title: "For You.",
      description: "There are a million reasons to create videos. Whether it is for fun or for work, hop into our editor to get a feel of it.",
      icon: Users,
    },
  ];

  return (
    <section className="py-20 bg-surface-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Image */}
          <div className="relative">
            <img 
              src={featureEditor} 
              alt="Who is Keyframes Studio for" 
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>

          {/* Right Column - Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Create quality videos that reach your{" "}
              <span className="text-brand">target audience</span>
            </h2>
            
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold mb-8">Who is Keyframes Studio for?</h3>
              
              {audiences.map((audience, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <audience.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3">{audience.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {audience.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { CTASection } from "@/components/CTASection";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: isAnnual ? 7 : 9,
      period: "mo",
      description: "The quickest way to start creating content for social media.",
      features: [
        { name: "Projects", value: "Unlimited" },
        { name: "Seats", value: "5" },
        { name: "Storage", value: "20 GB" },
        { name: "Subtitles", value: "60 min / mo" },
        { name: "AI generation", value: "30 min / mo" },
        { name: "Brand kit", value: "No" },
        { name: "Watermark", value: "No" },
      ],
      cta: "Subscribe to plan",
      popular: false,
    },
    {
      name: "Professional", 
      price: isAnnual ? 12 : 15,
      period: "mo",
      description: "More power for businesses, agencies looking to improve their organizational efficiency.",
      features: [
        { name: "Projects", value: "Unlimited" },
        { name: "Seats", value: "20" },
        { name: "Storage", value: "50 GB" },
        { name: "Subtitles", value: "120 min / mo" },
        { name: "AI generation", value: "60 min / mo" },
        { name: "Brand kit", value: "Yes" },
        { name: "Watermark", value: "No" },
      ],
      cta: "Subscribe to plan",
      popular: true,
    },
    {
      name: "Enterprise",
      price: null,
      period: "mo",
      description: "Custom solutions tailored to your needs. Let's talk!",
      features: [
        { name: "Projects", value: "Unlimited" },
        { name: "Seats", value: "Custom" },
        { name: "Storage", value: "Custom" },
        { name: "Subtitles", value: "Custom" },
        { name: "AI generation", value: "Custom" },
        { name: "Brand kit", value: "Yes" },
        { name: "Watermark", value: "No" },
      ],
      cta: "Get in touch",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes, with a click of a button you are immediately unsubscribed.",
    },
    {
      question: "Do you offer trial version?",
      answer: "Yes! In fact you can use the editor as much as you want. You only have to subscribe to one of our plans if you hit one of the free plan limits or you want to export without watermarks.",
    },
    {
      question: "What is the brand kit?",
      answer: "The brand kit allows you to upload and save assets that are often reused across videos. Fonts, colors, videos, images and audios can be uploaded.",
    },
    {
      question: "How does the subtitling system work?",
      answer: "You get X minutes for each month. At the first of each month your usage is reset. Leftover minutes can not be carried over to next month.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Simple, transparent <span className="text-brand">pricing</span>
            </h1>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Billed Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-12 h-6 bg-surface-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
              <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Billed Annually
              </span>
            </div>
            
            {isAnnual && (
              <p className="text-sm text-primary mb-8">
                Enable to see yearly prices
              </p>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'featured' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="mb-4">
                    {plan.price ? (
                      <span className="text-4xl font-bold">${plan.price}</span>
                    ) : (
                      <span className="text-4xl font-bold">$?</span>
                    )}
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{feature.name}</span>
                      <span className="font-medium">{feature.value}</span>
                    </div>
                  ))}
                </div>

                <Button className={`w-full ${plan.popular ? 'btn-hero' : ''}`}>
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently asked questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <HelpCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <CTASection />
    </div>
  );
}
import { useState } from "react";
import { Header } from "@/components/Header";
import { CTASection } from "@/components/CTASection";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function Help() {
  const [openSection, setOpenSection] = useState<string | null>("faq");

  const faqItems = [
    {
      question: "What is Keyframes Studio?",
      answer: "Keyframes Studio is an online video editor platform. It focuses on creating videos for mobile screens and social media platforms, but you can use it for any video editing.",
    },
    {
      question: "Is Keyframes Studio free?",
      answer: "Keyframes Studio offers both a free and a paid plan. You can play around in the editor as much as you want and export with a watermark with the free tier.",
    },
    {
      question: "Can I have a feature request?",
      answer: "Feature requests are more than welcome. If you are missing something feel free to reach out to hello@keyframes.studio.",
    },
    {
      question: "Are the included sounds and images copyrighted?",
      answer: "The integrated GIFS, images, videos and most sounds are copyright-free. There are some trending sounds scraped from TikTok. You can use those on TikTok without worrying about copyrights, but be cautious when posting to other platforms. As always, respect the site's respective copyright agreements.",
    },
    {
      question: "What languages are supported for auto-subtitling?",
      answer: "Currently the following languages are supported: english, german, spanish, french, italian, portuguese, dutch, norwegian, danish, finnish, russian, hungarian, filipino, slovak. We are continously adding to the list, so if you want to see a language reach out to hello@keyframes.studio.",
    },
  ];

  const gettingStartedItems = [
    {
      question: "How can I use Open PRO without registration?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis enim lobortis scelerisque fermentum.",
    },
    {
      question: "Can I import my sitemap to Open PRO?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis enim lobortis scelerisque fermentum.",
    },
  ];

  const sections = [
    {
      id: "faq",
      title: "FAQ's – Frequently Asked Questions",
      lastUpdated: "March 21, 2023",
      items: faqItems,
    },
    {
      id: "getting-started",
      title: "Get started",
      lastUpdated: "June 30, 2020", 
      items: gettingStartedItems,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Help <span className="text-brand">Center</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions and get help with Keyframes Studio
            </p>
          </div>

          {/* Help Sections */}
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.id} className="bg-card border border-border rounded-lg">
                {/* Section Header */}
                <button
                  onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-1 transition-colors rounded-t-lg"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Last updated - {section.lastUpdated}
                    </p>
                  </div>
                  <ChevronDown 
                    className={`w-6 h-6 text-muted-foreground transition-transform ${
                      openSection === section.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Section Content */}
                {openSection === section.id && (
                  <div className="px-6 pb-6 space-y-6 border-t border-border">
                    {section.items.map((item, index) => (
                      <div key={index} className="pt-6">
                        <div className="flex items-start space-x-4">
                          <HelpCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-3 text-lg">{item.question}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center bg-surface-1 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Get in touch with our support team.
            </p>
            <a 
              href="mailto:hello@keyframes.studio"
              className="inline-flex items-center space-x-2 bg-primary hover:bg-brand-blue-light text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </main>

      <CTASection />
    </div>
  );
}
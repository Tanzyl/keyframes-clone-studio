import { Header } from "@/components/Header";
import { CTASection } from "@/components/CTASection";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "hello@keyframes.studio",
      action: "mailto:hello@keyframes.studio",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 9AM-5PM EST",
      action: "#",
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Call us for urgent support issues",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Office",
      description: "Visit us at our headquarters",
      contact: "San Francisco, CA",
      action: "#",
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
              Get in <span className="text-brand">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have a question about Keyframes Studio? We're here to help. Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us about your question or feedback..."
                  ></textarea>
                </div>
                
                <Button className="w-full btn-hero">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Methods */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Other ways to reach us</h2>
                <p className="text-muted-foreground mb-8">
                  Choose the method that works best for you. Our team is always ready to help.
                </p>
              </div>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.action}
                    className="block bg-surface-1 rounded-lg p-6 hover:bg-surface-2 transition-colors group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <method.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                        <p className="text-muted-foreground mb-2">{method.description}</p>
                        <p className="text-foreground font-medium">{method.contact}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* FAQ Link */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
                <p className="text-muted-foreground mb-4">
                  Find quick answers to common questions in our help center.
                </p>
                <Button variant="outline" className="w-full">
                  View FAQ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CTASection />
    </div>
  );
}
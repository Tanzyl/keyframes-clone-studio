import testimonialDave from "@/assets/testimonial-dave.jpg";
import testimonialDuy from "@/assets/testimonial-duy.jpg";

export const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "Our team's secret weapon for social media videos. Clean, intuitive, and loaded with snazzy templates. If you need a video tool that is like a Swiss Army Knife, Keyframes Studio is your jam.",
      author: "Dave Wilks",
      company: "teammarvel.co.uk",
      image: testimonialDave,
    },
    {
      quote: "Keyframes Studio makes it so much easier for us to create engaging how-to-videos to share with our audience. Gone are the days where we need to whip up our phones to record the screen!",
      author: "Duy Nguyen",
      company: "Co-Founder | Impack",
      image: testimonialDuy,
    },
  ];

  return (
    <section className="py-20 bg-surface-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="flex items-start space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="flex-1">
                  <blockquote className="text-foreground mb-4 text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-muted-foreground">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
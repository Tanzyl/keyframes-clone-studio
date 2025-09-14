import { Header } from "@/components/Header";
import { CTASection } from "@/components/CTASection";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      title: "10 Tips for Creating Engaging Social Media Videos",
      excerpt: "Learn the best practices for creating videos that capture attention and drive engagement across all social platforms.",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Tips & Tricks",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    },
    {
      title: "The Future of AI in Video Editing",
      excerpt: "Discover how artificial intelligence is revolutionizing video editing and what it means for content creators.",
      date: "March 10, 2024", 
      readTime: "7 min read",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    },
    {
      title: "Vertical vs Horizontal: Which Video Format Wins?",
      excerpt: "A comprehensive analysis of video formats and their performance across different social media platforms.",
      date: "March 5, 2024",
      readTime: "6 min read", 
      category: "Best Practices",
      image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop",
    },
    {
      title: "How to Add Subtitles That Actually Increase Views",
      excerpt: "The science behind effective subtitles and how they can dramatically improve your video performance.",
      date: "February 28, 2024",
      readTime: "4 min read",
      category: "Tutorial",
      image: "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=600&h=400&fit=crop",
    },
  ];

  const categories = ["All", "Tips & Tricks", "Technology", "Best Practices", "Tutorial"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Our <span className="text-brand">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest tips, tutorials, and insights about video editing and social media content creation.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category === "All" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-surface-1 text-muted-foreground hover:text-foreground hover:bg-surface-2"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-[var(--shadow-card)] transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <button className="flex items-center space-x-2 text-primary hover:text-brand-blue-light transition-colors font-medium">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <button className="bg-surface-1 hover:bg-surface-2 text-foreground font-medium px-8 py-3 rounded-lg transition-colors border border-border">
              Load More Posts
            </button>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-20 bg-surface-1 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Subscribe to our newsletter</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get the latest tips, tutorials, and product updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary hover:bg-brand-blue-light text-primary-foreground font-medium px-6 py-3 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      <CTASection />
    </div>
  );
}
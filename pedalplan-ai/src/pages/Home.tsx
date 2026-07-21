import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Map, Compass, ShieldCheck, Wallet, Flame } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

// Using a fallback gradient for hero bg in case the image fails, but importing the generated image
import heroBgPath from "../assets/hero-bg.jpg";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md group-hover:scale-105 transition-transform">
              <Map className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">PedalPlan AI</span>
          </Link>
          <Link href="/plan" data-testid="link-nav-plan">
            <Button size="sm" variant="default" className="shadow-sm">Plan My Adventure</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
          {/* Background Image / Overlay */}
          <div className="absolute inset-0 z-0">
             <div 
               className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply" 
               style={{ backgroundImage: `url(${heroBgPath})` }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
             <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
                  <Flame className="w-4 h-4" />
                  <span>The trusted companion for epic rides</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight text-foreground leading-[1.1] mb-6">
                  Plan smarter.<br />
                  <span className="text-primary">Ride farther.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                  Turn massive ambitions into exact itineraries. PedalPlan AI is the ultimate bikepacking planner that builds routes, packing lists, and pacing strategies perfectly tuned to your fitness and destination.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/plan" data-testid="link-hero-plan">
                    <Button size="lg" className="w-full sm:w-auto shadow-md group">
                      Plan My Adventure
                      <Compass className="ml-2 w-5 h-5 group-hover:rotate-45 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card relative z-10 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="mb-16 md:text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Everything figured out.</h2>
              <p className="text-muted-foreground text-lg">
                Stop juggling five different tabs. Get a cohesive, athletic-focused itinerary built for the reality of long days in the saddle.
              </p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <FeatureCard 
                icon={<Map className="w-6 h-6" />}
                title="AI Trip Planning"
                description="Tell us your destination and fitness level. We generate a realistic day-by-day pacing strategy and route concept."
                delay={0}
              />
              <FeatureCard 
                icon={<Flame className="w-6 h-6" />}
                title="Nutrition Guide"
                description="Exact caloric needs and fueling strategies tailored to the elevation profile of your planned adventure."
                delay={0.1}
              />
              <FeatureCard 
                icon={<Compass className="w-6 h-6" />}
                title="Packing Checklist"
                description="Dynamic gear lists that adapt to your accommodation choices—whether you're credit-card touring or wild camping."
                delay={0.2}
              />
              <FeatureCard 
                icon={<Wallet className="w-6 h-6" />}
                title="Budget Estimator"
                description="Accurate daily cost projections based on your travel style, local prices, and chosen overnight stops."
                delay={0.3}
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-6 h-6" />}
                title="Safety Tips"
                description="Bespoke regional advice, emergency contact protocols, and terrain-specific warnings for your route."
                delay={0.4}
              />
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 text-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Map className="w-5 h-5" />
            <span className="font-display font-bold text-lg">PedalPlan AI</span>
          </div>
          <p className="text-muted-foreground mb-4">The ultimate planner for ambitious bikepackers.</p>
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} PedalPlan AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24, delay } }
      }}
      className="bg-background border border-border p-6 rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-display mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

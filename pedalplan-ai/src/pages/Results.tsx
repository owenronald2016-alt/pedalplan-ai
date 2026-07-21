import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Map, MapPin, Calendar, Activity, TrendingUp, Tent, Wallet, 
  Droplets, Flame, AlertTriangle, Info, CheckCircle,
  ArrowLeft, Clock, ArrowRight, Bike, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  type PlannerFormValues,
  type Itinerary,
  generateItinerary,
} from "@/lib/itineraryGenerator";
import RouteMap from "@/components/RouteMap";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function SectionHeader({ title, description }: { title: string, description?: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">{title}</h2>
      {description && <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">{description}</p>}
    </div>
  );
}

export default function Results() {
  const [, navigate] = useLocation();
  const [trip, setTrip] = useState<PlannerFormValues | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const raw = localStorage.getItem('pedalplan-trip');
    if (raw) {
      try {
        const data = JSON.parse(raw) as PlannerFormValues;
        setTrip(data);
        setItinerary(generateItinerary(data));
      } catch (e) {
        console.error("Failed to parse trip data", e);
      }
    }
  }, []);

  if (!trip || !itinerary) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-4 text-center">
        <Map className="w-20 h-20 text-muted-foreground/30 mb-8" />
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">No trip found</h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-md">
          We couldn't find your generated itinerary in this session. Let's build a new adventure.
        </p>
        <Link href="/plan">
          <Button size="lg" className="shadow-sm">
            <MapPin className="w-5 h-5 mr-2" /> Plan an Adventure
          </Button>
        </Link>
      </div>
    );
  }

  const toggleItem = (name: string) => {
    setCheckedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const currencySymbol = itinerary.budget.currency === "EUR" ? "€" : "$";

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="flex flex-col min-h-[100dvh] bg-background"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md group-hover:scale-105 transition-transform">
              <Map className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:inline-block">PedalPlan AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/plan">
              <Button size="sm" variant="outline" className="shadow-sm gap-2">
                <ArrowLeft className="w-4 h-4" /> New Trip
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Summary */}
      <motion.section 
        variants={sectionVariants}
        className="bg-primary text-primary-foreground py-16 md:py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground/90 font-medium text-sm mb-6 border border-primary-foreground/20">
            <CheckCircle className="w-4 h-4" />
            <span>Itinerary Generated</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-12 max-w-4xl leading-[1.1]">
            {itinerary.summary.title}
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-primary-foreground/20 pt-10">
            <div data-testid="stat-distance">
              <div className="text-primary-foreground/70 text-sm font-medium mb-1.5 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Total Distance
              </div>
              <div className="text-4xl font-display font-bold">{itinerary.summary.totalDistance} <span className="text-xl font-medium opacity-70">km</span></div>
            </div>
            <div data-testid="stat-elevation">
              <div className="text-primary-foreground/70 text-sm font-medium mb-1.5 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Elevation
              </div>
              <div className="text-4xl font-display font-bold">{itinerary.summary.totalElevation} <span className="text-xl font-medium opacity-70">m</span></div>
            </div>
            <div data-testid="stat-duration">
              <div className="text-primary-foreground/70 text-sm font-medium mb-1.5 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Duration
              </div>
              <div className="text-4xl font-display font-bold">{trip.duration} <span className="text-xl font-medium opacity-70">Days</span></div>
            </div>
            <div data-testid="stat-difficulty">
              <div className="text-primary-foreground/70 text-sm font-medium mb-1.5 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Difficulty
              </div>
              <div className="text-3xl font-display font-bold mt-1.5">{itinerary.summary.difficulty}</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content Container */}
      <main className="flex-1 py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl space-y-24 md:space-y-32">

          {/* Route Map */}
          <motion.section variants={sectionVariants}>
            <SectionHeader
              title="Route Map"
              description="Your planned route with all waypoints. Click any marker to see details."
            />
            <RouteMap
              days={itinerary.days}
              startLocation={trip.startLocation}
              destination={trip.destination}
            />
          </motion.section>

          {/* Trip Summary */}
          <motion.section variants={sectionVariants}>
            <SectionHeader title="Trip Summary" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
              {[
                { icon: <MapPin className="w-5 h-5" />, label: "Start", value: trip.startLocation },
                { icon: <MapPin className="w-5 h-5" />, label: "Destination", value: trip.destination },
                { icon: <Calendar className="w-5 h-5" />, label: "Duration", value: `${trip.duration} days` },
                { icon: <User className="w-5 h-5" />, label: "Experience", value: trip.experienceLevel },
                { icon: <Bike className="w-5 h-5" />, label: "Total Distance", value: `${itinerary.summary.totalDistance} km` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-3 shadow-sm hover:border-primary/30 transition-colors" data-testid={`summary-${label.toLowerCase().replace(/\s+/g,'-')}`}>
                  <div className="text-primary">{icon}</div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                    <p className="text-base font-display font-bold text-foreground leading-snug">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Trip Overview */}
          <motion.section variants={sectionVariants}>
            <SectionHeader 
              title="Route Overview" 
              description={`This ${itinerary.summary.totalDistance}km expedition from ${trip.startLocation} to ${trip.destination} is carefully designed for ${trip.experienceLevel.toLowerCase()} riders. You'll navigate a curated mix of terrains, tackling ${itinerary.summary.totalElevation.toLocaleString()}m of vertical gain over ${trip.duration} days. Based on your preferences, we've optimised the route for ${trip.accommodation.toLowerCase()} with a daily budget of ${currencySymbol}${itinerary.budget.perDay}.`}
            />

            {/* Decorative Route Line */}
            <div className="my-10 relative h-32 md:h-40 w-full overflow-hidden rounded-3xl bg-muted/40 border border-border/50 flex items-center justify-between px-8 md:px-16">
              <div className="absolute inset-0 flex items-center px-12 md:px-24">
                <div className="w-full border-t-2 border-dashed border-primary/40"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center bg-muted/40 p-2 rounded-xl backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-md mb-2" />
                <span className="font-display font-bold text-sm bg-background/80 px-2 py-0.5 rounded-md border border-border/50">{trip.startLocation}</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center mt-8 bg-muted/40 p-2 rounded-xl backdrop-blur-sm">
                <div className="bg-background border-2 border-primary/30 p-2 rounded-full shadow-sm mb-2">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-background/80 px-2 py-0.5 rounded-md">{trip.experienceLevel}</span>
              </div>

              <div className="relative z-10 flex flex-col items-center bg-muted/40 p-2 rounded-xl backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-primary ring-4 ring-primary/20 flex items-center justify-center shadow-md mb-2">
                  <MapPin className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-sm bg-background/80 px-2 py-0.5 rounded-md border border-border/50">{trip.destination}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              {itinerary.summary.highlights.map((highlight, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium text-sm shadow-sm">
                  {highlight}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Day-by-Day Itinerary */}
          <motion.section variants={sectionVariants}>
            <SectionHeader 
              title="Day-by-Day Itinerary" 
              description="Your pacing and daily milestones."
            />
            
            <div className="relative pl-6 md:pl-10 ml-2 md:ml-4 border-l-2 border-primary/20 space-y-10 md:space-y-12 pb-4">
              {itinerary.days.map((day, i) => (
                <motion.div variants={sectionVariants} key={day.day} className="relative group">
                  <div className="absolute -left-[31px] md:-left-[47px] top-7 w-4 h-4 rounded-full bg-primary ring-4 ring-background group-hover:scale-125 transition-transform duration-300" />
                  <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm shadow-black/5 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                      <div>
                        <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-lg mb-3">
                          Day {day.day}
                        </div>
                        <h3 className="text-2xl font-display font-bold text-card-foreground">{day.title}</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm font-semibold text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{day.startTown}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                          <span>{day.endTown}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-sm font-medium text-muted-foreground bg-muted/50 p-3 rounded-2xl md:min-w-[max-content]">
                        <div className="flex items-center gap-1.5"><Bike className="w-4 h-4 text-primary"/> {day.distance} km</div>
                        <div className="w-px h-4 bg-border hidden sm:block"></div>
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary"/> {day.ridingTime}</div>
                        <div className="w-px h-4 bg-border hidden sm:block"></div>
                        <div className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-primary"/> {day.elevation} m</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5 bg-muted/30 rounded-xl px-4 py-2.5 border border-border/40">
                      <Tent className="w-4 h-4 text-primary/70 shrink-0" />
                      <span className="font-medium">Overnight:</span>
                      <span>{day.accommodation}</span>
                    </div>
                    
                    <p className="text-base text-foreground/80 mb-5 max-w-3xl leading-relaxed">{day.terrain}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {day.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-3 text-base text-foreground/90 font-medium">
                          <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-primary/5 p-4 rounded-2xl flex items-start gap-3 border border-primary/10">
                      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm font-medium italic text-primary/80 leading-relaxed">{day.notes}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Packing Checklist */}
          <motion.section variants={sectionVariants}>
            <SectionHeader 
              title="Packing Checklist" 
              description="Tailored for your environment and accommodation type."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {itinerary.packing.map((cat, i) => (
                <div key={i} className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm">
                  <h3 className="font-display font-bold text-xl mb-6 text-primary border-b border-border/50 pb-4">{cat.category}</h3>
                  <ul className="space-y-4">
                    {cat.items.map((item, j) => {
                      const isChecked = checkedItems[item.name] || false;
                      const elementId = `pack-${i}-${j}`;
                      return (
                        <li key={j} className="flex items-start gap-3 group">
                          <Checkbox 
                            id={elementId} 
                            checked={isChecked} 
                            onCheckedChange={() => toggleItem(item.name)}
                            className="mt-1"
                            data-testid={`checkbox-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                          />
                          <div className="flex flex-col gap-1">
                            <label 
                              htmlFor={elementId} 
                              className={cn(
                                "text-base cursor-pointer select-none transition-all duration-300 leading-snug",
                                isChecked ? "text-muted-foreground line-through decoration-muted-foreground/50 opacity-60" : "text-foreground group-hover:text-primary",
                                item.essential && !isChecked && "font-semibold"
                              )}
                            >
                              {item.name}
                            </label>
                            {item.essential && !isChecked && (
                              <span className="text-[10px] uppercase font-bold tracking-wider text-destructive self-start mt-0.5">Essential</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Estimated Budget */}
          <motion.section variants={sectionVariants}>
            <SectionHeader 
              title="Estimated Budget" 
              description="Financial projection based on your travel style."
            />
            <div className="bg-card rounded-[2rem] p-8 md:p-12 border border-border shadow-lg relative overflow-hidden">
              <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] pointer-events-none">
                <Wallet className="w-64 h-64 text-foreground" />
              </div>
              <div className="relative z-10 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between mb-12">
                  <div>
                    <h3 className="text-lg font-medium text-muted-foreground mb-3 uppercase tracking-wider text-sm">Total Estimated Cost</h3>
                    <div className="text-6xl md:text-7xl font-display font-bold tracking-tight text-foreground">{currencySymbol}{itinerary.budget.total}</div>
                  </div>
                  <div className="bg-primary/10 text-primary px-6 py-4 rounded-2xl flex flex-col items-center min-w-[160px]">
                    <div className="text-4xl font-bold font-display">{currencySymbol}{itinerary.budget.perDay}</div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-80 mt-2">Per Day</div>
                  </div>
                </div>
                
                <div className="h-6 w-full rounded-full flex overflow-hidden mb-3 bg-muted">
                  <div className="bg-chart-1 h-full transition-all duration-1000" style={{ width: `${(itinerary.budget.accommodation / itinerary.budget.perDay) * 100}%` }} title="Accommodation" />
                  <div className="bg-chart-2 h-full transition-all duration-1000" style={{ width: `${(itinerary.budget.food / itinerary.budget.perDay) * 100}%` }} title="Food" />
                  <div className="bg-chart-5 h-full transition-all duration-1000" style={{ width: `${(itinerary.budget.water / itinerary.budget.perDay) * 100}%` }} title="Water" />
                  <div className="bg-chart-3 h-full transition-all duration-1000" style={{ width: `${(itinerary.budget.miscellaneous / itinerary.budget.perDay) * 100}%` }} title="Misc" />
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground mb-10">
                  {["Accommodation","Food","Water & Drinks","Misc & Emergencies"].map((label, i) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className={cn("w-2.5 h-2.5 rounded-full", i===0?"bg-chart-1":i===1?"bg-chart-2":i===2?"bg-chart-5":"bg-chart-3")} />
                      {label}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                  {itinerary.budget.tiers.map((tier, i) => (
                    <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-muted/30 border border-border/50">
                      <div className={cn("w-3 h-3 rounded-full shadow-sm",
                        i === 0 ? "bg-chart-1" : i === 1 ? "bg-chart-2" : i === 2 ? "bg-chart-5" : "bg-chart-3"
                      )} />
                      <div className="text-2xl font-bold font-display">{currencySymbol}{tier.amount}</div>
                      <div className="text-xs font-medium text-muted-foreground">{tier.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Nutrition Guide */}
          <motion.section variants={sectionVariants}>
            <SectionHeader 
              title="Nutrition Tips" 
              description="Optimise your energy for long days in the saddle."
            />
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                 <div className="bg-primary text-primary-foreground p-6 rounded-3xl flex items-center gap-5 sm:w-1/2 shadow-md">
                   <div className="p-3 bg-primary-foreground/20 rounded-xl"><Flame className="w-8 h-8" /></div>
                   <div>
                     <div className="text-3xl font-display font-bold tracking-tight">{itinerary.nutrition.calorieTarget} <span className="text-lg font-normal opacity-80">kcal</span></div>
                     <div className="text-sm uppercase font-bold tracking-wider opacity-80 mt-1">Daily Target</div>
                   </div>
                 </div>
                 <div className="bg-chart-5 text-primary-foreground p-6 rounded-3xl flex items-center gap-5 sm:w-1/2 shadow-md">
                   <div className="p-3 bg-primary-foreground/20 rounded-xl"><Droplets className="w-8 h-8" /></div>
                   <div>
                     <div className="text-3xl font-display font-bold tracking-tight">{itinerary.nutrition.hydrationTarget} <span className="text-lg font-normal opacity-80">L</span></div>
                     <div className="text-sm uppercase font-bold tracking-wider opacity-80 mt-1">Daily Hydration</div>
                   </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itinerary.nutrition.mealPlan.map((meal, i) => (
                  <div key={i} className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
                      <h4 className="text-xl font-display font-bold">{meal.meal}</h4>
                      <span className="text-xs font-mono font-bold bg-muted px-3 py-1.5 rounded-lg text-muted-foreground">{meal.timing}</span>
                    </div>
                    <ul className="space-y-4">
                      {meal.suggestions.map((sug, j) => (
                        <li key={j} className="text-base text-foreground/80 flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary/40 shrink-0 mt-2" />
                          <span className="leading-snug">{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Safety Tips */}
          <motion.section variants={sectionVariants}>
            <SectionHeader 
              title="Safety & Preparation" 
              description="Critical advice tailored for your route and experience level."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {itinerary.safety.map((tip, i) => (
                <div key={i} className={cn(
                  "p-6 md:p-8 rounded-3xl border flex flex-col h-full shadow-sm hover:shadow-md transition-shadow",
                  tip.priority === "high" ? "bg-destructive/5 border-destructive/20" :
                  tip.priority === "medium" ? "bg-chart-4/10 border-chart-4/20" :
                  "bg-primary/5 border-primary/20"
                )}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={cn("p-2 rounded-xl", 
                      tip.priority === "high" ? "bg-destructive/20 text-destructive" : 
                      tip.priority === "medium" ? "bg-chart-4/20 text-chart-4" : 
                      "bg-primary/20 text-primary"
                    )}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <span className={cn("font-bold uppercase tracking-widest text-xs",
                      tip.priority === "high" ? "text-destructive" : 
                      tip.priority === "medium" ? "text-chart-4" : 
                      "text-primary"
                    )}>
                      {tip.priority} Priority
                    </span>
                  </div>
                  <h4 className="text-lg font-display font-bold mb-3">{tip.category}</h4>
                  <p className="text-base font-medium leading-relaxed opacity-90 text-foreground/80">{tip.tip}</p>
                </div>
              ))}
            </div>
          </motion.section>

        </div>
      </main>

      {/* Footer */}
      <motion.footer variants={sectionVariants} className="border-t border-border bg-card py-12 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-40">
            <Map className="w-6 h-6" />
            <span className="font-display font-bold text-xl">PedalPlan AI</span>
          </div>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            The ultimate planner for ambitious bikepackers. Go out and ride.
          </p>
          <p className="text-xs font-medium text-muted-foreground/50">
            &copy; {new Date().getFullYear()} PedalPlan AI. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </motion.div>
  );
}
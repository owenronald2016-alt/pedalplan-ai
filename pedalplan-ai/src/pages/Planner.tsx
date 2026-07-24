import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Map,
  MapPin,
  Calendar,
  Activity,
  Bike,
  Wallet,
  Tent,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const plannerSchema = z.object({
  startLocation: z.string().min(2, { message: "Start location is required." }),
  destination: z.string().min(2, { message: "Destination is required." }),
  duration: z.coerce
    .number()
    .min(1, { message: "Must be at least 1 day." })
    .max(365),
  experienceLevel: z.string({
    required_error: "Please select an experience level.",
  }),
  dailyDistance: z.string({
    required_error: "Please select a daily distance target.",
  }),
  budget: z.string({ required_error: "Please select a budget preference." }),
  accommodation: z.string({
    required_error: "Please select an accommodation preference.",
  }),
});

type PlannerFormValues = z.infer<typeof plannerSchema>;

export default function Planner() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      startLocation: "",
      destination: "",
      duration: 7,
    },
  });

  function onSubmit(data: PlannerFormValues) {
    setIsGenerating(true);

    localStorage.setItem("pedalplan-trip", JSON.stringify(data));

    navigate("/results");
  }

  return (
    <div className="min-h-[100dvh] bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:inline-block">
              PedalPlan AI
            </span>
          </div>
          <div className="w-[60px]" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
                Configure Your Expedition
              </h1>
              <p className="text-muted-foreground text-lg">
                Tell us where you want to go and how you like to ride. Our AI
                will build your perfect itinerary.
              </p>
            </div>

            <div className="bg-background rounded-2xl border border-border shadow-sm p-6 md:p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Section 1: Route */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-primary border-b border-border/50 pb-2">
                      <MapPin className="w-5 h-5" />
                      <h2 className="text-xl font-bold font-display">
                        Route Basics
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="startLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground/80">
                              Start Location
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Geneva, Switzerland"
                                className="h-12 bg-muted/50"
                                {...field}
                                data-testid="input-start-location"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground/80">
                              Destination
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Nice, France"
                                className="h-12 bg-muted/50"
                                {...field}
                                data-testid="input-destination"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem className="md:w-1/2 md:pr-3">
                          <FormLabel className="font-semibold text-foreground/80">
                            Trip Duration (Days)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                              <Input
                                type="number"
                                min={1}
                                className="h-12 bg-muted/50 pl-10"
                                {...field}
                                data-testid="input-duration"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Section 2: Athletic Profile */}
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2 text-primary border-b border-border/50 pb-2">
                      <Activity className="w-5 h-5" />
                      <h2 className="text-xl font-bold font-display">
                        Athletic Profile
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground/80">
                              Experience Level
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className="h-12 bg-muted/50"
                                  data-testid="select-experience"
                                >
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Beginner">
                                  Beginner
                                </SelectItem>
                                <SelectItem value="Intermediate">
                                  Intermediate
                                </SelectItem>
                                <SelectItem value="Advanced">
                                  Advanced
                                </SelectItem>
                                <SelectItem value="Expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Affects pacing and terrain difficulty.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dailyDistance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground/80">
                              Target Daily Distance
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className="h-12 bg-muted/50 flex gap-2"
                                  data-testid="select-distance"
                                >
                                  <Bike className="w-4 h-4 text-muted-foreground shrink-0" />
                                  <SelectValue placeholder="Select distance" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="<50km">
                                  Under 50km (Leisurely)
                                </SelectItem>
                                <SelectItem value="50–80km">
                                  50–80km (Moderate)
                                </SelectItem>
                                <SelectItem value="80–120km">
                                  80–120km (Challenging)
                                </SelectItem>
                                <SelectItem value="120km+">
                                  120km+ (Epic)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Section 3: Logistics */}
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2 text-primary border-b border-border/50 pb-2">
                      <Tent className="w-5 h-5" />
                      <h2 className="text-xl font-bold font-display">
                        Logistics & Comfort
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="accommodation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground/80">
                              Accommodation Style
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className="h-12 bg-muted/50"
                                  data-testid="select-accommodation"
                                >
                                  <SelectValue placeholder="Select preference" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Wild camping">
                                  Wild camping
                                </SelectItem>
                                <SelectItem value="Hostels">
                                  Hostels / Campsites
                                </SelectItem>
                                <SelectItem value="B&Bs">
                                  B&Bs / Hotels
                                </SelectItem>
                                <SelectItem value="Mix of all">
                                  Mix of all
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground/80">
                              Overall Budget
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className="h-12 bg-muted/50 flex gap-2"
                                  data-testid="select-budget"
                                >
                                  <Wallet className="w-4 h-4 text-muted-foreground shrink-0" />
                                  <SelectValue placeholder="Select budget" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Budget">
                                  Budget (Shoestring)
                                </SelectItem>
                                <SelectItem value="Mid-range">
                                  Mid-range
                                </SelectItem>
                                <SelectItem value="Comfortable">
                                  Comfortable
                                </SelectItem>
                                <SelectItem value="Luxury">
                                  Luxury (Credit card touring)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto min-w-[200px]"
                      disabled={isGenerating}
                      data-testid="button-submit-plan"
                    >
                      {isGenerating
                        ? "Analyzing Topography..."
                        : "Generate Adventure"}
                      {!isGenerating && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dumbbell, Bot, User, HeartPulse, RefreshCw, Youtube, Link as LinkIcon } from "lucide-react";
import Link from 'next/link';
import { marked } from "marked";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

import { createFitnessPlan } from "./actions";
import type { GenerateFitnessPlanOutput } from "@/ai/flows/generate-fitness-plan";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().positive({ message: "Please enter a valid age." }),
  weight: z.coerce.number().positive({ message: "Please enter a valid weight in kg." }),
  height: z.coerce.number().positive({ message: "Please enter a valid height in cm." }),
  fitnessGoals: z.string().min(10, {
    message: "Please describe your fitness goals in at least 10 characters.",
  }),
  exercisePreference: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DashboardPage() {
  const [isPending, startTransition] = useTransition();
  const [plan, setPlan] = useState<GenerateFitnessPlanOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined,
      weight: undefined,
      height: undefined,
      fitnessGoals: "",
      exercisePreference: "",
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      setPlan(null);
      const result = await createFitnessPlan(values);
      
      if (result.success && result.plan) {
        setPlan(result.plan);
        toast({
          title: "Success!",
          description: "Your new fitness plan has been generated and saved.",
        });
      } else {
        // This handles all failure cases, including validation, AI, and database errors.
        const errorDescription = result.issues
          ? result.issues.map(i => i.message).join(" \n")
          : result.error || "An unexpected error occurred.";
        
        toast({
          variant: "destructive",
          title: "Operation Failed",
          description: errorDescription,
        });

        // If the plan was generated but failed to save, still display it
        if (result.plan) {
          setPlan(result.plan);
        }
      }
    });
  }

  const PlanSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="pt-4 space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="pt-4 space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="sticky top-20">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Your Details</CardTitle>
            </div>
            <CardDescription>
              Provide your information so our AI can create the perfect plan for
              you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="25" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                           <Input type="number" placeholder="70" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                           <Input type="number" placeholder="175" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="fitnessGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fitness Goals</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Lose 10kg in 3 months, build muscle for a toned look, run a 5k."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="exercisePreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Preferences (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Home workouts, gym, running, yoga"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Dumbbell className="mr-2 h-4 w-4" />
                      Generate My Plan
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="min-h-[60vh] animate-fade-in">
          <CardHeader>
             <div className="flex items-center gap-2 mb-2">
              <Bot className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Your AI Fitness Plan</CardTitle>
            </div>
            <CardDescription>
              This is your personalized roadmap to success. Stick with it!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <PlanSkeleton />
            ) : plan ? (
              <div className="prose prose-invert prose-sm md:prose-base max-w-none font-sans">
                <div dangerouslySetInnerHTML={{ __html: marked(plan.fitnessPlan) }} />

                {plan.youtubeLinks && plan.youtubeLinks.length > 0 && (
                  <div className="mt-8">
                    <h3 className="flex items-center gap-2 text-xl font-semibold not-prose text-primary mb-4">
                      <Youtube />
                      Helpful Videos
                    </h3>
                    <ul className="not-prose space-y-3">
                      {plan.youtubeLinks.map((link, index) => (
                        <li key={index} className="flex items-start gap-3">
                           <LinkIcon className="w-4 h-4 mt-1 shrink-0 text-primary" />
                          <Link href={link.url} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
                              {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[40vh]">
                <HeartPulse className="w-16 h-16 mb-4" />
                <h3 className="text-lg font-semibold">Your plan is waiting</h3>
                <p>Fill out your details and let our AI do the rest.</p>
              </div>
            )}
          </CardContent>
          {plan && !isPending && (
            <CardFooter>
              <Button onClick={form.handleSubmit(onSubmit)} className="w-full" disabled={isPending}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Plan
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, HeartPulse, BrainCircuit, Target, Dumbbell, Utensils, BarChart } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-primary" />,
      title: "AI-Powered Plans",
      description: "Get a fitness plan tailored to your body and goals, powered by Gemini AI."
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Goal-Oriented",
      description: "Whether you want to lose weight, gain muscle, or just stay fit, we've got you covered."
    },
    {
      icon: <HeartPulse className="w-8 h-8 text-primary" />,
      title: "Personalized For You",
      description: "Your plan adapts to your age, weight, height, and exercise preferences."
    },
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snap = await getDocs(collection(db, 'bookings'));
        snap.forEach(doc => console.log(doc.data()));
      } catch (error) {
        console.error("Error fetching bookings:", error)
      }
    };
    fetchBookings();
  }, []);


  return (
    <div className="flex flex-col items-center bg-background">
      <section className="relative w-full py-20 md:py-32 lg:py-40 border-b">
        <Image
          src="/image.png"
          alt="Fitness background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 opacity-20"
          data-ai-hint="wwe superstar"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
        <div className="container relative mx-auto px-4 md:px-6 text-center z-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary">
              Forge Your Path to Fitness with AI
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              Stop guessing, start training. Pavan's Muscle Den AI creates personalized workout and nutrition plans to help you achieve your goals faster.
            </p>
            <Button asChild size="lg" className="mt-8 text-lg">
              <Link href="#how-it-works">Get Your Free Plan Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2">A simple, three-step process to a new you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4 border border-primary/20">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tell Us About You</h3>
              <p className="text-muted-foreground">Fill out a simple form with your physical stats and fitness goals.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4 border border-primary/20">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Does The Hard Work</h3>
              <p className="text-muted-foreground">Our advanced AI analyzes your data to create a unique fitness plan.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4 border border-primary/20">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
              <p className="text-muted-foreground">Receive your detailed plan and take the first step towards a healthier lifestyle.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-16 md:py-24 bg-card border-y">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-1 gap-12 items-center">
          <div className="text-center">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">What's in Your Plan?</h2>
             <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">Your AI-generated fitness plan is comprehensive and covers all aspects of your new healthy lifestyle.</p>
             <ul className="space-y-4 inline-flex flex-col items-start">
                <li className="flex items-center gap-3">
                    <Dumbbell className="w-6 h-6 text-primary" />
                    <span className="font-medium">Customized Workout Routines</span>
                </li>
                <li className="flex items-center gap-3">
                    <Utensils className="w-6 h-6 text-primary" />
                    <span className="font-medium">Personalized Dietary Suggestions</span>
                </li>
                 <li className="flex items-center gap-3">
                    <BarChart className="w-6 h-6 text-primary" />
                    <span className="font-medium">Progress Tracking Recommendations</span>
                </li>
             </ul>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
           <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Features Designed For Success</h2>
            <p className="text-muted-foreground mt-2">Everything you need to reach your peak.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center p-6">
                 <div className="bg-primary/10 p-4 rounded-full mb-4 border border-primary/20">
                    {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Transform Your Body?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Your personalized fitness journey is just a click away. Let's build a stronger, healthier you, together.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/login">I'm Ready, Let's Go!</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

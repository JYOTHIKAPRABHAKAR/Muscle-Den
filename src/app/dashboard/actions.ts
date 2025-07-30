"use server";

import { z } from "zod";
import {
  generateFitnessPlan,
  GenerateFitnessPlanInput,
  GenerateFitnessPlanOutput,
} from "@/ai/flows/generate-fitness-plan";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";

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

export async function createFitnessPlan(data: z.infer<typeof formSchema>): Promise<{ success: boolean, plan?: GenerateFitnessPlanOutput, error?: string, issues?: z.ZodIssue[] }> {
  const validatedFields = formSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid form data. Please check your inputs.",
      issues: validatedFields.error.issues,
    };
  }

  let planResult: GenerateFitnessPlanOutput;
  try {
    const result = await generateFitnessPlan(
      validatedFields.data as GenerateFitnessPlanInput
    );
    if (!result || !result.fitnessPlan) {
      return {
        success: false,
        error: "The AI failed to generate a plan. Please try again with different details.",
      };
    }
    planResult = result;
  } catch (error) {
    console.error("Error generating plan with AI:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during AI plan generation.";
    return {
      success: false,
      error: `AI Error: ${errorMessage}`,
    };
  }
    
  try {
    await addDoc(collection(db, "fitness_plans"), {
      ...validatedFields.data,
      fitnessPlan: planResult.fitnessPlan,
      youtubeLinks: planResult.youtubeLinks || [],
      createdAt: serverTimestamp(),
    });
  } catch (dbError) {
    console.error("Error saving plan to Firestore:", dbError);
    const dbErrorMessage = dbError instanceof Error ? dbError.message : "An unknown database error occurred.";
    // Return the AI plan but also an error message about the database failure.
    // The client can then decide how to handle this (e.g., show the plan but warn it's not saved).
    return { 
      success: false, // Mark as not fully successful
      plan: planResult, 
      error: `Plan generated, but failed to save: ${dbErrorMessage}. Check your Firestore rules.`
    };
  }

  return { success: true, plan: planResult };
}


export async function getFitnessPlanHistory() {
  try {
    const plansCollection = collection(db, "fitness_plans");
    const q = query(plansCollection, orderBy("createdAt", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    const plans = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure createdAt field exists and is a timestamp before converting
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
      return {
        id: doc.id,
        name: data.name,
        createdAt: createdAt,
        fitnessGoals: data.fitnessGoals,
      };
    });
    return { success: true, plans };
  } catch (error) {
    console.error("Error fetching fitness plan history:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while fetching history.";
    return { success: false, error: errorMessage, plans: [] };
  }
}

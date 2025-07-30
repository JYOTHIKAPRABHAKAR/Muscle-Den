'use server';

/**
 * @fileOverview A fitness plan generator AI agent.
 *
 * - generateFitnessPlan - A function that handles the fitness plan generation process.
 * - GenerateFitnessPlanInput - The input type for the generateFitnessPlan function.
 * - GenerateFitnessPlanOutput - The return type for the generateFitnessPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFitnessPlanInputSchema = z.object({
  name: z.string().describe("The user's name."),
  age: z.number().describe("The user's age in years."),
  weight: z.number().describe("The user's weight in kilograms."),
  height: z.number().describe("The user's height in centimeters."),
  fitnessGoals: z
    .string()
    .describe(
      "The user's fitness goals, e.g., weight loss, muscle gain, general fitness."
    ),
  exercisePreference: z.string().optional().describe("The user's preferred types of exercise"),
});
export type GenerateFitnessPlanInput = z.infer<typeof GenerateFitnessPlanInputSchema>;

const GenerateFitnessPlanOutputSchema = z.object({
  fitnessPlan: z.string().describe('A personalized fitness plan for the user, formatted in Markdown.'),
  youtubeLinks: z.array(z.object({
    title: z.string().describe('The title of the YouTube video.'),
    url: z.string().url().describe('The URL of the YouTube video.'),
  })).optional().describe('A list of 3-5 relevant YouTube videos for dietary suggestions, like recipes or meal prep guides.'),
});
export type GenerateFitnessPlanOutput = z.infer<typeof GenerateFitnessPlanOutputSchema>;

export async function generateFitnessPlan(
  input: GenerateFitnessPlanInput
): Promise<GenerateFitnessPlanOutput> {
  return generateFitnessPlanFlow(input);
}

const generateFitnessPlanFlow = ai.defineFlow(
  {
    name: 'generateFitnessPlanFlow',
    inputSchema: GenerateFitnessPlanInputSchema,
    outputSchema: GenerateFitnessPlanOutputSchema,
  },
  async (input) => {
    // Manually construct the prompt
    const prompt = `You are a personal fitness trainer. Your task is to generate a personalized fitness plan and find relevant YouTube videos based on the user's details.

First, create a detailed and personalized fitness plan for the following user:
Name: ${input.name}
Age: ${input.age}
Weight: ${input.weight} kg
Height: ${input.height} cm
Fitness Goals: ${input.fitnessGoals}
${input.exercisePreference ? `Exercise Preference: ${input.exercisePreference}` : ''}

The 'fitnessPlan' must be a complete, well-structured document formatted in Markdown. Use headings, bold text, and lists to detail workout routines, frequency, duration, and dietary suggestions. The plan must be realistic and sustainable.

Second, after creating the plan, find 3 to 5 relevant YouTube videos that could help the user with their diet (e.g., healthy recipes, meal prep ideas that align with the dietary suggestions). For each video, provide its title and a valid URL.

Finally, you MUST return a single, valid JSON object with the following structure:
{
  "fitnessPlan": "your markdown plan here...",
  "youtubeLinks": [
    { "title": "Video Title 1", "url": "https://youtube.com/watch?v=..." },
    { "title": "Video Title 2", "url": "https://youtube.com/watch?v=..." }
  ]
}

Do not include any text or formatting outside of this JSON object.
`;

    const response = await ai.generate({
        prompt: prompt,
        config: {
            // Lower temperature for more predictable, structured output
            temperature: 0.2, 
        },
    });

    const text = response.text;

    try {
      // Clean the text to ensure it's valid JSON
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedOutput = JSON.parse(cleanedText);
      
      // Validate the parsed output against our Zod schema
      const validationResult = GenerateFitnessPlanOutputSchema.safeParse(parsedOutput);

      if (!validationResult.success) {
        console.error("AI output validation failed:", validationResult.error);
        throw new Error("AI returned data in an unexpected format.");
      }
      
      return validationResult.data;
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      console.error("Raw AI response:", text);
      throw new Error('AI failed to generate a valid plan. The response was not valid JSON.');
    }
  }
);

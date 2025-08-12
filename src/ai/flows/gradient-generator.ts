// src/ai/flows/gradient-generator.ts
'use server';

/**
 * @fileOverview Generates a deterministic gradient based on a given title.
 *
 * - generateGradient - A function that generates a gradient.
 * - GenerateGradientInput - The input type for the generateGradient function.
 * - GenerateGradientOutput - The return type for the generateGradient function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGradientInputSchema = z.object({
  title: z.string().describe('The title to generate a gradient for.'),
});
export type GenerateGradientInput = z.infer<typeof GenerateGradientInputSchema>;

const GenerateGradientOutputSchema = z.object({
  gradient:
    z.string()
      .describe(
        'A CSS gradient string generated based on the title. Example: linear-gradient(to right, #ff0000, #0000ff)'
      ),
});
export type GenerateGradientOutput = z.infer<typeof GenerateGradientOutputSchema>;

export async function generateGradient(input: GenerateGradientInput): Promise<GenerateGradientOutput> {
  return generateGradientFlow(input);
}

const generateGradientPrompt = ai.definePrompt({
  name: 'generateGradientPrompt',
  input: {schema: GenerateGradientInputSchema},
  output: {schema: GenerateGradientOutputSchema},
  prompt: `You are a gradient generator. You will generate a CSS gradient string based on the given title.\n\nThe gradient should be a linear gradient with two colors.\nThe colors should be chosen based on the letters in the title.\n\nFor example, if the title is \"Hello World\", the gradient might be \"linear-gradient(to right, #ff0000, #0000ff)\".\n\nTitle: {{{title}}}`,
});

const generateGradientFlow = ai.defineFlow(
  {
    name: 'generateGradientFlow',
    inputSchema: GenerateGradientInputSchema,
    outputSchema: GenerateGradientOutputSchema,
  },
  async input => {
    const {output} = await generateGradientPrompt(input);
    return output!;
  }
);

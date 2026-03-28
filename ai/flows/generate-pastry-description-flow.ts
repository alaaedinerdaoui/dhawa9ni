'use server';
/**
 * @fileOverview A Genkit flow for generating compelling and appetizing product descriptions for traditional Tunisian pastries.
 *
 * - generatePastryDescription - A function that handles the pastry description generation process.
 * - GeneratePastryDescriptionInput - The input type for the generatePastryDescription function.
 * - GeneratePastryDescriptionOutput - The return type for the generatePastryDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePastryDescriptionInputSchema = z.object({
  pastryName: z.string().describe('The name of the Tunisian pastry.'),
  keywords: z.array(z.string()).optional().describe('Optional keywords to include in the description (e.g., "nutty", "honey-soaked", "delicate").'),
  length: z.enum(['short', 'medium', 'long']).optional().describe('Desired length of the description (short, medium, or long). Defaults to medium.'),
});
export type GeneratePastryDescriptionInput = z.infer<typeof GeneratePastryDescriptionInputSchema>;

const GeneratePastryDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated appetizing product description for the pastry.'),
});
export type GeneratePastryDescriptionOutput = z.infer<typeof GeneratePastryDescriptionOutputSchema>;

export async function generatePastryDescription(input: GeneratePastryDescriptionInput): Promise<GeneratePastryDescriptionOutput> {
  return generatePastryDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePastryDescriptionPrompt',
  input: {schema: GeneratePastryDescriptionInputSchema},
  output: {schema: GeneratePastryDescriptionOutputSchema},
  prompt: `You are an expert marketing copywriter for dhawa9ni.tn, a brand specializing in traditional Tunisian sweets. Your task is to generate a compelling and appetizing product description for a pastry.

Pastry Name: {{{pastryName}}}
{{#if keywords}}Keywords to include: {{#each keywords}}- {{{this}}}
{{/each}}{{/if}}
{{#if length}}Desired Length: {{{length}}} (If not specified, aim for a medium length.){{/if}}

Craft a description that evokes tradition, quality, and deliciousness, encouraging customers to try this exquisite treat. Highlight key flavors, textures, and the artisanal quality.`,
});

const generatePastryDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePastryDescriptionFlow',
    inputSchema: GeneratePastryDescriptionInputSchema,
    outputSchema: GeneratePastryDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

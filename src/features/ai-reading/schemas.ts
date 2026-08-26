import { z } from 'zod';

export const AI_READING_VERSION = 'tarot-reading-v1' as const;

const DrawCardInputSchema = z.object({
  cardId: z.string().min(1).max(40),
  position: z.number().int().min(0).max(9),
  isReversed: z.boolean(),
}).strict();

export const AiReadingRequestSchema = z.object({
  drawId: z.string().min(1).max(80),
  question: z.string().trim().min(1).max(240),
  spreadId: z.string().min(1).max(40),
  cards: z.array(DrawCardInputSchema).min(1).max(10),
}).strict();

const AiCardReadingSchema = z.object({
  position: z.number().int().min(0).max(9),
  title: z.string().min(1).max(50),
  interpretation: z.string().min(1).max(600),
}).strict();

export const AiReadingContentSchema = z.object({
  coreMessage: z.string().min(1).max(500),
  cardReadings: z.array(AiCardReadingSchema).min(1).max(10),
  synthesis: z.string().min(1).max(900),
  guidance: z.array(z.string().min(1).max(220)).min(2).max(3),
  reflectionQuestion: z.string().min(1).max(240),
  disclaimer: z.string().min(1).max(180),
}).strict();

export const AiReadingSchema = AiReadingContentSchema.extend({
  promptVersion: z.literal(AI_READING_VERSION),
  generatedAt: z.iso.datetime(),
});

const AiReadingSuccessSchema = z.object({
  ok: z.literal(true),
  reading: AiReadingSchema,
}).strict();

const AiReadingErrorSchema = z.object({
  ok: z.literal(false),
  code: z.string(),
  message: z.string(),
}).strict();

export const AiReadingApiResponseSchema = z.discriminatedUnion('ok', [
  AiReadingSuccessSchema,
  AiReadingErrorSchema,
]);

export type AiReadingRequest = z.infer<typeof AiReadingRequestSchema>;
export type AiReadingContent = z.infer<typeof AiReadingContentSchema>;
export type AiReading = z.infer<typeof AiReadingSchema>;
export type AiReadingApiResponse = z.infer<typeof AiReadingApiResponseSchema>;

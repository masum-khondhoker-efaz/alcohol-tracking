import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required'),
    count : z.number().int().min(1, 'Count is required'),
  }),
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    body: z.string().min(1, 'Body is required').optional(),
    count : z.number().int().min(1, 'Count is required').optional(),
  }),
});

export const challengeValidation = {
  createSchema,
  updateSchema,
};

import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Name is required'),
    body: z.string().optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    body: z.string().optional(),
  }),
});

export const blogValidation = {
  createSchema,
  updateSchema,
};

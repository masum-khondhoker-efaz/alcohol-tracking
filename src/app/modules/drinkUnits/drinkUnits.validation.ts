import { date, z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    alcoholPercentage: z.number(),
    container_type: z.string(),
    size: z.number(),
    units: z.number(),
    date: z.string(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    alcoholPercentage: z.number().optional(),
    container_type: z.string().optional(),
    size: z.number().optional(),
    units: z.number().optional(),
    date: z.string().optional(),
  }),
});

export const drinkUnitsValidation = {
createSchema,
updateSchema,
};
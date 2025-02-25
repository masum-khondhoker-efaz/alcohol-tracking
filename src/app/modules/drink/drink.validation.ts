import { date, z } from 'zod';

const createSchema = z.object({
  body: z.object({
    dayType: z.enum(['NORMAL_DAY', 'DRY_DAY', 'ALCOHOL_DAY']),
    date: z.string(), 
  }),
});

const updateSchema = z.object({
  body: z.object({
    dayType: z.enum(['NORMAL_DAY', 'DRY_DAY', 'ALCOHOL_DAY']),
    date: z.string(),
  }),
});

export const drinkValidation = {
createSchema,
updateSchema,
};
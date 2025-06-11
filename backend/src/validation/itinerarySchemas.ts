import { z } from "zod";

const baseSchema = {
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
};

export const createItineraryRequestSchema = z.object(baseSchema);

export const createItinerarySchema = z.object({
  ...baseSchema,
  userId: z.string().uuid(),
});

export const updateItinerarySchema = z.object(baseSchema).partial();

export const itineraryQuerySchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "La date de fin doit être après la date de début",
      path: ["endDate"],
    }
  );

export type CreateItineraryDto = z.infer<typeof createItinerarySchema>;
export type UpdateItineraryDto = z.infer<typeof updateItinerarySchema>;
export type ItineraryQueryDto = z.infer<typeof itineraryQuerySchema>;

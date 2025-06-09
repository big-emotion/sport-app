import { z } from "zod";

export const createFavoriteSchema = z.object({
  sportPlaceId: z.string().uuid("ID de lieu sportif invalide"),
});

export type CreateFavoriteDto = z.infer<typeof createFavoriteSchema>;

import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const uploadMediaSchema = z.object({
  file: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      "Le fichier ne doit pas dépasser 5MB"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimetype),
      "Seuls les formats .jpg, .jpeg, .png et .webp sont acceptés"
    ),
  sportPlaceId: z.string().uuid("ID de lieu sportif invalide").optional(),
});

export const mediaQuerySchema = z.object({
  sportPlaceId: z.string().uuid("ID de lieu sportif invalide").optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export type UploadMediaDto = z.infer<typeof uploadMediaSchema>;
export type MediaQueryDto = z.infer<typeof mediaQuerySchema>;

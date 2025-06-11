import { z } from "zod";

export const createForumPostSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(200, "Le titre ne peut pas dépasser 200 caractères"),
  content: z
    .string()
    .min(10, "Le contenu doit contenir au moins 10 caractères")
    .max(5000, "Le contenu ne peut pas dépasser 5000 caractères"),
  sportPlaceId: z.string().uuid("ID de lieu sportif invalide").optional(),
});

export const updateForumPostSchema = createForumPostSchema.partial();

export const createForumReplySchema = z.object({
  content: z
    .string()
    .min(1, "Le contenu ne peut pas être vide")
    .max(1000, "Le contenu ne peut pas dépasser 1000 caractères"),
  postId: z.string().uuid("ID de post invalide"),
});

export const updateForumReplySchema = z.object({
  content: z
    .string()
    .min(1, "Le contenu ne peut pas être vide")
    .max(1000, "Le contenu ne peut pas dépasser 1000 caractères"),
});

export type CreateForumPostDto = z.infer<typeof createForumPostSchema>;
export type UpdateForumPostDto = z.infer<typeof updateForumPostSchema>;
export type CreateForumReplyDto = z.infer<typeof createForumReplySchema>;
export type UpdateForumReplyDto = z.infer<typeof updateForumReplySchema>;

export const forumPostQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  sportPlaceId: z.string().uuid().optional(),
});

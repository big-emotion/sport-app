import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(1000, "Le message ne peut pas dépasser 1000 caractères"),
  userId: z.string().uuid("ID utilisateur invalide"),
});

export const updateNotificationSchema = z.object({
  isRead: z.boolean(),
  readAt: z.coerce.date().optional(),
});

export const notificationQuerySchema = z.object({
  isRead: z.boolean().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationDto = z.infer<typeof updateNotificationSchema>;
export type NotificationQueryDto = z.infer<typeof notificationQuerySchema>;

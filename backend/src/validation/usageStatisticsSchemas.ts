import { z } from "zod";

export const actionTypes = [
  "view_sport_place",
  "create_sport_place",
  "update_sport_place",
  "delete_sport_place",
  "create_event",
  "update_event",
  "delete_event",
  "create_review",
  "update_review",
  "delete_review",
  "create_forum_post",
  "create_forum_reply",
  "add_favorite",
  "remove_favorite",
  "create_itinerary",
  "update_itinerary",
  "delete_itinerary",
] as const;

export const logActionSchema = z.object({
  action: z.enum(actionTypes),
  metadata: z.record(z.unknown()).optional(),
});

export type LogActionDto = z.infer<typeof logActionSchema>;

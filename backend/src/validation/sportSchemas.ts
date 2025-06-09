import { z } from "zod";

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

const openingHoursSchema = z
  .object({
    monday: z
      .object({
        open: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
        close: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
      })
      .optional(),
    tuesday: z
      .object({
        open: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
        close: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
      })
      .optional(),
    wednesday: z
      .object({
        open: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
        close: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
      })
      .optional(),
    thursday: z
      .object({
        open: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
        close: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
      })
      .optional(),
    friday: z
      .object({
        open: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
        close: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
      })
      .optional(),
    saturday: z
      .object({
        open: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
        close: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
      })
      .optional(),
    sunday: z
      .object({
        open: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
        close: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
      })
      .optional(),
  })
  .optional();

export const createSportSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  iconUrl: z.string().url("Invalid URL format").optional(),
});

export const updateSportSchema = z.object({
  name: z.string().min(1, "Name is required").max(255).optional(),
  description: z.string().optional(),
  iconUrl: z.string().url("Invalid URL format").optional(),
});

export const createSportPlaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  openingHours: openingHoursSchema,
  sportIds: z
    .array(z.string().uuid("Invalid sport ID"))
    .min(1, "At least one sport is required"),
});

export const updateSportPlaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255).optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  openingHours: openingHoursSchema,
  sportIds: z
    .array(z.string().uuid("Invalid sport ID"))
    .min(1, "At least one sport is required")
    .optional(),
});

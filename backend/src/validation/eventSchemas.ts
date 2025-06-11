import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  eventDate: z.string().datetime('Invalid date format').transform(str => new Date(str)),
  sportPlaceId: z.string().uuid('Invalid sport place ID')
});

export const updateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255).optional(),
  description: z.string().min(1, 'Description is required').optional(),
  eventDate: z.string().datetime('Invalid date format').transform(str => new Date(str)).optional(),
  sportPlaceId: z.string().uuid('Invalid sport place ID').optional()
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().optional(),
  sportPlaceId: z.string().uuid('Invalid sport place ID')
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5').optional(),
  comment: z.string().optional()
});
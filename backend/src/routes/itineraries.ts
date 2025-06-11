import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { ItineraryService } from "../services/ItineraryService";
import { validateRequest } from "../middleware/validate";
import { authenticateToken } from "../middleware/auth";
import {
  updateItinerarySchema,
  createItineraryRequestSchema,
} from "../validation/itinerarySchemas";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";

const router = Router();
const prisma = new PrismaClient();
const itineraryService = new ItineraryService(prisma);

// Get user's itineraries
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }
    const itineraries = await itineraryService.findUserItineraries(req.user.id);
    res.json(itineraries);
  } catch (error) {
    next(error);
  }
});

// Get a specific itinerary
router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }
    const itinerary = await itineraryService.findById(
      req.params.id,
      req.user.id
    );
    res.json(itinerary);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      res
        .status(error instanceof NotFoundError ? 404 : 403)
        .json({ message: error.message });
      return;
    }
    next(error);
  }
});

// Create a new itinerary
router.post(
  "/",
  authenticateToken,
  validateRequest(createItineraryRequestSchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }
      const itinerary = await itineraryService.create(req.body, req.user.id);
      res.status(201).json(itinerary);
    } catch (error) {
      next(error);
    }
  }
);

// Update an itinerary
router.put(
  "/:id",
  authenticateToken,
  validateRequest(updateItinerarySchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }
      const itinerary = await itineraryService.update(
        req.params.id,
        req.body,
        req.user.id
      );
      res.json(itinerary);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) {
        res
          .status(error instanceof NotFoundError ? 404 : 403)
          .json({ message: error.message });
        return;
      }
      next(error);
    }
  }
);

// Delete an itinerary
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }
    await itineraryService.delete(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      res
        .status(error instanceof NotFoundError ? 404 : 403)
        .json({ message: error.message });
      return;
    }
    next(error);
  }
});

export default router;

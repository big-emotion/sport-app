import { Router } from "express";
import { FavoriteService } from "../services/FavoriteService";
import { authenticateToken } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { z } from "zod";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

const router = Router();
const favoriteService = new FavoriteService();

// Validation schema
const favoriteCreateSchema = z.object({
  sportPlaceId: z.string().uuid("Invalid sport place ID"),
});

// Get user's favorites (authenticated)
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }
    const favorites = await favoriteService.findByUser(req.user.id);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
});

// Add a favorite (authenticated)
router.post(
  "/",
  authenticateToken,
  validateRequest(favoriteCreateSchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }
      const favorite = await favoriteService.create({
        sportPlaceId: req.body.sportPlaceId,
        userId: req.user.id,
      });
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  }
);

// Delete a favorite (authenticated, owner only)
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }
    await favoriteService.delete(req.params.id, req.user.id);
    res.status(204).end();
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
      res
        .status(error instanceof NotFoundError ? 404 : 403)
        .json({ message: error.message });
      return;
    }
    next(error);
  }
});

export default router;

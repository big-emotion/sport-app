import { Router, Request, Response } from "express";
import { ReviewService } from "../services/ReviewService";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validation";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validation/eventSchemas";
import {
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} from "../utils/errors";

const router = Router();
const reviewService = new ReviewService();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await reviewService.getAll({
      page: parseInt(req.query.page as string) || undefined,
      limit: parseInt(req.query.limit as string) || undefined,
      sportPlaceId: (req.query.sportPlaceId as string) || undefined,
    });
    res.json(reviews);
  } catch (_error: unknown) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/my-reviews",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      const reviews = await reviewService.getByUser(req.user.id);
      res.json(reviews);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        res.status(401).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/sport-place/:sportPlaceId/average",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { sportPlaceId } = req.params;
      const average = await reviewService.getAverageRating(sportPlaceId);
      res.json(average);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await reviewService.getById(req.params.id);
    if (!review) {
      throw new NotFoundError("Review not found");
    }
    res.json(review);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/",
  authenticateToken,
  validate(createReviewSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      const data = {
        ...req.body,
        userId: req.user.id,
      };

      const review = await reviewService.create(data);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        res.status(401).json({ error: error.message });
        return;
      }
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  validate(updateReviewSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      const review = await reviewService.update(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json(review);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        res.status(401).json({ error: error.message });
        return;
      }
      if (error instanceof ForbiddenError) {
        res.status(403).json({ error: error.message });
        return;
      }
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      await reviewService.delete(req.params.id, req.user.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        res.status(401).json({ error: error.message });
        return;
      }
      if (error instanceof ForbiddenError) {
        res.status(403).json({ error: error.message });
        return;
      }
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

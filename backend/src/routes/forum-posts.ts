import { Router } from "express";
import { ForumPostService } from "../services/ForumPostService";
import { forumPostQuerySchema } from "../validation/forumSchemas";
import { authenticateToken } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

const router = Router();
const forumPostService = new ForumPostService();

// Get all forum posts (public)
router.get("/", async (req, res, next) => {
  try {
    const query = await forumPostQuerySchema.parseAsync(req.query);
    const result = await forumPostService.findAll(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get a single forum post (public)
router.get("/:id", async (req, res, next) => {
  try {
    const post = await forumPostService.findById(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// Create a forum post (authenticated)
router.post(
  "/",
  authenticateToken,
  validateRequest(forumPostQuerySchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }
      const post = await forumPostService.create({
        ...req.body,
        userId: req.user.id,
      });
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

// Update a forum post (authenticated, owner only)
router.put(
  "/:id",
  authenticateToken,
  validateRequest(forumPostQuerySchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }
      const post = await forumPostService.update(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json(post);
    } catch (error) {
      if (
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        res
          .status(error instanceof NotFoundError ? 404 : 403)
          .json({ message: error.message });
        return;
      }
      next(error);
    }
  }
);

// Delete a forum post (authenticated, owner only)
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }
    await forumPostService.delete(req.params.id, req.user.id);
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

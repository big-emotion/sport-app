import { Router } from "express";
import { ForumReplyService } from "../services/ForumReplyService";
import { authenticateToken } from "../middleware/auth";
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../utils/errors";
import { z } from "zod";

const router = Router();
const replyService = new ForumReplyService();

// Validation schemas
const createReplySchema = z.object({
  content: z.string().min(1, "Content is required"),
  postId: z.string().uuid("Invalid post ID"),
});

const updateReplySchema = z.object({
  content: z.string().min(1, "Content is required"),
});

// Récupérer les réponses d'un post (public)
router.get("/", async (req, res, next) => {
  try {
    const postId = req.query.postId as string;
    if (!postId) {
      throw new BadRequestError("Post ID is required");
    }

    const replies = await replyService.findByPostId(postId);
    res.json(replies);
  } catch (error) {
    next(error);
  }
});

// Créer une réponse (authentifié)
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const data = await createReplySchema.parseAsync(req.body);
    const reply = await replyService.create({
      ...data,
      authorId: req.user.id,
    });

    res.status(201).json(reply);
  } catch (error) {
    next(error);
  }
});

// Modifier une réponse (authentifié, propriétaire uniquement)
router.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const data = await updateReplySchema.parseAsync(req.body);
    const reply = await replyService.update(req.params.id, req.user.id, data);

    res.json(reply);
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

// Supprimer une réponse (authentifié, propriétaire uniquement)
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    await replyService.delete(req.params.id, req.user.id);
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

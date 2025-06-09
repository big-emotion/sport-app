import { Router } from "express";
import { NotificationService } from "../services/NotificationService";
import { authenticateToken } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { z } from "zod";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

const router = Router();
const notificationService = new NotificationService();

// Validation schema
const notificationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20)),
});

// Get user's notifications (authenticated)
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const query = await notificationQuerySchema.parseAsync(req.query);
    const result = await notificationService.getUserNotifications({
      ...query,
      userId: req.user.id,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Mark a notification as read (authenticated, owner only)
router.put("/:id/read", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user.id
    );
    res.json(notification);
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

// Mark all notifications as read (authenticated)
router.put("/read-all", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    await notificationService.markAllAsRead(req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;

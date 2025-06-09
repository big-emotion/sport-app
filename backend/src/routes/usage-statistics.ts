import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { UsageStatisticsService } from "../services/UsageStatisticsService";
import { validateRequest } from "../middleware/validateRequest";
import { authenticateJwt, JwtPayload } from "../middleware/authenticateJwt";
import { logActionSchema } from "../validation/usageStatisticsSchemas";
import { ForbiddenError } from "../utils/errors";

const router = Router();
const prisma = new PrismaClient();
const usageStatisticsService = new UsageStatisticsService(prisma);

interface AuthRequest extends Request {
  user?: JwtPayload;
}

// Middleware to check if user is admin
const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.roles.includes("ROLE_ADMIN")) {
    next(new ForbiddenError("Admin access required"));
    return;
  }
  next();
};

// Log an action (public)
router.post(
  "/",
  validateRequest(logActionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await usageStatisticsService.logAction(req.body);
      res.status(201).json({ message: "Action logged successfully" });
    } catch (error) {
      next(error);
    }
  }
);

// Get statistics summary (admin only)
router.get(
  "/summary",
  authenticateJwt,
  isAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await usageStatisticsService.getStatsSummary();
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

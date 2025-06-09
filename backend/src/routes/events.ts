import { Router, Request, Response } from "express";
import { EventService } from "../services/EventService";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validation";
import {
  createEventSchema,
  updateEventSchema,
} from "../validation/eventSchemas";

const router = Router();
const eventService = new EventService();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const sportPlaceId = req.query.sportPlaceId as string;
    const organizerId = req.query.organizerId as string;
    const search = req.query.search as string;

    let startDate, endDate;
    if (req.query.startDate) {
      startDate = new Date(req.query.startDate as string);
    }
    if (req.query.endDate) {
      endDate = new Date(req.query.endDate as string);
    }

    const filters = {
      sportPlaceId,
      organizerId,
      startDate,
      endDate,
      search,
    };

    const result = await eventService.getAll(filters, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/upcoming", async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const events = await eventService.getUpcoming(limit);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/my-events",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const events = await eventService.getByUser(req.user.id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await eventService.getById(id);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/",
  authenticateToken,
  validate(createEventSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const data = {
        ...req.body,
        organizerId: req.user.id,
      };

      const event = await eventService.create(data);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  validate(updateEventSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const existingEvent = await eventService.getById(id);
      if (!existingEvent) {
        res.status(404).json({ error: "Event not found" });
        return;
      }

      // Vérifier que l'utilisateur est l'organisateur ou admin
      if (
        existingEvent.organizerId !== req.user.id &&
        !req.user.roles.includes("ROLE_ADMIN")
      ) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }

      const event = await eventService.update(id, req.body);
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const existingEvent = await eventService.getById(id);
      if (!existingEvent) {
        res.status(404).json({ error: "Event not found" });
        return;
      }

      // Vérifier que l'utilisateur est l'organisateur ou admin
      if (
        existingEvent.organizerId !== req.user.id &&
        !req.user.roles.includes("ROLE_ADMIN")
      ) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }

      await eventService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

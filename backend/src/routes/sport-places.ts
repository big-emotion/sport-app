import { Router, Request, Response } from "express";
import { SportPlaceService } from "../services/SportPlaceService";
import { authenticateToken } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import {
  createSportPlaceSchema,
  updateSportPlaceSchema,
} from "../validation/sportSchemas";

const router = Router();
const sportPlaceService = new SportPlaceService();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const sportId = req.query.sportId as string;
    const search = req.query.search as string;

    const filters = {
      sportId,
      search,
    };

    const result = await sportPlaceService.getAll(
      filters,
      page,
      limit,
      req.user?.id
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/nearby", async (req: Request, res: Response): Promise<void> => {
  try {
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);
    const radius = parseFloat(req.query.radius as string) || 10;

    if (isNaN(latitude) || isNaN(longitude)) {
      res
        .status(400)
        .json({ error: "Valid latitude and longitude are required" });
      return;
    }

    const sportPlaces = await sportPlaceService.getNearby(
      latitude,
      longitude,
      radius
    );
    res.json(sportPlaces);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const sportPlace = await sportPlaceService.getById(id, req.user?.id);

    if (!sportPlace) {
      res.status(404).json({ error: "Sport place not found" });
      return;
    }

    res.json(sportPlace);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/",
  authenticateToken,
  validateRequest(createSportPlaceSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const data = {
        ...req.body,
        createdById: req.user.id,
      };

      const sportPlace = await sportPlaceService.create(data);
      res.status(201).json(sportPlace);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  validateRequest(updateSportPlaceSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const sportPlace = await sportPlaceService.update(id, req.body);
      res.json(sportPlace);
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

      const existingSportPlace = await sportPlaceService.getById(id);
      if (!existingSportPlace) {
        res.status(404).json({ error: "Sport place not found" });
        return;
      }

      // Vérifier que l'utilisateur est le créateur ou admin
      if (
        existingSportPlace.createdBy.id !== req.user.id &&
        !req.user.roles.includes("ROLE_ADMIN")
      ) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }

      await sportPlaceService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

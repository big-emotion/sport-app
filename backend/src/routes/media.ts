import { Router } from "express";
import { MediaService } from "../services/MediaService";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../config/multer";
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../utils/errors";
import { z } from "zod";

const router = Router();
const mediaService = new MediaService();

// Validation schema pour les paramètres de l'upload
const uploadSchema = z.object({
  sportPlaceId: z.string().uuid("Invalid sport place ID"),
});

// Upload un fichier média (authentifié)
router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      if (!req.file) {
        throw new BadRequestError("No file uploaded");
      }

      // Valider les paramètres optionnels
      const params = await uploadSchema.parseAsync(req.body);

      const media = await mediaService.create({
        url: req.file.filename,
        uploadedById: req.user.id,
        sportPlaceId: params.sportPlaceId,
      });

      res.status(201).json(media);
    } catch (error) {
      next(error);
    }
  }
);

// Récupérer un média par son ID (public)
router.get("/:id", async (req, res, next) => {
  try {
    const media = await mediaService.findById(req.params.id);

    if (!media) {
      throw new NotFoundError("Media not found");
    }

    res.json(media);
  } catch (error) {
    next(error);
  }
});

// Supprimer un média (authentifié, propriétaire uniquement)
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    await mediaService.delete(req.params.id, req.user.id);
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

// Récupérer les médias d'un lieu de sport (public)
router.get("/sport-place/:id", async (req, res, next) => {
  try {
    const media = await mediaService.findBySportPlace(req.params.id);
    res.json(media);
  } catch (error) {
    next(error);
  }
});

export default router;

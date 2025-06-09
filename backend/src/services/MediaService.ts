import { PrismaClient, Media } from "@prisma/client";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import * as fs from "fs/promises";
import * as path from "path";

const prisma = new PrismaClient();

export interface MediaCreateInput {
  url: string;
  uploadedById: string;
  sportPlaceId: string;
}

export class MediaService {
  private readonly uploadsDir = "uploads";

  async create(data: MediaCreateInput): Promise<Media> {
    // Vérifier si le lieu de sport existe si un ID est fourni
    const sportPlace = await prisma.sportPlace.findUnique({
      where: { id: data.sportPlaceId },
    });

    if (!sportPlace) {
      throw new NotFoundError("Sport place not found");
    }

    return prisma.media.create({
      data: {
        url: data.url,
        userId: data.uploadedById,
        sportPlaceId: data.sportPlaceId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        sportPlace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Media | null> {
    return prisma.media.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        sportPlace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundError("Media not found");
    }

    // Vérifier si l'utilisateur est le propriétaire
    if (media.userId !== userId) {
      throw new UnauthorizedError("You can only delete your own media files");
    }

    // Supprimer le fichier physique
    const filePath = path.join(this.uploadsDir, media.url);
    try {
      await fs.unlink(filePath);
    } catch {
      // Continuer même si la suppression du fichier échoue
    }

    // Supprimer l'enregistrement de la base de données
    await prisma.media.delete({
      where: { id },
    });
  }

  async findBySportPlace(sportPlaceId: string): Promise<Media[]> {
    return prisma.media.findMany({
      where: { sportPlaceId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

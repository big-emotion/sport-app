import { PrismaClient, Favorite } from "@prisma/client";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

const prisma = new PrismaClient();

export interface FavoriteCreateInput {
  userId: string;
  sportPlaceId: string;
}

export class FavoriteService {
  async findByUser(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        sportPlace: {
          include: {
            sports: true,
            _count: {
              select: {
                events: true,
                reviews: true,
                favorites: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: FavoriteCreateInput): Promise<Favorite> {
    // Vérifier si le lieu de sport existe
    const sportPlace = await prisma.sportPlace.findUnique({
      where: { id: data.sportPlaceId },
    });

    if (!sportPlace) {
      throw new NotFoundError("Sport place not found");
    }

    // Vérifier si le favori existe déjà
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: data.userId,
        sportPlaceId: data.sportPlaceId,
      },
    });

    if (existingFavorite) {
      return existingFavorite;
    }

    return prisma.favorite.create({
      data: {
        userId: data.userId,
        sportPlaceId: data.sportPlaceId,
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const favorite = await prisma.favorite.findUnique({
      where: { id },
    });

    if (!favorite) {
      throw new NotFoundError("Favorite not found");
    }

    if (favorite.userId !== userId) {
      throw new UnauthorizedError("You can only delete your own favorites");
    }

    await prisma.favorite.delete({ where: { id } });
  }

  async isFavorite(sportPlaceId: string, userId: string): Promise<boolean> {
    const favorite = await prisma.favorite.findFirst({
      where: {
        sportPlaceId,
        userId,
      },
    });

    return !!favorite;
  }
}

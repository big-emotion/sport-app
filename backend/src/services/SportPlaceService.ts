import prisma from "../config/database";
import { FavoriteService } from "./FavoriteService";

const favoriteService = new FavoriteService();

export interface CreateSportPlaceData {
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: {
    [key in
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday"]?: {
      open: string;
      close: string;
    };
  };
  sportIds: string[];
  createdById: string;
}

export interface UpdateSportPlaceData {
  name?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: {
    [key in
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday"]?: {
      open: string;
      close: string;
    };
  };
  sportIds?: string[];
}

export interface SportPlaceFilters {
  sportId?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // en km
  search?: string;
}

export class SportPlaceService {
  async getAll(
    filters: SportPlaceFilters = {},
    page = 1,
    limit = 20,
    userId?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.sportId) {
      where.sports = {
        some: {
          id: filters.sportId,
        },
      };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [sportPlaces, total] = await Promise.all([
      prisma.sportPlace.findMany({
        where,
        skip,
        take: limit,
        include: {
          sports: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              events: true,
              reviews: true,
              favorites: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.sportPlace.count({ where }),
    ]);

    // Si un utilisateur est connecté, ajouter le champ isFavorite
    const enrichedSportPlaces = userId
      ? await Promise.all(
          sportPlaces.map(async (place) => ({
            ...place,
            isFavorite: await favoriteService.isFavorite(place.id, userId),
          }))
        )
      : sportPlaces;

    return {
      sportPlaces: enrichedSportPlaces,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string, userId?: string) {
    const sportPlace = await prisma.sportPlace.findUnique({
      where: { id },
      include: {
        sports: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        events: {
          include: {
            organizer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { eventDate: "asc" },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            events: true,
            reviews: true,
            favorites: true,
          },
        },
      },
    });

    if (!sportPlace) {
      return null;
    }

    // Ajouter le champ isFavorite si un utilisateur est connecté
    return userId
      ? {
          ...sportPlace,
          isFavorite: await favoriteService.isFavorite(id, userId),
        }
      : sportPlace;
  }

  async create(data: CreateSportPlaceData) {
    const { sportIds, ...placeData } = data;

    return prisma.sportPlace.create({
      data: {
        ...placeData,
        sports: {
          create: sportIds.map((sportId) => ({
            sportId,
          })),
        },
      },
      include: {
        sports: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateSportPlaceData) {
    const { sportIds, ...placeData } = data;

    const updateData: any = {
      ...placeData,
    };

    if (sportIds) {
      updateData.sports = {
        set: sportIds.map((id) => ({ id })),
      };
    }

    return prisma.sportPlace.update({
      where: { id },
      data: updateData,
      include: {
        sports: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.sportPlace.delete({
      where: { id },
    });
  }

  async getNearby(latitude: number, longitude: number, radius = 10) {
    // Pour PostgreSQL avec PostGIS, on utiliserait ST_DWithin
    // Ici on fait un calcul approximatif avec les coordonnées
    const latRange = radius / 111; // 1 degré ≈ 111 km
    const lonRange = radius / (111 * Math.cos((latitude * Math.PI) / 180));

    return prisma.sportPlace.findMany({
      where: {
        AND: [
          { latitude: { gte: latitude - latRange, lte: latitude + latRange } },
          {
            longitude: { gte: longitude - lonRange, lte: longitude + lonRange },
          },
        ],
      },
      include: {
        sports: {
          include: {
            sport: true,
          },
        },
        _count: {
          select: {
            events: true,
            reviews: true,
          },
        },
      },
    });
  }
}

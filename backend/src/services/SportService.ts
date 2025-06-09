import prisma from "../config/database";

export interface CreateSportData {
  name: string;
  description?: string;
  iconUrl?: string;
}

export interface UpdateSportData {
  name?: string;
  description?: string;
  iconUrl?: string;
}

export class SportService {
  async getAll() {
    return prisma.sport.findMany({
      include: {
        _count: {
          select: {
            sportPlaces: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async getById(id: string) {
    const sport = await prisma.sport.findUnique({
      where: { id },
      include: {
        sportPlaces: {
          include: {
            sportPlace: true,
          },
        },
        _count: {
          select: {
            sportPlaces: true,
          },
        },
      },
    });

    if (!sport) {
      return null;
    }

    // Get the IDs of all related sport places
    const sportPlaceIds = sport.sportPlaces.map((sp) => sp.sportPlaceId);

    // Fetch the detailed sport place information
    const sportPlaceDetails = await prisma.sportPlace.findMany({
      where: {
        id: {
          in: sportPlaceIds,
        },
      },
      include: {
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
          },
        },
      },
    });

    return {
      ...sport,
      sportPlaces: sportPlaceDetails,
    };
  }

  async create(data: CreateSportData) {
    return prisma.sport.create({
      data,
    });
  }

  async update(id: string, data: UpdateSportData) {
    return prisma.sport.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.sport.delete({
      where: { id },
    });
  }

  async search(query: string) {
    return prisma.sport.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        _count: {
          select: {
            sportPlaces: true,
          },
        },
      },
    });
  }
}

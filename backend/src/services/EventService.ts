import prisma from "../config/database";

export interface CreateEventData {
  title: string;
  description: string;
  eventDate: Date;
  sportPlaceId: string;
  organizerId: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  eventDate?: Date;
  sportPlaceId?: string;
}

export interface EventFilters {
  sportPlaceId?: string;
  organizerId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export class EventService {
  async getAll(filters: EventFilters = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.sportPlaceId) {
      where.sportPlaceId = filters.sportPlaceId;
    }

    if (filters.organizerId) {
      where.organizerId = filters.organizerId;
    }

    if (filters.startDate || filters.endDate) {
      where.eventDate = {};
      if (filters.startDate) {
        where.eventDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.eventDate.lte = filters.endDate;
      }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        include: {
          sportPlace: {
            include: {
              sports: true,
            },
          },
          organizer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { eventDate: "asc" },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        sportPlace: {
          include: {
            sports: true,
          },
        },
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });
  }

  async create(data: CreateEventData) {
    return prisma.event.create({
      data,
      include: {
        sportPlace: {
          include: {
            sports: true,
          },
        },
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateEventData) {
    return prisma.event.update({
      where: { id },
      data,
      include: {
        sportPlace: {
          include: {
            sports: true,
          },
        },
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.event.delete({
      where: { id },
    });
  }

  async getUpcoming(limit = 10) {
    const now = new Date();

    return prisma.event.findMany({
      where: {
        eventDate: {
          gte: now,
        },
      },
      take: limit,
      include: {
        sportPlace: {
          include: {
            sports: true,
          },
        },
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { eventDate: "asc" },
    });
  }

  async getByUser(userId: string) {
    return prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        sportPlace: {
          include: {
            sports: true,
          },
        },
      },
      orderBy: { eventDate: "desc" },
    });
  }
}

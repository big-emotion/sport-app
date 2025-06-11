import { PrismaClient, Itinerary } from "@prisma/client";
import {
  CreateItineraryDto,
  UpdateItineraryDto,
} from "../validation/itinerarySchemas";
import { ForbiddenError, NotFoundError } from "../utils/errors";

export class ItineraryService {
  constructor(private prisma: PrismaClient) {}

  async findUserItineraries(userId: string): Promise<Itinerary[]> {
    return this.prisma.itinerary.findMany({
      where: { userId },
      orderBy: { startDate: "asc" },
    });
  }

  async findById(id: string, userId: string): Promise<Itinerary> {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
    });

    if (!itinerary) {
      throw new NotFoundError("Itinerary not found");
    }

    if (itinerary.userId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to access this itinerary"
      );
    }

    return itinerary;
  }

  async create(data: CreateItineraryDto, userId: string): Promise<Itinerary> {
    return this.prisma.itinerary.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(
    id: string,
    data: UpdateItineraryDto,
    userId: string
  ): Promise<Itinerary> {
    const itinerary = await this.findById(id, userId);

    return this.prisma.itinerary.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);

    await this.prisma.itinerary.delete({
      where: { id },
    });
  }
}

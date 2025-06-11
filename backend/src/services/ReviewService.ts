import prisma from "../config/database";

export interface CreateReviewData {
  rating: number;
  comment?: string;
  userId: string;
  sportPlaceId: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export interface GetAllReviewsParams {
  page?: number;
  limit?: number;
  sportPlaceId?: string;
}

export class ReviewService {
  async getAll(params: GetAllReviewsParams = {}) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where = params.sportPlaceId
      ? { sportPlaceId: params.sportPlaceId }
      : {};

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          sportPlace: {
            select: {
              id: true,
              name: true,
              sports: {
                select: {
                  sport: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        sportPlace: {
          include: {
            sports: true,
          },
        },
      },
    });
  }

  async create(data: CreateReviewData) {
    // Vérifier si l'utilisateur a déjà donné un avis pour ce lieu
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: data.userId,
        sportPlaceId: data.sportPlaceId,
      },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this sport place");
    }

    return prisma.review.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        sportPlace: {
          include: {
            sports: true,
          },
        },
      },
    });
  }

  async update(id: string, userId: string, data: UpdateReviewData) {
    // Vérifier que l'utilisateur est bien l'auteur de l'avis
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review || review.userId !== userId) {
      throw new Error("Review not found or unauthorized");
    }

    return prisma.review.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        sportPlace: {
          include: {
            sports: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    // Vérifier que l'utilisateur est bien l'auteur de l'avis
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review || review.userId !== userId) {
      throw new Error("Review not found or unauthorized");
    }

    return prisma.review.delete({
      where: { id },
    });
  }

  async getByUser(userId: string) {
    return prisma.review.findMany({
      where: { userId },
      include: {
        sportPlace: {
          include: {
            sports: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAverageRating(sportPlaceId: string) {
    const result = await prisma.review.aggregate({
      where: { sportPlaceId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      averageRating: result._avg.rating || 0,
      totalReviews: result._count.rating,
    };
  }
}

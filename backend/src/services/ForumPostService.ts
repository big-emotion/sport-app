import { PrismaClient, ForumPost } from "@prisma/client";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

const prisma = new PrismaClient();

export interface ForumPostCreateInput {
  title: string;
  content: string;
  userId: string;
}

export interface ForumPostUpdateInput {
  title?: string;
  content?: string;
}

export interface ForumPostQuery {
  page?: number;
  limit?: number;
  sportPlaceId?: string;
}

export class ForumPostService {
  async create(data: ForumPostCreateInput): Promise<ForumPost> {
    return prisma.forumPost.create({
      data: {
        title: data.title,
        content: data.content,
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(
    query: ForumPostQuery = {}
  ): Promise<{ posts: ForumPost[]; total: number }> {
    const { page = 1, limit = 10, sportPlaceId } = query;
    const skip = (page - 1) * limit;

    const where = sportPlaceId ? { sportPlaceId } : {};

    const [posts, total] = await Promise.all([
      prisma.forumPost.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.forumPost.count({ where }),
    ]);

    return { posts, total };
  }

  async findById(id: string): Promise<ForumPost | null> {
    return prisma.forumPost.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: ForumPostUpdateInput
  ): Promise<ForumPost> {
    const post = await prisma.forumPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    if (post.userId !== userId) {
      throw new UnauthorizedError("You can only update your own posts");
    }

    return prisma.forumPost.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const post = await prisma.forumPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    if (post.userId !== userId) {
      throw new UnauthorizedError("You can only delete your own posts");
    }

    await prisma.forumPost.delete({
      where: { id },
    });
  }
}

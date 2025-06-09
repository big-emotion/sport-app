import { PrismaClient, ForumReply } from "@prisma/client";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

const prisma = new PrismaClient();

export interface ForumReplyCreateInput {
  content: string;
  postId: string;
  authorId: string;
}

export interface ForumReplyUpdateInput {
  content: string;
}

export class ForumReplyService {
  async create(data: ForumReplyCreateInput): Promise<ForumReply> {
    // Vérifier si le post existe
    const post = await prisma.forumPost.findUnique({
      where: { id: data.postId },
    });

    if (!post) {
      throw new NotFoundError("Forum post not found");
    }

    return prisma.forumReply.create({
      data: {
        content: data.content,
        postId: data.postId,
        authorId: data.authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findByPostId(postId: string): Promise<ForumReply[]> {
    return prisma.forumReply.findMany({
      where: { postId },
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
    });
  }

  async update(
    id: string,
    userId: string,
    data: ForumReplyUpdateInput
  ): Promise<ForumReply> {
    const reply = await prisma.forumReply.findUnique({
      where: { id },
    });

    if (!reply) {
      throw new NotFoundError("Reply not found");
    }

    if (reply.authorId !== userId) {
      throw new UnauthorizedError("You can only update your own replies");
    }

    return prisma.forumReply.update({
      where: { id },
      data: {
        content: data.content,
      },
      include: {
        author: {
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
    const reply = await prisma.forumReply.findUnique({
      where: { id },
    });

    if (!reply) {
      throw new NotFoundError("Reply not found");
    }

    if (reply.authorId !== userId) {
      throw new UnauthorizedError("You can only delete your own replies");
    }

    await prisma.forumReply.delete({
      where: { id },
    });
  }
}

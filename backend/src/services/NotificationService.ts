import { PrismaClient, Notification } from "@prisma/client";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

const prisma = new PrismaClient();

export interface NotificationCreateInput {
  title: string;
  message: string;
  userId: string;
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
  userId: string;
}

export class NotificationService {
  async create(data: NotificationCreateInput): Promise<Notification> {
    return prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        userId: data.userId,
      },
    });
  }

  async getUserNotifications(query: NotificationQuery) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: query.userId },
        skip,
        take: limit,
        orderBy: [{ read: "asc" }, { createdAt: "desc" }],
      }),
      prisma.notification.count({
        where: { userId: query.userId },
      }),
    ]);

    return {
      notifications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      unreadCount: await this.getUnreadCount(query.userId),
    };
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new UnauthorizedError(
        "You can only mark your own notifications as read"
      );
    }

    return prisma.notification.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  private async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }
}

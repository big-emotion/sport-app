import { PrismaClient, Prisma } from "@prisma/client";
import { LogActionDto } from "../validation/usageStatisticsSchemas";

export class UsageStatisticsService {
  constructor(private prisma: PrismaClient) {}

  async logAction(data: LogActionDto): Promise<void> {
    await this.prisma.usageStatistics.create({
      data: {
        action: data.action,
        metadata:
          data.metadata === null
            ? Prisma.JsonNull
            : (data.metadata as Prisma.InputJsonValue),
      },
    });
  }

  async getStatsSummary(): Promise<{
    totalActions: number;
    actionCounts: Record<string, number>;
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  }> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalActions, actionCounts, recent] = await Promise.all([
      // Total number of actions
      this.prisma.usageStatistics.count(),

      // Count by action type
      this.prisma.usageStatistics.groupBy({
        by: ["action"],
        _count: true,
      }),

      // Recent activity counts
      this.prisma.usageStatistics.findMany({
        where: {
          createdAt: {
            gte: last30Days,
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ]);

    // Process action counts
    const actionCountsMap = actionCounts.reduce((acc, curr) => {
      acc[curr.action] = curr._count;
      return acc;
    }, {} as Record<string, number>);

    // Count recent activities
    const recentCounts = {
      last24Hours: recent.filter((r) => r.createdAt >= last24Hours).length,
      last7Days: recent.filter((r) => r.createdAt >= last7Days).length,
      last30Days: recent.length,
    };

    return {
      totalActions,
      actionCounts: actionCountsMap,
      ...recentCounts,
    };
  }
}

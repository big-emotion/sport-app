import { PrismaClient } from "@prisma/client";
import "@jest/globals";
import process from "process";

declare global {
  var prisma: PrismaClient;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL_TEST ||
        "postgresql://test:test@localhost:5432/sport_app_test?schema=public",
    },
  },
});

beforeAll(async () => {
  // Nettoyer la base de test avant les tests
  await prisma.$connect();
});

beforeEach(async () => {
  // Nettoyer les données entre chaque test
  await prisma.userAction.deleteMany();
  await prisma.media.deleteMany();
  await prisma.forumReply.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.event.deleteMany();
  await prisma.sportPlace.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };

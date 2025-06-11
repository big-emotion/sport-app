import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("🌱 Starting seed...");

  // Créer des sports
  const sports = await Promise.all([
    prisma.sport.create({
      data: {
        name: "Football",
        description: "Le sport le plus populaire au monde",
      },
    }),
    prisma.sport.create({
      data: {
        name: "Basketball",
        description: "Sport collectif avec un ballon et des paniers",
      },
    }),
    prisma.sport.create({
      data: {
        name: "Tennis",
        description: "Sport de raquette individuel ou en double",
      },
    }),
    prisma.sport.create({
      data: {
        name: "Natation",
        description: "Sport aquatique individuel",
      },
    }),
  ]);

  console.log("✅ Sports créés");

  // Créer des utilisateurs
  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");

  const admin = await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "System",
      email: "admin@sportapp.com",
      password: adminPassword,
      roles: ["ROLE_USER", "ROLE_ADMIN"],
    },
  });

  const user = await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: userPassword,
      roles: ["ROLE_USER"],
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      password: userPassword,
      roles: ["ROLE_USER"],
    },
  });

  console.log("✅ Utilisateurs créés");

  // Créer des lieux de sport
  const sportPlaces = await Promise.all([
    prisma.sportPlace.create({
      data: {
        name: "Stade Municipal",
        description: "Grand stade de football avec pelouse naturelle",
        address: "123 Rue du Sport, Paris",
        latitude: 48.8566,
        longitude: 2.3522,
        sports: {
          create: [
            {
              sport: { connect: { id: sports[0].id } }, // Football
            },
          ],
        },
        createdById: admin.id,
      },
    }),
    prisma.sportPlace.create({
      data: {
        name: "Complexe Sportif Central",
        description: "Complexe multi-sports avec terrains de basket",
        address: "456 Avenue des Sports, Lyon",
        latitude: 45.764,
        longitude: 4.8357,
        sports: {
          create: [
            { sport: { connect: { id: sports[1].id } } }, // Basketball
            { sport: { connect: { id: sports[0].id } } }, // Football aussi
          ],
        },
        createdById: user.id,
      },
    }),
    prisma.sportPlace.create({
      data: {
        name: "Club de Tennis Élite",
        description: "Courts de tennis en terre battue et dur",
        address: "789 Boulevard du Tennis, Marseille",
        latitude: 43.2965,
        longitude: 5.3698,
        sports: {
          create: [
            {
              sport: { connect: { id: sports[2].id } }, // Tennis
            },
          ],
        },
        createdById: user2.id,
      },
    }),
  ]);

  console.log("✅ Lieux de sport créés");

  // Créer des événements
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Match de Football Amateur",
        description: "Match amical entre équipes locales",
        eventDate: new Date("2024-07-15T15:00:00Z"),
        sportPlaceId: sportPlaces[0].id,
        organizerId: admin.id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Tournoi de Basketball",
        description: "Tournoi 3v3 ouvert à tous",
        eventDate: new Date("2024-07-20T10:00:00Z"),
        sportPlaceId: sportPlaces[1].id,
        organizerId: user.id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Cours de Tennis Débutant",
        description: "Cours d'initiation au tennis",
        eventDate: new Date("2024-07-25T09:00:00Z"),
        sportPlaceId: sportPlaces[2].id,
        organizerId: user2.id,
      },
    }),
  ]);

  console.log("✅ Événements créés");

  // Créer des avis
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Excellent stade, très bien entretenu!",
        userId: user.id,
        sportPlaceId: sportPlaces[0].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: "Bon complexe sportif, parking un peu petit",
        userId: user2.id,
        sportPlaceId: sportPlaces[1].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Courts de tennis en parfait état",
        userId: admin.id,
        sportPlaceId: sportPlaces[2].id,
      },
    }),
  ]);

  console.log("✅ Avis créés");

  // Créer des favoris
  await Promise.all([
    prisma.favorite.create({
      data: {
        userId: user.id,
        sportPlaceId: sportPlaces[2].id,
      },
    }),
    prisma.favorite.create({
      data: {
        userId: user2.id,
        sportPlaceId: sportPlaces[0].id,
      },
    }),
  ]);

  console.log("✅ Favoris créés");

  console.log("🎉 Seed terminé avec succès!");
  console.log(`📊 Données créées:
  - ${sports.length} sports
  - 3 utilisateurs (admin@sportapp.com / admin123, john@example.com / user123, jane@example.com / user123)
  - ${sportPlaces.length} lieux de sport
  - ${events.length} événements
  - ${reviews.length} avis
  - 2 favoris`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

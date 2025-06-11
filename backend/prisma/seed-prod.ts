import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

// Données de base essentielles pour l'application
const essentialSports = [
  {
    name: "Football",
    description: "Le sport le plus populaire au monde",
  },
  {
    name: "Basketball",
    description: "Sport collectif avec un ballon et des paniers",
  },
  {
    name: "Tennis",
    description: "Sport de raquette individuel ou en double",
  },
  {
    name: "Natation",
    description: "Sport aquatique individuel",
  },
];

const essentialSportPlaces = [
  {
    name: "Stade Municipal",
    description: "Grand stade de football avec pelouse naturelle",
    address: "123 Rue du Sport, Paris",
    latitude: 48.8566,
    longitude: 2.3522,
    sports: ["Football"],
  },
  {
    name: "Complexe Sportif Central",
    description: "Complexe multi-sports avec terrains de basket",
    address: "456 Avenue des Sports, Lyon",
    latitude: 45.764,
    longitude: 4.8357,
    sports: ["Basketball", "Football"],
  },
  {
    name: "Club de Tennis Élite",
    description: "Courts de tennis en terre battue et dur",
    address: "789 Boulevard du Tennis, Marseille",
    latitude: 43.2965,
    longitude: 5.3698,
    sports: ["Tennis"],
  },
];

const essentialEvents = [
  {
    title: "Match de Football Amateur",
    description: "Match amical entre équipes locales",
    eventDate: new Date("2024-07-15T15:00:00Z"),
    sportPlaceName: "Stade Municipal",
  },
  {
    title: "Tournoi de Basketball",
    description: "Tournoi 3v3 ouvert à tous",
    eventDate: new Date("2024-07-20T10:00:00Z"),
    sportPlaceName: "Complexe Sportif Central",
  },
  {
    title: "Cours de Tennis Débutant",
    description: "Cours d'initiation au tennis",
    eventDate: new Date("2024-07-25T09:00:00Z"),
    sportPlaceName: "Club de Tennis Élite",
  },
];

const essentialReviews = [
  {
    rating: 5,
    comment: "Excellent stade, très bien entretenu!",
    sportPlaceName: "Stade Municipal",
  },
  {
    rating: 4,
    comment: "Bon complexe sportif, parking un peu petit",
    sportPlaceName: "Complexe Sportif Central",
  },
  {
    rating: 5,
    comment: "Courts de tennis en parfait état",
    sportPlaceName: "Club de Tennis Élite",
  },
];

async function main(): Promise<void> {
  console.log("🌱 Starting production seed...");

  // --- Création des sports (idempotent) ---
  await Promise.all(
    essentialSports.map(async (sport) => {
      const existingSport = await prisma.sport.findFirst({
        where: { name: sport.name },
      });

      return prisma.sport.upsert({
        where: { id: existingSport?.id ?? "new" },
        update: {},
        create: {
          name: sport.name,
          description: sport.description,
        },
      });
    })
  );
  console.log(`✅ ${essentialSports.length} sports essentiels vérifiés/créés.`);

  // --- Création de l'utilisateur admin (si non existant) ---
  const adminEmail = "admin@sportapp.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  let admin;
  if (!existingAdmin) {
    const adminPassword = await hashPassword("change-me-immediately");
    admin = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "System",
        email: adminEmail,
        password: adminPassword,
        roles: ["ROLE_USER", "ROLE_ADMIN"],
      },
    });
    console.log("✅ Compte administrateur créé.");
    console.log(
      "🔒 IMPORTANT: Le mot de passe admin par défaut est 'change-me-immediately'. Changez-le dès que possible !"
    );
  } else {
    admin = existingAdmin;
    console.log("✅ Le compte administrateur existe déjà.");
  }

  // --- Création des lieux de sport (idempotent) ---
  for (const place of essentialSportPlaces) {
    const existingPlace = await prisma.sportPlace.findFirst({
      where: { name: place.name },
    });

    if (!existingPlace) {
      const sportIds = await Promise.all(
        place.sports.map(async (sportName) => {
          const sport = await prisma.sport.findFirst({
            where: { name: sportName },
          });
          return sport!.id;
        })
      );

      await prisma.sportPlace.create({
        data: {
          name: place.name,
          description: place.description,
          address: place.address,
          latitude: place.latitude,
          longitude: place.longitude,
          sports: {
            create: sportIds.map((sportId) => ({
              sport: { connect: { id: sportId } },
            })),
          },
          createdById: admin.id,
        },
      });
    }
  }
  console.log(
    `✅ ${essentialSportPlaces.length} lieux de sport vérifiés/créés.`
  );

  // --- Création des événements (idempotent) ---
  for (const event of essentialEvents) {
    const existingEvent = await prisma.event.findFirst({
      where: { title: event.title },
    });

    if (!existingEvent) {
      const sportPlace = await prisma.sportPlace.findFirst({
        where: { name: event.sportPlaceName },
      });

      if (sportPlace) {
        await prisma.event.create({
          data: {
            title: event.title,
            description: event.description,
            eventDate: event.eventDate,
            sportPlaceId: sportPlace.id,
            organizerId: admin.id,
          },
        });
      }
    }
  }
  console.log(`✅ ${essentialEvents.length} événements vérifiés/créés.`);

  // --- Création des avis (idempotent) ---
  for (const review of essentialReviews) {
    const sportPlace = await prisma.sportPlace.findFirst({
      where: { name: review.sportPlaceName },
    });

    if (sportPlace) {
      const existingReview = await prisma.review.findFirst({
        where: {
          userId: admin.id,
          sportPlaceId: sportPlace.id,
        },
      });

      if (!existingReview) {
        await prisma.review.create({
          data: {
            rating: review.rating,
            comment: review.comment,
            userId: admin.id,
            sportPlaceId: sportPlace.id,
          },
        });
      }
    }
  }
  console.log(`✅ ${essentialReviews.length} avis vérifiés/créés.`);

  console.log("🎉 Production seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed de production:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

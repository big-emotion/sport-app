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

async function main(): Promise<void> {
  console.log("🌱 Starting production seed...");

  // --- Création des sports (idempotent) ---
  // "upsert" va créer le sport s'il n'existe pas (basé sur le `name`)
  // ou ne rien faire s'il existe déjà.
  for (const sport of essentialSports) {
    const existingSport = await prisma.sport.findFirst({
      where: { name: sport.name },
    });

    await prisma.sport.upsert({
      where: { id: existingSport?.id ?? "new" },
      update: {},
      create: {
        name: sport.name,
        description: sport.description,
      },
    });
  }
  console.log(`✅ ${essentialSports.length} sports essentiels vérifiés/créés.`);

  // --- Création de l'utilisateur admin (si non existant) ---
  const adminEmail = "admin@sportapp.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // IMPORTANT: Changez ce mot de passe ou utilisez une variable d'environnement
    const adminPassword = await hashPassword("change-me-immediately");
    await prisma.user.create({
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
    console.log("✅ Le compte administrateur existe déjà.");
  }

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

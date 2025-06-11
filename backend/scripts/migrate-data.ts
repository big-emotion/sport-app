import { PrismaClient } from '@prisma/client';
import { createConnection } from 'mysql2/promise';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

// Configuration pour la base de données Symfony (à adapter selon votre config)
const symfonyDbConfig = {
  host: process.env.SYMFONY_DB_HOST || 'localhost',
  user: process.env.SYMFONY_DB_USER || 'root',
  password: process.env.SYMFONY_DB_PASSWORD || '',
  database: process.env.SYMFONY_DB_NAME || 'sport_app_symfony',
  port: parseInt(process.env.SYMFONY_DB_PORT || '3306')
};

interface SymfonyUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  roles: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

interface SymfonySport {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
}

interface SymfonySportPlace {
  id: string;
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  sport_id: string;
  created_by_id: string;
  created_at: Date;
  updated_at: Date;
}

async function migrateData() {
  console.log('🚀 Début de la migration des données Symfony vers Express...');

  try {
    // Connexion à la base Symfony
    const symfonyConnection = await createConnection(symfonyDbConfig);
    console.log('✅ Connexion à la base Symfony établie');

    // 1. Migrer les sports
    console.log('📊 Migration des sports...');
    const [sportRows] = await symfonyConnection.execute('SELECT * FROM sport');
    const sports = sportRows as SymfonySport[];
    
    for (const sport of sports) {
      await prisma.sport.upsert({
        where: { id: sport.id },
        update: {
          name: sport.name,
          description: sport.description || null
        },
        create: {
          id: sport.id,
          name: sport.name,
          description: sport.description || null,
          createdAt: sport.created_at
        }
      });
    }
    console.log(`✅ ${sports.length} sports migrés`);

    // 2. Migrer les utilisateurs
    console.log('👥 Migration des utilisateurs...');
    const [userRows] = await symfonyConnection.execute('SELECT * FROM user');
    const users = userRows as SymfonyUser[];
    
    for (const user of users) {
      // Convertir les rôles JSON de Symfony
      let roles;
      try {
        roles = JSON.parse(user.roles);
      } catch {
        roles = ['ROLE_USER'];
      }

      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          roles: roles,
          avatarUrl: user.avatar_url || null,
          updatedAt: user.updated_at
        },
        create: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          password: user.password, // Garder le hash Symfony (compatible bcrypt)
          roles: roles,
          avatarUrl: user.avatar_url || null,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      });
    }
    console.log(`✅ ${users.length} utilisateurs migrés`);

    // 3. Migrer les lieux de sport
    console.log('🏟️ Migration des lieux de sport...');
    const [sportPlaceRows] = await symfonyConnection.execute('SELECT * FROM sport_place');
    const sportPlaces = sportPlaceRows as SymfonySportPlace[];
    
    for (const sportPlace of sportPlaces) {
      await prisma.sportPlace.upsert({
        where: { id: sportPlace.id },
        update: {
          name: sportPlace.name,
          description: sportPlace.description || null,
          address: sportPlace.address || null,
          latitude: sportPlace.latitude || null,
          longitude: sportPlace.longitude || null,
          sportId: sportPlace.sport_id,
          updatedAt: sportPlace.updated_at
        },
        create: {
          id: sportPlace.id,
          name: sportPlace.name,
          description: sportPlace.description || null,
          address: sportPlace.address || null,
          latitude: sportPlace.latitude || null,
          longitude: sportPlace.longitude || null,
          sportId: sportPlace.sport_id,
          createdById: sportPlace.created_by_id,
          createdAt: sportPlace.created_at,
          updatedAt: sportPlace.updated_at
        }
      });
    }
    console.log(`✅ ${sportPlaces.length} lieux de sport migrés`);

    // 4. Migrer les événements (si la table existe)
    try {
      console.log('📅 Migration des événements...');
      const [eventRows] = await symfonyConnection.execute('SELECT * FROM event');
      
      for (const event of eventRows as any[]) {
        await prisma.event.upsert({
          where: { id: event.id },
          update: {
            title: event.title,
            description: event.description,
            eventDate: event.event_date
          },
          create: {
            id: event.id,
            title: event.title,
            description: event.description,
            eventDate: event.event_date,
            sportPlaceId: event.sport_place_id,
            organizerId: event.organizer_id,
            createdAt: event.created_at
          }
        });
      }
      console.log(`✅ ${(eventRows as any[]).length} événements migrés`);
    } catch (error) {
      console.log('⚠️ Table event non trouvée ou erreur:', error);
    }

    // 5. Migrer les avis (si la table existe)
    try {
      console.log('⭐ Migration des avis...');
      const [reviewRows] = await symfonyConnection.execute('SELECT * FROM review');
      
      for (const review of reviewRows as any[]) {
        await prisma.review.upsert({
          where: { id: review.id },
          update: {
            rating: review.rating,
            comment: review.comment || null
          },
          create: {
            id: review.id,
            rating: review.rating,
            comment: review.comment || null,
            userId: review.user_id,
            sportPlaceId: review.sport_place_id,
            createdAt: review.created_at
          }
        });
      }
      console.log(`✅ ${(reviewRows as any[]).length} avis migrés`);
    } catch (error) {
      console.log('⚠️ Table review non trouvée ou erreur:', error);
    }

    await symfonyConnection.end();
    console.log('🎉 Migration terminée avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
}

// Exécuter la migration
if (require.main === module) {
  migrateData()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { migrateData };
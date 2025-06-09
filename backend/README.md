# Sport App API - Express.js

API backend migrée de Symfony vers Express.js avec TypeScript et Prisma.

## 🚀 Installation

### Option 1: Installation locale

1. **Installer les dépendances**

```bash
npm install
```

2. **Configurer l'environnement**

```bash
cp .env.example .env
# Modifier les variables d'environnement selon votre configuration
```

3. **Configurer la base de données**

```bash
# Générer le client Prisma
npm run db:generate

# Exécuter les migrations
npm run db:migrate

# (Optionnel) Seed de données de test
npm run db:seed
```

### Option 2: Docker (recommandé)

1. **Développement avec Docker**

```bash
# Démarrer l'environnement de développement
docker-compose -f docker-compose.dev.yml up -d

# Accéder au conteneur pour les migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
docker-compose -f docker-compose.dev.yml exec app npm run db:seed
```

2. **Production avec Docker**

```bash
# Démarrer en production
docker-compose up -d

# L'API sera disponible sur http://localhost:3000
# Adminer (interface DB) sur http://localhost:8080
```

## 🛠️ Développement

```bash
# Mode développement avec rechargement automatique
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start

# Tests
npm test

# Linting
npm run lint
npm run lint:fix
```

## 📊 Structure du projet

```
src/
├── config/          # Configuration (DB, JWT, upload, etc.)
├── middleware/      # Middlewares Express (auth, validation, etc.)
├── routes/          # Routes API
│   ├── auth.ts     # Routes d'authentification
│   ├── events.ts   # Gestion des événements
│   ├── favorites.ts # Gestion des favoris
│   ├── forum.ts    # Forum et réponses
│   ├── media.ts    # Gestion des médias
│   ├── notifications.ts # Système de notifications
│   ├── sports.ts   # Gestion des sports
│   ├── statistics.ts # Statistiques d'utilisation
│   └── users.ts    # Gestion des utilisateurs
├── services/        # Logique métier
├── types/          # Types TypeScript
├── utils/          # Utilitaires
├── validation/     # Schémas de validation Zod
└── app.ts         # Point d'entrée
```

## 🔑 API Endpoints

**Base URL:** `http://localhost:3000`

### 🔐 Authentification

- `POST /api/auth/register` - Inscription
  ```json
  // Requête
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  // Réponse
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    }
  }
  ```

- `POST /api/auth/login` - Connexion
  ```json
  // Requête
  {
    "email": "john@example.com",
    "password": "password123"
  }
  // Réponse
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    }
  }
  ```

- `GET /api/auth/me` - Profil utilisateur (🔒 Auth)

### 👥 Utilisateurs

- `GET /api/users` - Liste des utilisateurs (🔒 Admin)
- `GET /api/users/:id` - Détails utilisateur (🔒 Auth)
- `PUT /api/users/:id` - Modifier un utilisateur (🔒 Owner/Admin)
- `DELETE /api/users/:id` - Supprimer un utilisateur (🔒 Admin)

### ⚽ Sports et Lieux

- `GET /api/sports` - Liste des sports
- `POST /api/sports` - Créer un sport (🔒 Admin)
- `PUT /api/sports/:id` - Modifier sport (🔒 Admin)
- `DELETE /api/sports/:id` - Supprimer sport (🔒 Admin)

- `GET /api/sport-places` - Liste des lieux sportifs
- `GET /api/sport-places/nearby` - Lieux à proximité (lat, lng, radius)
- `GET /api/sport-places/:id` - Détails lieu
- `POST /api/sport-places` - Créer un lieu sportif (🔒 Auth)
- `PUT /api/sport-places/:id` - Modifier lieu (🔒 Auth)
- `DELETE /api/sport-places/:id` - Supprimer lieu (🔒 Owner/Admin)

### 📅 Événements

- `GET /api/events` - Liste événements
- `GET /api/events/:id` - Détails événement
- `POST /api/events` - Créer événement (🔒 Auth)
- `PUT /api/events/:id` - Modifier événement (🔒 Owner/Admin)
- `DELETE /api/events/:id` - Supprimer événement (🔒 Owner/Admin)

### ⭐ Avis et Favoris

- `GET /api/reviews` - Liste avis
- `POST /api/reviews` - Créer avis (🔒 Auth)

- `GET /api/favorites` - Mes favoris (🔒 Auth)
- `POST /api/favorites` - Ajouter favori (🔒 Auth)
- `DELETE /api/favorites/:id` - Supprimer favori (🔒 Auth)

### 💬 Forum

- `GET /api/forum-posts` - Liste des posts
- `GET /api/forum-posts/:id` - Détails post
- `POST /api/forum-posts` - Créer un post (🔒 Auth)
- `PUT /api/forum-posts/:id` - Modifier post (🔒 Owner)
- `DELETE /api/forum-posts/:id` - Supprimer post (🔒 Owner/Admin)

- `GET /api/forum-replies` - Liste réponses
- `POST /api/forum-replies` - Créer réponse (🔒 Auth)
- `PUT /api/forum-replies/:id` - Modifier réponse (🔒 Owner)
- `DELETE /api/forum-replies/:id` - Supprimer réponse (🔒 Owner/Admin)

### 🔔 Notifications et Médias

- `GET /api/notifications` - Mes notifications (🔒 Auth)
- `PUT /api/notifications/:id/read` - Marquer comme lue (🔒 Auth)
- `PUT /api/notifications/read-all` - Tout marquer lu (🔒 Auth)

- `POST /api/media/upload` - Upload fichier (🔒 Auth)
- `GET /api/media/:id` - Télécharger média
- `DELETE /api/media/:id` - Supprimer média (🔒 Owner/Admin)

### 🗺️ Itinéraires et Statistiques

- `GET /api/itineraries` - Mes itinéraires (🔒 Auth)
- `POST /api/itineraries` - Créer itinéraire (🔒 Auth)
- `PUT /api/itineraries/:id` - Modifier itinéraire (🔒 Owner)
- `DELETE /api/itineraries/:id` - Supprimer itinéraire (🔒 Owner)

- `POST /api/usage-statistics` - Enregistrer action
- `GET /api/usage-statistics` - Stats globales (🔒 Admin)

## 🗄️ Base de données

Utilise Prisma ORM avec PostgreSQL. Le schéma inclut :

- **User** - Utilisateurs avec authentification
- **Sport** - Types de sports (many-to-many avec SportPlace)
- **SportPlace** - Lieux de sport avec horaires d'ouverture
- **Event** - Événements sportifs
- **Review** - Avis sur les lieux
- **ForumPost/ForumReply** - Forum communautaire
- **Favorite** - Favoris utilisateur
- **Notification** - Notifications
- **Itinerary** - Itinéraires
- **Media** - Gestion des fichiers
- **UsageStatistics** - Statistiques d'usage
- **UserAction** - Suivi des actions utilisateur

## 🔒 Sécurité

- Authentification JWT
- Hash bcrypt pour les mots de passe
- Validation des données avec Zod
- CORS configuré
- Helmet pour la sécurité des headers
- Permissions basées sur les rôles (USER, ADMIN)
- Validation des propriétaires de ressources

## 🌐 Utilisation depuis un frontend

### Configuration CORS

Le backend accepte les requêtes depuis `http://localhost:3001` par défaut (configurable via `FRONTEND_URL`).

### Authentification JavaScript

```javascript
// Configuration de base
const API_BASE_URL = 'http://localhost:3000';

// Fonction d'inscription
async function register(userData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password
    })
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de l\'inscription');
  }
  
  const data = await response.json();
  // Stocker le token pour les requêtes futures
  localStorage.setItem('authToken', data.token);
  return data;
}

// Fonction de connexion
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Identifiants incorrects');
  }
  
  const data = await response.json();
  // Stocker le token
  localStorage.setItem('authToken', data.token);
  return data;
}

// Fonction pour les requêtes authentifiées
async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem('authToken');
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
}

// Exemples d'utilisation
async function getFavorites() {
  const response = await authenticatedFetch(`${API_BASE_URL}/api/favorites`);
  return response.json();
}

async function createSportPlace(sportPlaceData) {
  const response = await authenticatedFetch(`${API_BASE_URL}/api/sport-places`, {
    method: 'POST',
    body: JSON.stringify(sportPlaceData)
  });
  return response.json();
}

// Upload de fichier (multipart/form-data)
async function uploadMedia(file, sportPlaceId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sportPlaceId', sportPlaceId);
  
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Ne pas définir Content-Type pour FormData
    },
    body: formData
  });
  
  return response.json();
}
```

### Gestion des erreurs

```javascript
// Intercepteur pour gérer les erreurs d'authentification
async function apiRequest(url, options = {}) {
  try {
    const response = await authenticatedFetch(url, options);
    
    if (response.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Session expirée');
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur API');
    }
    
    return response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}
```

## 🔄 Migration depuis Symfony

### Processus de migration

1. **Migrer les données existantes**

```bash
# Configurer les variables d'environnement pour la DB Symfony
export SYMFONY_DB_HOST=localhost
export SYMFONY_DB_USER=root
export SYMFONY_DB_PASSWORD=password
export SYMFONY_DB_NAME=sport_app_symfony

# Exécuter la migration
npm run migrate:symfony
```

### Correspondances techniques

Cette API remplace le backend Symfony avec :

- **Doctrine ORM** → **Prisma**
- **ApiPlatform** → **Routes Express**
- **Symfony Security** → **JWT + middleware**
- **Symfony Validator** → **Zod**
- **Doctrine Migrations** → **Prisma Migrate**
- **Symfony Console** → **Scripts npm**

## 🚀 Déploiement

### Variables d'environnement production

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secure-secret-key
FRONTEND_URL=https://your-frontend-domain.com
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=5242880
```

### Commandes utiles

```bash
# Build pour production
npm run build

# Démarrer en production
npm start

# Voir les logs Docker
docker-compose logs -f app

# Accéder au shell du conteneur
docker-compose exec app sh
```

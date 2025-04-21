# Sport App - Symfony/API Platform Backend

This is a conversion of the original Spring Boot backend to Symfony with API Platform.

## Setup Instructions

### 1. Install Dependencies
```bash
composer create-project symfony/skeleton:"6.4.*" .
composer require api
composer require symfony/maker-bundle --dev
composer require symfony/orm-pack
composer require symfony/serializer-pack
composer require symfony/validator
```

### 2. Docker Setup
```bash
# Build and start containers
docker-compose up -d --build
```

### 3. Configure Environment
- Copy `.env` to `.env.local` and adjust database connection:
```
DATABASE_URL="postgresql://sport_user:sport_pass@database:5432/sport_db?serverVersion=14&charset=utf8"
```

### 4. Create Database Schema
```bash
docker-compose exec php bin/console doctrine:database:create
docker-compose exec php bin/console doctrine:schema:create
```

### 5. Load Initial Data
```bash
docker-compose exec php bin/console doctrine:fixtures:load
```

### 6. Access
- API: http://localhost:8080/api
- API Documentation: http://localhost:8080/api/docs

## Converted Features
- [x] Sport Venue entity and API endpoints
- [x] CRUD operations
- [x] Validation
- [x] Search functionality
- [x] Exception handling 
# **Sport-App** 🏆

## 🌍 Overview
**Sport-App** is a platform that allows users to **locate and explore sports venues** around them.
Each venue can be associated with one or more sports (basketball, football, running, etc.), and users can **add new sports, post content (videos, comments), and interact with each other**.

The application is available in multiple versions:
- **Web** (Next.js)
- **Mobile** (React Native)
- **Desktop** (Tauri)

The **backend is built with Symfony/API Platform** and exposes a **REST API** to interact with all functionalities.

---

## 🚀 Key Features
- 📍 **Locate sports venues**
- 📄 **Detailed venue pages** (associated sports, reviews, photos, videos)
- ➕ **Community-driven sport additions**
- 🔖 **Distinction between official and community-added sports**
- 📢 **Post videos, comments on sports/venues**
- 💬 **Messaging and user discussions**
- 🔐 **Authentication and user management (JWT, OAuth)**

---

## 🏗 Tech Stack

### **Backend (Symfony/API Platform, REST API)**
- **Language**: PHP 8.3+
- **Framework**: Symfony 6.4 with API Platform
- **Web Server**: FrankenPHP (all-in-one PHP + web server)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT & OAuth2
- **Media Storage**: AWS S3 / Cloudinary
- **Testing**: PHPUnit
- **Deployment**: Docker, Kubernetes, Helm

### **Frontend Web (Next.js - TypeScript)**
- **Framework**: Next.js (React)
- **UI**: Tailwind CSS / Shadcn UI
- **State Management**: React Query
- **Mapping**: Google Maps API / Leaflet.js

### **Frontend Mobile (React Native - TypeScript)**
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **Mapping**: React Native Maps

### **Frontend Desktop (Tauri - React)**
- **Framework**: Tauri + React
- **UI**: Reused Next.js components

### **Infrastructure**
- **Orchestration**: Docker, Kubernetes
- **CI/CD**: GitHub Actions + ArgoCD
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

---

## 🔥 Installation & Deployment

### **Prerequisites**
Before installing the project, make sure you have:
- **Docker** and **Docker Compose** installed
- **Git** for cloning the repository

### **Run the project locally with Docker Compose**
```bash
# Clone the repository
git clone https://github.com/big-emotion/sport-app.git
cd sport-app

# Start all services with Docker Compose
docker-compose up --build -d

# Initialize the Symfony application (first time only)
docker-compose exec php composer create-project symfony/skeleton ./api
docker-compose exec php sh -c "cd api && composer require api symfony/orm-pack symfony/runtime"

# Setup the database and load initial data fixtures (optional)
docker-compose exec php sh -c "cd api && php bin/console doctrine:schema:create"
docker-compose exec php sh -c "cd api && php bin/console doctrine:fixtures:load --no-interaction"
```

This will start:
- **PostgreSQL** database
- **Symfony/API Platform backend** with FrankenPHP (all-in-one PHP + web server, based on symfony-docker)
- **Next.js Web Frontend**
- **React Native Mobile Frontend**
- **Tauri Desktop Frontend**

The first startup may take a few minutes as it installs all dependencies and sets up the database. The backend is powered by [symfony-docker](https://github.com/dunglas/symfony-docker) using FrankenPHP, a modern all-in-one PHP application server.

### **Access the Applications**
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
- **API Documentation**: [http://localhost:8080/api/docs](http://localhost:8080/api/docs)
- **Frontend Web (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **Frontend Mobile**: Access via Expo on [http://localhost:19000](http://localhost:19000)
- **Frontend Desktop**: Access on [http://localhost:1420](http://localhost:1420)

### **Verify Installation**
To verify that your installation is working correctly:
1. The backend should be accessible at [http://localhost:8080/api](http://localhost:8080/api)
2. The API documentation should be accessible at [http://localhost:8080/api/docs](http://localhost:8080/api/docs)
3. The web frontend should be accessible at [http://localhost:3000](http://localhost:3000)
4. Database is running on port 5432 (accessible within Docker network as `database:5432`)

### **Restoring Entities from Backup**
If you need to restore your existing entities and fixtures:
```bash
# Copy backup files to the appropriate locations in the Symfony application
cp -r /tmp/sport-app-backup/Entity/* /Users/jnk/Documents/Dev/sport-app/backend/api/src/Entity/
cp -r /tmp/sport-app-backup/DataFixtures/* /Users/jnk/Documents/Dev/sport-app/backend/api/src/DataFixtures/

# Update the database schema and load fixtures
docker-compose exec php sh -c "cd api && php bin/console doctrine:schema:update --force"
docker-compose exec php sh -c "cd api && php bin/console doctrine:fixtures:load --no-interaction"
```

---

## 📌 Roadmap & Upcoming Features
- 🔲 Integration of **notification system** 🔔
- 🔲 Adding an **offline mode for the mobile app**
- 🔲 Enhancing the **advanced search system** 📍

---

## 💡 Contributions & Contact
This project is **open-source**, and contributions are welcome!
- 👥 **Fork and PR** on **GitHub**
- 📩 Contact: [contact@big-emotion.com](mailto:contact@big-emotion.com)

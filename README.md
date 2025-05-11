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
- 🔐 **Authentication and user management**

---

## 🏗 Tech Stack

### **Backend (Symfony/API Platform, REST API)**
- **Language**: PHP 8.2+
- **Framework**: Symfony 7.2 with API Platform
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Testing**: PHPUnit
- **Deployment**: Docker

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
- **Deployment**: Docker Compose

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
```

This will start:
- **PostgreSQL** database
- **Next.js Web Frontend**
- **React Native Mobile Frontend**
- **Tauri Desktop Frontend**

The first startup may take a few minutes as it installs all dependencies.

### **Access the Applications**
- **Frontend Web (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **Frontend Mobile**: Access via Expo on [http://localhost:19000](http://localhost:19000)
- **Frontend Desktop**: Access on [http://localhost:1420](http://localhost:1420)

### **Working with the Backend**
The backend is a Symfony application located in the `backend/` directory. For development, you'll need to run the following commands directly on your local machine:

```bash
# Install dependencies
cd backend
composer install

# Set up the database schema
php bin/console doctrine:schema:create

# Load fixtures
php bin/console doctrine:fixtures:load --no-interaction

# Start the Symfony development server
symfony server:start --port=8080
```

Alternatively, you can use PHP's built-in web server:

```bash
cd backend
php -S localhost:8080 -t public/
```

Once started, you can access:
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
- **API Documentation**: [http://localhost:8080/api/docs](http://localhost:8080/api/docs)

### **Restoring Entities from Backup**
If you need to restore your existing entities and fixtures:
```bash
# Copy backup files to the appropriate locations in the Symfony application
cp -r /tmp/sport-app-backup/Entity/* /Users/jnk/Documents/Dev/sport-app/backend/src/Entity/
cp -r /tmp/sport-app-backup/DataFixtures/* /Users/jnk/Documents/Dev/sport-app/backend/src/DataFixtures/

# Update the database schema and load fixtures
cd backend
php bin/console doctrine:schema:update --force
php bin/console doctrine:fixtures:load --no-interaction
```

### **Setting up API Endpoints**
The API uses API Platform and is configured to provide the following endpoints:
- Venues (/api/sport_places)
- Sports (/api/sports)
- Events (/api/events)
- Reviews (/api/reviews)
- Users (/api/users)
- And more...

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
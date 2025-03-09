# **Sport-App** 🏆

## 🌍 Overview
**Sport-App** is a platform that allows users to **locate and explore sports venues** around them.
Each venue can be associated with one or more sports (basketball, football, running, etc.), and users can **add new sports, post content (videos, comments), and interact with each other**.

The application is available in multiple versions:
- **Web** (Next.js)
- **Mobile** (React Native)
- **Desktop** (Tauri)

The **backend is built with Spring Boot** and exposes a **REST API** to interact with all functionalities.

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

### **Backend (Spring Boot, REST API)**
- **Language**: Java 17+
- **Framework**: Spring Boot (Spring Web, Spring Security, Spring Data JPA)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT & OAuth2
- **Media Storage**: AWS S3 / Cloudinary
- **Testing**: JUnit + Mockito
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
- **Node.js** and **npm/yarn**
- **Java 17+** and **Maven**

### **Run the project locally with Docker Compose**
```bash
git clone https://github.com/kooljo/sport-app.git
cd sport-app
docker-compose up --build -d
```
This will start **PostgreSQL, the Spring Boot backend, and all frontend applications**.

### **Access the Applications**
- **REST API (Swagger UI)**: [http://localhost:8080/swagger-ui](http://localhost:8080/swagger-ui)
- **Frontend Web (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **Frontend Mobile**: Run via Expo
- **Frontend Desktop**: Run with `npm tauri dev`

---

## 📌 Roadmap & Upcoming Features
- 🔲 Integration of **notification system** 🔔
- 🔲 Adding an **offline mode for the mobile app**
- 🔲 Enhancing the **advanced search system** 📍

---

## 💡 Contributions & Contact
This project is **open-source**, and contributions are welcome!
- 👥 **Fork and PR** on **GitHub**
- 📩 Contact: [kollojeannoe@gmail.com](mailto:kollojeannoe@gmail.com)
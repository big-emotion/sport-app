# **Architecture du projet - Sport-App**

## 📌 **Vue d'ensemble**
Sport-App est une plateforme full-stack permettant aux utilisateurs de localiser des lieux sportifs, d'ajouter des sports, de publier du contenu et d'échanger entre eux.

L'application est composée de plusieurs modules :
- **Backend** : API REST avec Spring Boot
- **Frontend Web** : Next.js
- **Frontend Mobile** : React Native
- **Frontend Desktop** : Tauri
- **Base de données** : PostgreSQL
- **Infrastructure** : Docker, Kubernetes, CI/CD

---

## 🏗 **Architecture générale**
```
📦 sport-app
├── 📁 backend (Spring Boot API)
│   ├── src/
│   ├── pom.xml
│   ├── application.yml
│   └── Dockerfile
│
├── 📁 frontend-web (Next.js)
│   ├── pages/
│   ├── components/
│   ├── package.json
│   ├── .env.local
│   └── Dockerfile
│
├── 📁 frontend-mobile (React Native)
│   ├── src/
│   ├── assets/
│   ├── package.json
│   └── .env
│
├── 📁 frontend-desktop (Tauri)
│   ├── src-tauri/
│   ├── package.json
│   ├── tauri.conf.json
│   └── .env
│
├── 📁 infra (Infrastructure)
│   ├── docker-compose.yml
│   ├── kubernetes/
│   ├── helm/
│   ├── github-actions/
│   └── monitoring/
│
├── 📁 docs (Documentation)
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   └── README.md
```

---

## 🔹 **Backend (Spring Boot)**
- **Langage** : Java 17+
- **Framework** : Spring Boot (Spring Web, Security, Data JPA)
- **Base de données** : PostgreSQL
- **Cache** : Redis
- **Auth** : JWT & OAuth2
- **Stockage des médias** : AWS S3 / Cloudinary
- **Tests** : JUnit + Mockito
- **Déploiement** : Docker, Kubernetes, Helm

---

## 🔹 **Frontend Web (Next.js)**
- **Framework** : Next.js (React, TypeScript)
- **UI** : Tailwind CSS, Shadcn UI
- **State Management** : React Query
- **Cartographie** : Google Maps API / Leaflet.js

---

## 🔹 **Frontend Mobile (React Native)**
- **Framework** : React Native (Expo)
- **Navigation** : React Navigation
- **State Management** : Redux Toolkit
- **Cartographie** : React Native Maps

---

## 🔹 **Frontend Desktop (Tauri)**
- **Framework** : Tauri + React
- **UI** : Composants recyclés de Next.js

---

## 🔹 **Infrastructure & Déploiement**
- **Orchestration** : Docker, Kubernetes
- **CI/CD** : GitHub Actions + ArgoCD
- **Monitoring** : Prometheus + Grafana
- **Logging** : ELK Stack (Elasticsearch, Logstash, Kibana)

---

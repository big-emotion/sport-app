# **Project Architecture - Sport-App**

## 📌 **Overview**
Sport-App is a full-stack platform that allows users to locate sports venues, add sports, publish content, and interact with each other.

The application is composed of multiple modules:
- **Backend**: REST API with Spring Boot
- **Frontend Web**: Next.js
- **Frontend Mobile**: React Native
- **Frontend Desktop**: Tauri
- **Database**: PostgreSQL
- **Infrastructure**: Docker, Kubernetes, CI/CD

---

## 🏗 **General Architecture**
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
- **Language**: Java 17+
- **Framework**: Spring Boot (Spring Web, Security, Data JPA)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: JWT & OAuth2
- **Media Storage**: AWS S3 / Cloudinary
- **Testing**: JUnit + Mockito
- **Deployment**: Docker, Kubernetes, Helm

---

## 🔹 **Frontend Web (Next.js)**
- **Framework**: Next.js (React, TypeScript)
- **UI**: Tailwind CSS, Shadcn UI
- **State Management**: React Query
- **Mapping**: Google Maps API / Leaflet.js

---

## 🔹 **Frontend Mobile (React Native)**
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **Mapping**: React Native Maps

---

## 🔹 **Frontend Desktop (Tauri)**
- **Framework**: Tauri + React
- **UI**: Reused Next.js components

---

## 🔹 **Infrastructure & Deployment**
- **Orchestration**: Docker, Kubernetes
- **CI/CD**: GitHub Actions + ArgoCD
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

---
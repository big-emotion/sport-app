# **Sport-App** 🏆

## 🌍 Présentation
**Sport-App** est une plateforme permettant aux utilisateurs de **localiser et explorer des lieux sportifs** autour d’eux.
Chaque lieu peut être associé à un ou plusieurs sports (basket, football, running, etc.), et les utilisateurs peuvent **ajouter des sports, publier du contenu (vidéos, commentaires) et discuter entre eux**.

L’application est déclinée en plusieurs versions :
- **Web** (Next.js)
- **Mobile** (React Native)
- **Desktop** (Tauri)

Le **backend est développé avec Spring Boot** et expose une **API REST** pour interagir avec l’ensemble des fonctionnalités.

---

## 🚀 Fonctionnalités principales
- 📍 **Localisation des lieux sportifs**
- 📄 **Fiches détaillées des lieux** (sports associés, avis, photos, vidéos)
- ➕ **Ajout de nouveaux sports par la communauté**
- 🔖 **Distinction entre sports officiels et ajoutés par la communauté**
- 📢 **Publication de vidéos, commentaires sur chaque sport/lieu**
- 💬 **Messagerie et discussions entre utilisateurs**
- 🔐 **Authentification et gestion des utilisateurs (JWT, OAuth)**

---

## 🏗 Stack technique

### **Backend (Spring Boot, API REST)**
- **Langage** : Java 17+
- **Framework** : Spring Boot (Spring Web, Spring Security, Spring Data JPA)
- **Base de données** : PostgreSQL
- **Cache** : Redis
- **Authentification** : JWT & OAuth2
- **Stockage des médias** : AWS S3 / Cloudinary
- **Tests** : JUnit + Mockito
- **Déploiement** : Docker, Kubernetes, Helm

### **Frontend Web (Next.js - TypeScript)**
- **Framework** : Next.js (React)
- **UI** : Tailwind CSS / Shadcn UI
- **Gestion des états** : React Query
- **Cartographie** : Google Maps API / Leaflet.js

### **Frontend Mobile (React Native - TypeScript)**
- **Framework** : React Native (Expo)
- **Navigation** : React Navigation
- **State Management** : Redux Toolkit
- **Cartographie** : React Native Maps

### **Frontend Desktop (Tauri - React)**
- **Framework** : Tauri + React
- **UI** : Recyclage des composants Next.js

### **Infrastructure**
- **Orchestration** : Docker, Kubernetes
- **CI/CD** : GitHub Actions + ArgoCD
- **Monitoring** : Prometheus + Grafana
- **Logging** : ELK Stack (Elasticsearch, Logstash, Kibana)

---

## 🔥 Installation & Déploiement

### **Prérequis**
Avant d’installer le projet, assure-toi d’avoir :
- **Docker** et **Docker Compose** installés
- **Node.js** et **npm/yarn**
- **Java 17+** et **Maven**

### **Lancer le projet en local avec Docker Compose**
```bash
git clone https://github.com/kooljo/sport-app.git
cd sport-app
docker-compose up --build -d
```
Cela va lancer **PostgreSQL, le backend Spring Boot, et les applications frontend**.

### **Accès aux applications**
- **API REST (Swagger UI)** : [http://localhost:8080/swagger-ui](http://localhost:8080/swagger-ui)
- **Frontend Web (Next.js)** : [http://localhost:3000](http://localhost:3000)
- **Frontend Mobile** : à lancer via Expo
- **Frontend Desktop** : à lancer via `npm tauri dev`

---

## 📌 Roadmap & Prochaines Fonctionnalités
- 🔲 Intégration d'un **système de notifications** 🔔
- 🔲 Ajout d'un **mode hors ligne pour l’application mobile**
- 🔲 Amélioration du **système de recherche avancée** 📍

---

## 💡 Contributions & Contact
Ce projet est **open-source**, toute contribution est la bienvenue !
- 👥 **Fork et PR** sur **GitHub**
- 📩 Contact : [kollojeannoe@gmail.com](mailto:kollojeannoe@gmail.com)


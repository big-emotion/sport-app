# **Roadmap du projet - Sport-App**

## 📌 Objectif général
Sport-App est une plateforme qui permet aux utilisateurs de **localiser et explorer des lieux sportifs**, **ajouter des sports**, **publier du contenu** et **interagir avec d'autres utilisateurs**.

Cette roadmap décrit les différentes étapes de développement et les améliorations futures.

---

## 🚀 **Phase 1 - Mise en place des bases (MVP)** ✅ (En cours)
### **Backend** (Spring Boot)
- [x] Mise en place du projet Spring Boot
- [x] Configuration PostgreSQL et connexion avec JPA
- [x] Création des entités principales (Lieux, Sports, Utilisateurs)
- [x] Développement de l'API REST pour la gestion des lieux et des sports
- [ ] Ajout de l'authentification JWT
- [ ] Gestion des rôles (utilisateurs/admins)
- [ ] Documentation API avec Swagger

### **Frontend Web** (Next.js)
- [x] Initialisation du projet Next.js
- [x] Configuration TypeScript et Tailwind CSS
- [x] Affichage de la liste des lieux sportifs depuis l'API
- [ ] Système de recherche avancée (filtrage par sport/localisation)
- [ ] Page de détail d'un lieu avec ses sports associés

### **Frontend Mobile** (React Native)
- [x] Initialisation du projet React Native
- [ ] Connexion à l'API Spring Boot
- [ ] Affichage des lieux sportifs sur une carte
- [ ] Gestion de l’authentification (JWT)

### **Frontend Desktop** (Tauri)
- [x] Initialisation du projet Tauri
- [ ] Intégration de l'API REST
- [ ] UI de gestion des lieux sportifs

### **Infrastructure**
- [x] Création d'un `docker-compose.yml` pour faciliter le développement local
- [ ] Mise en place d’un pipeline CI/CD avec GitHub Actions
- [ ] Déploiement du backend sur Kubernetes

---

## 🔥 **Phase 2 - Améliorations et fonctionnalités avancées**
- [ ] Ajout des **posts et commentaires** sur les sports
- [ ] Intégration des **notifications en temps réel** (WebSockets)
- [ ] Ajout d'un **système de messagerie entre utilisateurs**
- [ ] Gestion des **médias (upload de photos/vidéos)**
- [ ] Optimisation de la performance backend (caching avec Redis)
- [ ] Support du **mode hors ligne** sur mobile

---

## 🎯 **Phase 3 - Scalabilité et expansion**
- [ ] Hébergement cloud (AWS/GCP)
- [ ] Support multi-langues
- [ ] Amélioration du référencement SEO
- [ ] Application PWA pour le web
- [ ] Version Bêta publique

---

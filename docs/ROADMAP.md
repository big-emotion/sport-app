# **Project Roadmap - Sport-App**

## 📌 General Objective
Sport-App is a platform that allows users to **locate and explore sports venues**, **add sports**, **publish content**, and **interact with other users**.

This roadmap outlines the various development stages and future improvements.

---

## 🚀 **Phase 1 - Initial Setup (MVP)** ✅ (In Progress)
### **Backend** (Spring Boot)
- [x] Set up the Spring Boot project
- [x] Configure PostgreSQL and connect with JPA
- [x] Create main entities (Locations, Sports, Users)
- [x] Develop the REST API for managing locations and sports
- [ ] Add JWT authentication
- [ ] Implement role management (users/admins)
- [ ] API documentation with Swagger

### **Frontend Web** (Next.js)
- [x] Initialize the Next.js project
- [x] Configure TypeScript and Tailwind CSS
- [x] Display the list of sports venues from the API
- [ ] Advanced search system (filter by sport/location)
- [ ] Venue details page with associated sports

### **Frontend Mobile** (React Native)
- [x] Initialize the React Native project
- [ ] Connect to the Spring Boot API
- [ ] Display sports venues on a map
- [ ] Implement authentication (JWT)

### **Frontend Desktop** (Tauri)
- [x] Initialize the Tauri project
- [ ] Integrate the REST API
- [ ] Develop UI for managing sports venues

### **Infrastructure**
- [x] Create `docker-compose.yml` for easy local development
- [ ] Set up CI/CD pipeline with GitHub Actions
- [ ] Deploy backend on Kubernetes

---

## 🔥 **Phase 2 - Enhancements and Advanced Features**
- [ ] Add **posts and comments** on sports
- [ ] Integrate **real-time notifications** (WebSockets)
- [ ] Implement **user messaging system**
- [ ] Manage **media uploads (photos/videos)**
- [ ] Optimize backend performance (caching with Redis)
- [ ] Support **offline mode** on mobile

---

## 🎯 **Phase 3 - Scalability and Expansion**
- [ ] Cloud hosting (AWS/GCP)
- [ ] Multi-language support
- [ ] Improve SEO optimization
- [ ] Implement PWA for web application
- [ ] Public Beta release

---

# **Project Roadmap - Sport-App**

## 📌 General Objective
Sport-App is a platform that allows users to **locate and explore sports venues**, **add sports**, **publish content**, and **interact with other users**.

This roadmap outlines the various development stages and future improvements.

---

## 🚀 **Phase 1 - Initial Setup (MVP)** ✅ (In Progress)
### **Backend** (Symfony/PHP)
- [x] Set up the Symfony project
- [x] Configure PostgreSQL and connect with Doctrine ORM
- [x] Create main entities (Locations, Sports, Users)
- [x] Develop the REST API for managing locations and sports
- [ ] Add JWT authentication
- [ ] Implement role management (users/admins)
- [ ] Create location-based venue API endpoints
- [ ] API documentation with Swagger/OpenAPI

### **Frontend Web** (Next.js)
- [x] Initialize the Next.js project
- [x] Configure TypeScript and Tailwind CSS
- [x] Display the list of sports venues from the API
- [ ] Implement JWT authentication and user sessions
- [ ] Display sports venues on an interactive map (core feature)
- [ ] Implement user location detection
- [ ] Advanced search system (filter by sport/location/proximity)
- [ ] Venue details page with associated sports
- [ ] Implement responsive design for all devices

### **Frontend Mobile** (React Native/Expo)
- [x] Initialize the React Native project
- [ ] Connect to the Symfony API
- [ ] Display sports venues on a map with native map services
- [ ] Implement user location services with native GPS
- [ ] Implement authentication (JWT)
- [ ] Develop venue detail views and user interactions

### **Frontend Desktop** (Tauri)
- [x] Initialize the Tauri project
- [ ] Integrate the REST API
- [ ] Develop UI for managing sports venues
- [ ] Implement map visualization for venues

### **Infrastructure**
- [x] Create `docker-compose.yml` for easy local development
- [x] Set up deployment workflow with GitHub Actions
- [ ] Deploy backend on cloud platform
- [ ] Configure CDN for static assets and media

---

## 🔥 **Phase 2 - Enhancements and Advanced Features**
- [ ] Add **posts and comments** on sports venues
- [ ] Implement user ratings and reviews for venues
- [ ] Integrate **real-time notifications** (WebSockets)
- [ ] Implement **user messaging system**
- [ ] Manage **media uploads (photos/videos)** for venues and sports
- [ ] Optimize backend performance (caching with Redis)
- [ ] Support **offline mode** on mobile
- [ ] Add venue filtering by operating hours and facilities

---

## 🎯 **Phase 3 - Scalability and Expansion**
- [ ] Cloud hosting (AWS/GCP)
- [ ] Multi-language support
- [ ] Improve SEO optimization
- [ ] Implement PWA for web application
- [ ] Add social sharing functionalities
- [ ] Integrate with third-party sports APIs and calendars
- [ ] Public Beta release

---

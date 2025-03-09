# **REST API Documentation - Sport-App**

## 📌 Introduction
The **Sport-App** REST API allows managing sports locations, sports, users, and interactions between them.

Base URL: `http://localhost:8080/api`

## 🔐 **Authentication**
Authentication is handled via **JWT** (JSON Web Token).

- **Register**: `POST /auth/register`
- **Login**: `POST /auth/login`
- **User Profile**: `GET /users/me` (requires a valid JWT)

## 📍 **Sports Locations Management**
### ➡️ **List all sports locations**
**GET** `/sport-locations`
#### 📄 Response:
```json
[
  {
    "id": 1,
    "name": "Stade de France",
    "address": "Paris, France",
    "sportType": "Football"
  }
]
```

### ➡️ **Add a sports location**
**POST** `/sport-locations`
#### 📥 Request Body:
```json
{
  "name": "Gymnase Voltaire",
  "address": "Lyon, France",
  "sportType": "Basketball"
}
```

### ➡️ **Delete a sports location**
**DELETE** `/sport-locations/{id}`

## 🏆 **Sports Management**
### ➡️ **List all sports**
**GET** `/sports`

### ➡️ **Add a sport** (authentication required)
**POST** `/sports`
#### 📥 Request Body:
```json
{
  "name": "Tennis",
  "description": "Popular racket sport."
}
```

## 💬 **Discussion & Posts System**
### ➡️ **Create a post about a sport**
**POST** `/sports/{id}/posts`
#### 📥 Request Body:
```json
{
  "content": "Great match today at Gymnase Voltaire!",
  "mediaUrl": "https://url-of-the-video.com"
}
```

### ➡️ **Comment on a post**
**POST** `/posts/{id}/comments`

---

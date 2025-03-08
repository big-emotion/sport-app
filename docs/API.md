# **Documentation de l'API REST - Sport-App**

## 📌 Introduction
L'API REST de **Sport-App** permet de gérer les lieux sportifs, les sports, les utilisateurs et les interactions entre eux.

Base URL : `http://localhost:8080/api`

## 🔐 **Authentification**
L'authentification se fait via **JWT** (JSON Web Token). 

- **Inscription** : `POST /auth/register`
- **Connexion** : `POST /auth/login`
- **Profil utilisateur** : `GET /users/me` (requiert un JWT valide)

## 📍 **Gestion des lieux sportifs**
### ➡️ **Lister tous les lieux sportifs**
**GET** `/sport-locations`
#### 📄 Réponse :
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

### ➡️ **Ajouter un lieu sportif**
**POST** `/sport-locations`
#### 📥 Corps de la requête :
```json
{
  "name": "Gymnase Voltaire",
  "address": "Lyon, France",
  "sportType": "Basketball"
}
```

### ➡️ **Supprimer un lieu sportif**
**DELETE** `/sport-locations/{id}`

## 🏆 **Gestion des sports**
### ➡️ **Lister tous les sports**
**GET** `/sports`

### ➡️ **Ajouter un sport** (requiert authentification)
**POST** `/sports`
#### 📥 Corps de la requête :
```json
{
  "name": "Tennis",
  "description": "Sport de raquette populaire."
}
```

## 💬 **Système de discussion & posts**
### ➡️ **Créer un post sur un sport**
**POST** `/sports/{id}/posts`
#### 📥 Corps de la requête :
```json
{
  "content": "Super match aujourd'hui au gymnase Voltaire!",
  "mediaUrl": "https://url-de-la-video.com"
}
```

### ➡️ **Commenter un post**
**POST** `/posts/{id}/comments`

---
# 🚤 Port de Plaisance Russell

API REST pour la gestion des catways et reservations

## 📋 Prérequis

- Node.js
- MongoDB
- npm

## 🚀 Installation

# Cloner le projet
gh repo clone IdhZY/port-plaisance-russell
cd port-plaisance-russell

# Installer les dépendances
npm install

Créer un fichier `.env` :

PORT=3000
MONGODB_URI=mongodb://localhost:27017/port-russell
JWT_SECRET=votre_secret_jwt

# Mode développement
npm run dev

# Mode production
npm start

## API

## Authentification

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |

## Utilisateurs

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/users` | Liste des utilisateurs |
| GET | `/api/users/:id` | Détail d'un utilisateur |
| PUT | `/api/users/:id` | Modifier un utilisateur |
| DELETE | `/api/users/:id` | Supprimer un utilisateur |

## Catways

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/catways` | Liste des catways |
| GET | `/api/catways/:id` | Détail d'un catway |
| POST | `/api/catways` | Créer un catway |
| PUT | `/api/catways/:id` | Modifier un catway |
| DELETE | `/api/catways/:id` | Supprimer un catway |

## Réservations

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/catways/:id/reservations` | Réservations d'un catway |
| POST | `/api/catways/:id/reservations` | Créer une réservation |
| DELETE | `/api/catways/:id/reservations/:idReservation` | Supprimer une réservation |

## Exemples d'utilisation

## Créer un catway

curl -X POST http://localhost:3000/api/catways \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"catwayNumber": 1, "type": "long", "catwayState": "Bon état"}'

## Créer une réservation

curl -X POST http://localhost:3000/api/catways/1/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "clientName": "Jean Dupont",
    "boatName": "Le Navigateur",
    "startDate": "2026-07-01",
    "endDate": "2026-07-15"
  }'
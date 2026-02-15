# ChatFlow

**ChatFlow** est une plateforme de messagerie instantanée en temps réel inspirée de Discord.
Elle permet aux utilisateurs de créer des serveurs, d'organiser des discussions par salons (*channels*)
et d'échanger des messages instantanément grâce à une architecture robuste basée sur les WebSockets.

Ce projet met en œuvre une architecture complète séparant le **Frontend**, le **Backend** et la **Base de données**,
tout en intégrant des technologies modernes de communication temps réel (RTC).

---

## Fonctionnalités

### Authentification & Utilisateurs

- **Inscription et Connexion** : système sécurisé avec hachage des mots de passe via Bcrypt.
- **Sécurité JWT** : utilisation de JSON Web Tokens pour sécuriser les sessions et les échanges API.
- **Persistance des données** : stockage des utilisateurs dans PostgreSQL.

---

### Gestion des Serveurs

- Création de serveurs.
- Système d'invitation avec génération de codes uniques.
- Gestion des membres : rejoindre, quitter ou supprimer un serveur.

---

### Communication Temps Réel

- **Salons multiples** : création et suppression de channels textuels.
- **Messagerie instantanée** via Socket.IO.
- **Notifications système** lors de l'arrivée ou du départ d'un utilisateur.
- **Indicateur de frappe** (*"Augustin est en train d'écrire…"*).
- **Liste des connectés** en temps réel.

---

## Stack Technique

### Frontend

| Élément          | Technologie            |
|------------------|------------------------|
| Framework        | Next.js 16 (App Router)|
| Langage          | TypeScript             |
| Style            | Tailwind CSS           |
| WebSocket Client | socket.io-client       |

### Backend

| Élément          | Technologie            |
|------------------|------------------------|
| Runtime          | Node.js                |
| Framework        | Express.js             |
| Temps réel       | Socket.IO              |
| Authentification | jsonwebtoken (JWT)     |
| Hashing          | bcrypt                 |

### Data & DevOps

| Élément           | Technologie         |
|-------------------|---------------------|
| Base de données   | PostgreSQL 16       |
| Administration    | PGAdmin 4           |
| Conteneurisation  | Docker & Compose    |

---

## Architecture du Projet

```
/
├── back/        → API REST + serveur Socket.IO
├── front/       → Interface utilisateur Next.js
└── DataBase/    → Scripts SQL d'initialisation
```

---

## Installation & Déploiement

### Prérequis

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

### Démarrage rapide

**1. Cloner le projet**

```bash
git clone https://github.com/LaFicelleCmoi/RTC-Projet.git
cd RTC-Projet
```

**2. Lancer les conteneurs**

```bash
docker compose up --build -d
```

**3. Vérifier les logs**

```bash
docker compose logs -f back
```

**4. Arrêter les services**

```bash
docker compose down -v
```

---

## Accès aux Services

| Service      | URL                    |
|--------------|------------------------|
| Frontend     | http://localhost:3000  |
| Backend API  | http://localhost:3001  |
| PGAdmin      | http://localhost:5050  |

> Pour PGAdmin :
> - **Email** : voir la variable `PGADMIN_EMAIL` dans `.env`
> - **Password** : voir la variable `PGADMIN_PASSWORD` dans `.env`

---

## Modèle de Données

La base relationnelle s'organise autour de 4 tables principales :

| Table           | Description                                                       |
|-----------------|-------------------------------------------------------------------|
| `users`         | Stocke les informations de connexion (nom, email, mot de passe haché). |
| `servers`       | Informations des serveurs (nom, propriétaire, code d'invitation). |
| `users_servers` | Table de liaison entre utilisateurs et serveurs.                  |
| `channels`      | Salons de discussion associés à un serveur.                       |

---

## Auteurs

- **Viemont Augustin** Lien GitHub : https://github.com/Augustin734
- **Perles Olysse**    Lien GitHub : https://github.com/S6leak
- **Viscione Clyde**   Lien GitHub : https://github.com/ClydeViscione
- **Clerc Lois**

---

## Dépôt GitHub

[https://github.com/LaFicelleCmoi/RTC-Projet](https://github.com/LaFicelleCmoi/RTC-Projet)

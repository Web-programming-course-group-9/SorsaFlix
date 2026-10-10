<div align="center">
  <img src="src/assets/logo.svg" alt="Project logo" width="200">
</div>

# Sorsaflix - movie review and search web-application

## This application is assignment for OAMK Web Development Course
### Team members:
- Antti Buller   
- Elmo Lehtosaari  
- Jere Peltola  
- Jussi Mitteli  

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React                         |
| Backend  | Node.js                       |
| Database | PostgreSQL                    |
| Data     | [TMDB API](https://www.themoviedb.org) |
| Environment | Docker and Docker Compose |

## Introduction
This application is part of Oulu University of Applied Sciences Web development course. Goal of this project is to develop a web application consisting of frontend built using React, Node.js backend and a PostgreSQL database.

SorsaFlix is a web application for movie enthusiasts. Users can search movies and series, see what is playing in Finnish theaters, read and write reviews, create a favorites list and create groups with other users. Movie data comes from The Movie Database (TMDB) API.

Functionality of the app includes several features including the following:

| ID  | Feature                    | Status  |
|:---:|:---------------------------|:-------:|
| 1   | Responsiveness             | ⬜      |
| 2   | Registration               | ✅      |
| 3   | Login                      | ✅      |
| 4   | Account deletion           | ✅      |
| 5   | Search                     | ✅      |
| 6   | Now in theaters            | ✅      |
| 7   | Group page                 | ✅      |
| 8   | Adding a member            | ✅      |
| 9   | Removing a member          | ✅      |
| 10  | Group page customization   | ✅      |
| 11  | Movie review               | ✅      |
| 12  | Browsing reviews           | ✅      |
| 13  | Favorites list             | ✅      |
| 14  | Sharing the favorites list | ✅      |
| 15  | Free-choice feature        | ✅      |

## 1. How to Run

The application runs in three Docker containers: frontend (React/Vite), backend (Node.js/Express) and database (PostgreSQL).

### Requirements
- Docker and Docker Compose
- TMDB API Read Access Token

### Steps
1. Clone the repository: `git clone https://github.com/Web-programming-course-group-9/SorsaFlix.git`
2. Copy `.env.example` to `.env` in the project root and fill in the values (see section 2).
3. Start all containers: `docker compose up --build`
4. Open the application: `http://localhost:5173`
5. Stop the containers: `docker compose down`

The database tables are created automatically from `server/db/schema.sql` when the database container starts for the first time.

Changes to `.env` or `vite.config.js` require a container restart, for example `docker compose restart backend`.

## 2. Environment Variables

Variables are defined in `.env` in the project root. `.env.example` lists the required variables. The real `.env` file must never be pushed to GitHub.

| Variable | Purpose |
|---|---|
| VITE_API_URL | Backend address for the frontend |
| FRONTEND_PORT | Frontend port inside the container |
| NODE_ENV | Run mode (development) |
| PORT | Backend port inside the container |
| ALLOWED_ORIGINS | Addresses allowed to call the backend (CORS), separated by commas |
| BACKEND_EXPOSED_PORT | Backend port on the host machine |
| FRONTEND_EXPOSED_PORT | Frontend port on the host machine |
| DB_EXPOSED_PORT | Database port on the host machine |
| DB_PORT | Database port inside the container |
| POSTGRES_DB | Database name |
| POSTGRES_USER | Database user |
| POSTGRES_PASSWORD | Database password |
| DATABASE_URL | Connection string the backend uses to connect to the database |
| TMDB_TOKEN | TMDB API Read Access Token |
| JWT_SECRET | Secret key used to sign and verify access tokens |

## 3. Documentation

- [Frontend](src/README.md) – React structure, pages and components
- [Backend](server/README.md) – folder structure, REST API and tests
- [Database](server/db/README.md) – tables and class diagram
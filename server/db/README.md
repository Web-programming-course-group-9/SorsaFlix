# Database

## 1. Overview

The application uses a PostgreSQL database running in a Docker container. The tables are created automatically from `schema.sql` when the database container starts for the first time.

Movie data is not stored in the database. Tables that refer to movies store only the TMDB movie id (`movie_id`).

## 2. Class diagram

[Insert class diagram image from pgAdmin ERD Tool here]

## 3. Tables

| Table | Purpose |
|---|---|
| users | Registered user accounts |
| refresh_tokens | Hashed refresh tokens for staying logged in |
| groups | User-created groups |
| group_members | Group memberships and join requests |
| group_movies | Movies added to groups |
| favorites | Users' favorite movies |
| reviews | Movie reviews |

All foreign keys referencing `users` and `groups` use `ON DELETE CASCADE`. When a user is deleted, their groups, memberships, favorites and reviews are deleted too.

## 4. Table details

### 4.1 group_members.status

A new join request gets the status `pending`. When the group owner accepts the request, the status changes to `accepted`. Only accepted members can view the group page and add movies. Unique (group_id, user_id) prevents duplicate join requests.

### 4.2 group_movies

| Column | Type | Description |
|---|---|---|
| id | serial | Primary key |
| group_id | integer | Foreign key → groups.id, ON DELETE CASCADE |
| movie_id | integer | TMDB movie id |

Unique (group_id, movie_id): the same movie cannot be added twice to the same group.
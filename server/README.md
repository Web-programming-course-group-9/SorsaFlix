# Backend

## 1. Structure

```
server/
  index.js        Starts Express, sets CORS and connects the routers
  db/             Database connection and schema
  middleware/
    auth.js       Login token check
  routes/         Connects URLs to controller functions
  controller/     Checks input and sends the response
  models/         Database queries and TMDB API calls
  test/           Mocha/Chai tests
```

The backend follows the MVC structure. A request goes from `routes/` to `controller/` to `models/`, and the result is returned as JSON.

| Router | Path prefix |
|---|---|
| authRouter.js | /auth |
| movieRouter.js | /movies |
| serieRouter.js | /series |
| reviewRouter.js | /reviews |
| favoriteRouter.js | /favorites |
| groupRouter.js | /groups |

## 2. Database connection

`db/index.js` creates one shared connection pool using `DATABASE_URL`. The models import it and run their queries with `pool.query()`.

## 3. Login check (middleware)

`middleware/auth.js` contains `requireAuth`, which protects routes that require login.

- Reads the token from the `Authorization: Bearer <token>` header
- Verifies the token with `JWT_SECRET`
- If the token is valid, saves the user's id and username to `req.user` and lets the request continue
- If the token is missing or invalid, returns 401

## 4. Features and files

Feature IDs follow the work instruction.

| ID | Feature | Files |
|---|---|---|
| 4 | Account deletion | `routes/authRouter.js`, `controller/authController.js` (deleteAccount), `models/userModel.js` (deleteUserById) |
| 7 | Deleting a group | `routes/groupRouter.js`, `controller/groupController.js` (removeGroup), `models/groupModel.js` (deleteGroup) |
| 8 | Sending a join request | `routes/groupRouter.js`, `controller/groupController.js` (sendJoinRequest), `models/groupModel.js` (addJoinRequest) |
| 10 | Adding a movie to a group | `routes/groupRouter.js`, `controller/groupController.js` (addMovieToGroup, listMyGroups), `models/groupModel.js` (addGroupMovie, getGroupMovies, getUserGroups) |
| 12 | Browsing reviews | `routes/reviewRouter.js`, `controller/reviewController.js` (getMovieReviews), `models/reviewModel.js` (getReviewsByMovie) |

Functions whose purpose is not clear from the name:

- `deleteGroup(groupId, userId)`: deletes the group only if the user is its owner. Memberships and movies of the group are deleted automatically (CASCADE).
- `getUserGroups(userId)`: returns only groups where the user is an accepted member. Used in the "add to group" menu.
- `getReviewsByMovie(movieId)`: returns the reviews of one movie, newest first, with the reviewer's username.

## 5. REST API

All responses are JSON. "Login: yes" means the request needs the header `Authorization: Bearer <token>`.

### 5.1 DELETE /auth/account

Deletes the logged-in user's account. The id comes from the token, so a user can delete only their own account. The user's groups, memberships, favorites and reviews are deleted automatically (CASCADE).

- Login: yes
- Body: none
- 200: `{ "message": "Account deleted successfully" }`
- 401: token missing or invalid
- 404: user not found

### 5.2 DELETE /groups/:groupId

Deletes a group. Only the owner can delete it.

- Login: yes
- Body: none
- 204: group deleted
- 400: invalid group id
- 401: token missing or invalid
- 404: group not found or user is not the owner

### 5.3 POST /groups/:groupId/join

Sends a join request to a group. The request gets the status `pending`.

- Login: yes
- Body: none
- 201: `{ "id": 7, "group_id": 3, "user_id": 11, "status": "pending" }`
- 400: invalid group id
- 401: token missing or invalid
- 404: group not found
- 409: join request already sent or user is already a member

### 5.4 POST /groups/:id/movies

Adds a movie to a group. Only accepted members can add movies.

- Login: yes
- Body: `{ "movie_id": 550 }`
- 201: `{ "id": 4, "group_id": 3, "movie_id": 550 }`
- 400: invalid group id or movie id
- 401: token missing or invalid
- 403: user is not a member of the group
- 409: movie already added to the group

### 5.5 GET /groups/my

Returns the groups the logged-in user is a member of.

- Login: yes
- Body: none
- 200: `[ { "id": 3, "name": "Friday movies" } ]`
- 401: token missing or invalid

### 5.6 GET /reviews/movie/:movieId

Returns all reviews of one movie, newest first. Returns an empty list `[]` if there are no reviews.

- Login: no
- Body: none
- 200: `[ { "id": 1, "movie_id": 550, "review_text": "Great movie.", "stars": 5, "created_at": "2026-09-23T10:15:00.000Z", "username": "peperavo" } ]`

## 6. Tests

Run the tests in the `server` folder with `npm test`. The backend must be running.

| File | Test | Expected result |
|---|---|---|
| authRouter.test.js | Account deletion without a token | 401 |
| authRouter.test.js | Account deletion with a valid token | Account is deleted |
| reviewRouter.test.js | Reviews for a movie | 200 and a list |
| reviewRouter.test.js | Reviews for a movie with no reviews | 200 and an empty list |
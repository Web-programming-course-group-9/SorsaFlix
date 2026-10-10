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

The backend follows the MVC structure. A request goes from `routes/` to `controller/` to `models/`, and the result is returned as JSON. TMDB list and search routes are an exception: they call the TMDB API directly in the router file.

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

Login uses two tokens:

- Access token (JWT): valid for 15 minutes, sent in the `Authorization` header
- Refresh token: valid for 7 days, stored in an httpOnly cookie and used to get a new access token

## 4. Features and files

Feature IDs follow the work instruction. File paths are relative to `server/`.

| ID | Feature | Files |
|---|---|---|
| 1 | Responsiveness | No backend files. See [Frontend README](../src/README.md) |
| 2 | Registration | `routes/authRouter.js`, `controller/authController.js` (register), `models/userModel.js` (findUserByEmailOrUsername, insertUser) |
| 3 | Login | `routes/authRouter.js`, `controller/authController.js` (login), `models/userModel.js` (findUserByEmail), `models/refreshTokenModel.js` (insertRefreshToken) |
| 3 | Logout | `routes/authRouter.js`, `controller/authController.js` (logout), `models/refreshTokenModel.js` (deleteRefreshTokenByHash) |
| 3 | Staying logged in | `routes/authRouter.js`, `controller/authController.js` (refresh), `models/refreshTokenModel.js` (findRefreshTokenByHash, deleteRefreshTokenById, insertRefreshToken) |
| 3 | Login check | `middleware/auth.js` (requireAuth) |
| 4 | Account deletion | `routes/authRouter.js`, `controller/authController.js` (deleteAccount), `models/userModel.js` (deleteUserById) |
| 5 | Search | `routes/movieRouter.js` (/search), `routes/serieRouter.js` (/search) |
| 5 | Browsing movies | `routes/movieRouter.js` (/popular, /top-rated, /upcoming) |
| 5 | Movie detail page | `routes/movieRouter.js` (/:movieId), `controller/movieController.js` (fetchMovieById), `models/movieModel.js` (getMovieById) |
| 6 | Now in theaters | `routes/movieRouter.js` (/now-playing) |
| 7 | Group list and creation | `routes/groupRouter.js`, `controller/groupController.js` (listGroups, addGroup), `models/groupModel.js` (getAllGroups, createGroup) |
| 7 | Group page | `routes/groupRouter.js`, `controller/groupController.js` (getGroup), `models/groupModel.js` (getGroupById, isGroupMember, getGroupMovies, getGroupMembers) |
| 7 | Deleting a group | `routes/groupRouter.js`, `controller/groupController.js` (removeGroup), `models/groupModel.js` (deleteGroup) |
| 8 | Sending a join request | `routes/groupRouter.js`, `controller/groupController.js` (sendJoinRequest), `models/groupModel.js` (addJoinRequest) |
| 8 | Handling join requests | `routes/groupRouter.js`, `controller/groupController.js` (getPendingGroupRequests, acceptGroupRequest, rejectGroupRequest), `models/groupModel.js` (isGroupOwner, getPendingRequests, acceptJoinRequest, rejectJoinRequest) |
| 9 | Removing a member | `routes/groupRouter.js`, `controller/groupController.js` (removeGroupMember), `models/groupModel.js` (isGroupOwner, removeMember) |
| 10 | Adding a movie to a group | `routes/groupRouter.js`, `controller/groupController.js` (addMovieToGroup, listMyGroups), `models/groupModel.js` (addGroupMovie, getUserGroups) |
| 11 | Movie review | `routes/reviewRouter.js`, `controller/reviewController.js` (addReview, removeReview), `models/reviewModel.js` (createReview, deleteReview) |
| 12 | Browsing reviews | `routes/reviewRouter.js`, `controller/reviewController.js` (getMovieReviews, getAllMovieReviews, getReview), `models/reviewModel.js` (getReviewsByMovie, getAllReviews, getReviewById) |
| 13 | Favorites list | `routes/favoriteRouter.js`, `controller/favoriteController.js` (addFavorite, removeFavorite, getMyFavorites), `models/favoriteModel.js` (addMovieToFavorites, deleteMovieFromFavorites, getFavoritesByUserId) |
| 14 | Sharing the favorites list | `routes/favoriteRouter.js` (/user/:userId), `controller/favoriteController.js` (getUserFavorites), `models/favoriteModel.js` (getUserById, getFavoritesByUserId) |
| 15 | Free-choice feature: series | `routes/serieRouter.js` (/popular, /top-rated, /airing-today, /on-the-air, /:seriesId), `controller/serieController.js` (fetchSerieById), `models/serieModel.js` (getSerieById) |
| 15 | Free-choice feature: genres | `routes/movieRouter.js` (/by-genre) |

Functions whose purpose is not clear from the name:

- `refresh`: gives a new access token using the refresh token cookie. The old refresh token is deleted and a new one is created.
- `createGroup(name, ownerId)`: creates the group and adds the owner as an accepted member in the same transaction.
- `deleteGroup(groupId, userId)`: deletes the group only if the user is its owner. Memberships and movies of the group are deleted automatically (CASCADE).
- `isGroupMember(groupId, userId)`: checks that the user is an accepted member of the group.
- `getUserGroups(userId)`: returns only groups where the user is an accepted member. Used in the "add to group" menu.
- `getReviewsByMovie(movieId)`: returns the reviews of one movie, newest first, with the reviewer's username.
- `getUserFavorites`: returns another user's favorites with movie details from TMDB. Used on the shared favorites page.

## 5. REST API

All responses are JSON. "Login: yes" means the request needs the header `Authorization: Bearer <token>`. If the TMDB API or the database returns an unexpected error, the response is 500.

### 5.1 Auth (/auth)

| Method and path | Login | Request | Response |
|---|---|---|---|
| POST /auth/register | No | Body: `{ "username", "email", "password" }` | 201: `{ id, username, email, created_at }`. 400: field missing, or password shorter than 8 characters or without an uppercase letter and a number. 409: email or username already in use |
| POST /auth/login | No | Body: `{ "email", "password" }` | 200: `{ token, user: { id, username, email } }` and a refresh token cookie. 400: field missing. 401: wrong email or password |
| POST /auth/refresh | Cookie | Refresh token cookie | 200: `{ token, user: { id, username, email } }` and a new refresh token cookie. 401: cookie missing, invalid, expired or already used |
| POST /auth/logout | Cookie | Refresh token cookie | 204: logged out, refresh token deleted and cookie cleared |
| DELETE /auth/account | Yes | – | 200: `{ message }`. 401: token missing or invalid. 404: user not found. The user's refresh tokens, groups, memberships, favorites and reviews are deleted too (CASCADE) |

### 5.2 Movies (/movies)

None of the movie routes require login. Movie data comes from TMDB in Finnish (`fi-FI`, region `FI`).

| Method and path | Request | Response |
|---|---|---|
| GET /movies/now-playing | Query: `page` (optional) | 200: list of movies now playing in Finland |
| GET /movies/popular | Query: `page` (optional) | 200: list of popular movies |
| GET /movies/top-rated | Query: `page` (optional) | 200: list of top rated movies |
| GET /movies/upcoming | Query: `page` (optional) | 200: list of upcoming movies |
| GET /movies/search | Query: `query` (required), `year` (optional, 4 digits, 1888 – current year + 5), `page` (optional) | 200: list of movies. 400: `query` missing or `year` invalid |
| GET /movies/by-genre | Query: `genre` (required, TMDB genre id), `page` (optional) | 200: `{ results, page, total_pages }`. 400: `genre` missing |
| GET /movies/:movieId | URL: TMDB movie id | 200: movie details and cast (`credits`) |

### 5.3 Series (/series)

None of the series routes require login.

| Method and path | Request | Response |
|---|---|---|
| GET /series/popular | Query: `page` (optional) | 200: list of popular series |
| GET /series/top-rated | Query: `page` (optional) | 200: list of top rated series |
| GET /series/airing-today | Query: `page` (optional) | 200: list of series airing today |
| GET /series/on-the-air | Query: `page` (optional) | 200: list of series currently on the air |
| GET /series/search | Query: `query` (required), `year` (optional), `page` (optional) | 200: list of series. 400: `query` missing |
| GET /series/:seriesId | URL: TMDB series id | 200: series details and cast |

### 5.4 Reviews (/reviews)

| Method and path | Login | Request | Response |
|---|---|---|---|
| POST /reviews | Yes | Body: `{ "movieId", "reviewText", "stars" }` | 201: created review. 400: field missing or stars not between 1 and 5. 401: token missing or invalid |
| GET /reviews | No | – | 200: all reviews, newest first, with `username` |
| GET /reviews/movie/:movieId | No | URL: TMDB movie id | 200: `[ { id, movie_id, review_text, stars, created_at, username } ]`, newest first. Empty list `[]` if there are no reviews |
| GET /reviews/:id | No | URL: review id | 200: one review. 404: review not found |
| DELETE /reviews/:id | Yes | URL: review id | 200: `{ message }`. 401: token missing or invalid. 404: review not found or not the user's own review |

### 5.5 Favorites (/favorites)

| Method and path | Login | Request | Response |
|---|---|---|---|
| POST /favorites | Yes | Body: `{ "movieId" }` | 201: created favorite. 400: invalid movie id. 401: token missing or invalid. 409: movie already in favorites |
| DELETE /favorites/:movieId | Yes | URL: TMDB movie id | 204: removed. 400: invalid movie id. 401: token missing or invalid. 404: movie not in favorites |
| GET /favorites | Yes | – | 200: `[ { movie_id, created_at } ]`. 401: token missing or invalid |
| GET /favorites/user/:userId | No | URL: user id | 200: `{ user: { id, username }, favorites: [ { id, title, poster_path, vote_average, added_at } ] }`. 400: invalid user id. 404: user not found |

### 5.6 Groups (/groups)

| Method and path | Login | Request | Response |
|---|---|---|---|
| GET /groups | No | – | 200: `[ { id, name, owner_id, owner_name } ]` |
| GET /groups/my | Yes | – | 200: `[ { id, name } ]`, groups where the user is an accepted member. 401: token missing or invalid |
| POST /groups | Yes | Body: `{ "name" }` | 201: created group. The creator becomes the owner and an accepted member. 400: name missing or not 1–50 characters. 401: token missing or invalid |
| GET /groups/:id | Yes | URL: group id | 200: `{ id, name, owner_id, owner_name, movies: [ { movie_id } ], members: [ { id, username } ] }`. 401: token missing or invalid. 403: not a member. 404: group not found |
| DELETE /groups/:groupId | Yes | URL: group id | 204: deleted. 400: invalid group id. 401: token missing or invalid. 404: group not found or user is not the owner |
| POST /groups/:groupId/join | Yes | URL: group id | 201: `{ id, group_id, user_id, status: "pending" }`. 400: invalid group id. 401: token missing or invalid. 404: group not found. 409: request already sent or already a member |
| GET /groups/:id/requests | Yes | URL: group id | 200: `[ { id, group_id, user_id, status, username } ]`, pending requests. 401: token missing or invalid. 403: not the owner |
| PATCH /groups/:id/requests/:requestId/accept | Yes | URL: group id and request id | 200: updated membership with status `accepted`. 401: token missing or invalid. 403: not the owner. 404: request not found |
| DELETE /groups/:id/requests/:requestId | Yes | URL: group id and request id | 200: `{ message }`. 401: token missing or invalid. 403: not the owner. 404: request not found |
| DELETE /groups/:groupId/members/:memberId | Yes | URL: group id and user id | 204: removed. 400: invalid id, or the owner tries to leave their own group. 401: token missing or invalid. 403: a member tries to remove someone else. 404: member not found |
| POST /groups/:id/movies | Yes | Body: `{ "movie_id" }` | 201: `{ id, group_id, movie_id }`. 400: invalid group id or movie id. 401: token missing or invalid. 403: not a member. 409: movie already in the group |

## 6. Tests

Run the tests in the `server` folder with `npm test`. The backend must be running.

| File | Test group | Tests |
|---|---|---|
| authRouter.test.js | Register | 201 with valid data. 409 when email is in use. 400 when the password does not meet the requirements. 400 when a field is missing |
| authRouter.test.js | Login | 200 and a token with correct credentials. 401 with a wrong password. 400 when the password is missing |
| authRouter.test.js | Logout | 204 with a valid refresh cookie. The refresh token can no longer be used after logout |
| authRouter.test.js | Access token | Contains user id and username and expires in 15 minutes. 401 with an invalid, expired or wrongly signed token |
| authRouter.test.js | Refresh token | 200, a new token and a new cookie with a valid cookie. 401 without a cookie, with an invalid token or with an already used token |
| authRouter.test.js | Account deletion | 401 without a token. Account is deleted with a valid token |
| movieRouter.test.js | Movie routes | Now playing returns movies. Search returns results. 400 when `query` is missing. Search works when `year` is empty |
| reviewRouter.test.js | Review routes | Returns a list of reviews for a movie. Returns an empty list for a movie with no reviews |
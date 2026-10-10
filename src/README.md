# Frontend

## 1. Structure

```
src/
  main.jsx        Starts React, loads axiosSetup and AuthProvider
  App.jsx         Page routes (React Router)
  api/            Token storage and automatic token handling
  context/        AuthContext: logged-in user, login and logout
  components/     Reusable components
  pages/          One folder or file per page
```

- `api/tokenStore.js`: keeps the access token in memory.
- `api/axiosSetup.js`: adds the token to every request automatically. If the backend returns 401, it gets a new token with the refresh token and retries the request.
- `context/AuthContext.jsx`: provides `user`, `login` and `logout` to all components through `useAuth()`.

`vite.config.js` (project root) forwards API requests (`/auth`, `/movies`, `/series`, `/reviews`, `/favorites`, `/groups`) to the backend. Because of this, detail page paths use singular words (`/movie`, `/serie`).

## 2. Pages

| Path | File |
|---|---|
| / | pages/Home.jsx |
| /movies | pages/movies/Movies.jsx |
| /movie/:movieId | pages/movies/Moviepage.jsx |
| /series | pages/series/Series.jsx |
| /serie/:seriesId | pages/series/seriePage.jsx |
| /genres | pages/genres/Genres.jsx |
| /search | pages/Search.jsx |
| /reviews | pages/reviews/Reviews.jsx |
| /favorites | pages/favorites/UserFavorites.jsx |
| /shared/favorites/:userId | pages/favorites/SharedFavorites.jsx |
| /groups | pages/groups/Groups.jsx |
| /group/:id | pages/groups/GroupDetails.jsx |
| /group/:id/requests | pages/groups/GroupRequests.jsx |
| /login | pages/Login.jsx |
| /register | pages/Register.jsx |
| * | pages/NotFound.jsx |

## 3. Features and components

Feature IDs follow the work instruction.

| ID | Feature | File | Purpose | API call |
|---|---|---|---|---|
| 4 | Account deletion | components/DeleteAccountButton.jsx | Asks for confirmation, deletes the account, logs out and returns to the front page. Shown in the user menu in `Header.jsx` | DELETE /auth/account |
| 7 | Deleting a group | components/deleteGroupButton/deleteGroupButton.jsx | Visible only to the owner. Asks for confirmation and updates the group list | DELETE /groups/:groupId |
| 8 | Sending a join request | components/joinGroupButton/joinGroupButton.jsx | Visible only to logged-in users. Shows a message after sending | POST /groups/:groupId/join |
| 8 | Join requests link | pages/groups/GroupDetails.jsx | Shows the owner a link to the group's join requests | – |
| 10 | Adding a movie to a group | components/addToGroupMenu/AddToGroupMenu.jsx | Dropdown on the movie page: choose a group and add the movie. Hidden if not logged in or no groups | GET /groups/my, POST /groups/:id/movies |
| 10 | Group movies | pages/groups/GroupDetails.jsx | Shows the group's movies as a poster grid | GET /movies/:movieId |
| 12 | Browsing reviews | components/reviewList/reviewList.jsx | Shows the reviews of one movie on the movie page: username, date, stars and text | GET /reviews/movie/:movieId |

## 4. User interface design

The user interface was designed with Penpot.
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

Feature IDs follow the work instruction. File paths are relative to `src/`.

| ID | Feature | File | Purpose | API call |
|---|---|---|---|---|
| 1 | Responsiveness | index.css, App.css, page-specific .css files | Layout adapts to different screen sizes | – |
| 2 | Registration | pages/Register.jsx | Registration form: username, email and password | POST /auth/register |
| 3 | Login | pages/Login.jsx, context/AuthContext.jsx | Login form. AuthContext stores the logged-in user and the access token | POST /auth/login |
| 3 | Logout | components/Header.jsx, context/AuthContext.jsx | Logout from the user menu | POST /auth/logout |
| 3 | Staying logged in | api/axiosSetup.js, api/tokenStore.js | Adds the token to requests and gets a new token when the old one expires | POST /auth/refresh |
| 4 | Account deletion | components/DeleteAccountButton.jsx | Asks for confirmation, deletes the account, logs out and returns to the front page. Shown in the user menu in `Header.jsx` | DELETE /auth/account |
| 5 | Search | components/SearchBar.jsx, pages/Search.jsx, components/SearchResults.jsx | Search movies or series by name, type and release year. Results are shown as MovieCard or SerieCard | GET /movies/search, GET /series/search |
| 5 | Browsing movies | pages/movies/Movies.jsx | Movie lists: popular, top rated, now playing and upcoming | GET /movies/:category |
| 5 | Movie detail page | pages/movies/Moviepage.jsx | Movie details with cast | GET /movies/:movieId |
| 6 | Now in theaters | components/MovieCarousel.jsx | Carousel on the front page (`Home.jsx`) showing movies now playing in Finland | GET /movies/now-playing |
| 7 | Group list and creation | pages/groups/Groups.jsx, components/CreateGroupForm.jsx | Lists all groups. Logged-in users can create a new group | GET /groups, POST /groups |
| 7 | Group page | pages/groups/GroupDetails.jsx | Group details, members and movies. Visible only to members | GET /groups/:id |
| 7 | Deleting a group | components/deleteGroupButton/deleteGroupButton.jsx | Visible only to the owner. Asks for confirmation and updates the group list | DELETE /groups/:groupId |
| 8 | Sending a join request | components/joinGroupButton/joinGroupButton.jsx | Visible only to logged-in users. Shows a message after sending | POST /groups/:groupId/join |
| 8 | Handling join requests | pages/groups/GroupRequests.jsx | The owner sees pending requests and accepts or rejects them. Link on the group page | GET /groups/:id/requests, PATCH /groups/:id/requests/:requestId/accept, DELETE /groups/:id/requests/:requestId |
| 9 | Removing a member | components/GroupMembers.jsx | Member list on the group page. The owner can remove members, and a member can leave the group | DELETE /groups/:groupId/members/:memberId |
| 10 | Adding a movie to a group | components/addToGroupMenu/AddToGroupMenu.jsx | Dropdown on the movie page: choose a group and add the movie. Hidden if not logged in or no groups | GET /groups/my, POST /groups/:id/movies |
| 10 | Group movies | pages/groups/GroupDetails.jsx | Shows the group's movies as a poster grid | GET /movies/:movieId |
| 11 | Movie review | components/ReviewForm.jsx | Review form on the movie page: text and stars (1–5) | POST /reviews |
| 12 | Browsing reviews | components/reviewList/reviewList.jsx | Reviews of one movie on the movie page: username, date, stars and text | GET /reviews/movie/:movieId |
| 12 | All reviews | pages/reviews/Reviews.jsx | All reviews with movie posters | GET /reviews, GET /movies/:movieId |
| 13 | Favorites list | pages/favorites/UserFavorites.jsx, pages/movies/Moviepage.jsx | The user's own favorites page. Movies are added and removed on the movie page | GET /favorites, POST /favorites, DELETE /favorites/:movieId |
| 14 | Sharing the favorites list | components/ShareFavoritesButton.jsx, pages/favorites/SharedFavorites.jsx | Copies the share link to the clipboard. The shared page is visible to everyone | GET /favorites/user/:userId |
| 15 | Free-choice feature: series | pages/series/Series.jsx, pages/series/seriePage.jsx, components/serieCard/SerieCard.jsx | Series lists (popular, top rated, airing today, on the air) and series detail page with cast | GET /series/:category, GET /series/:seriesId |
| 15 | Free-choice feature: genres | pages/genres/Genres.jsx, pages/movies/Movies.jsx | Genre page. Choosing a genre opens the movie list filtered by that genre | GET /movies/by-genre |

## 4. User interface design

The user interface was designed with Penpot.
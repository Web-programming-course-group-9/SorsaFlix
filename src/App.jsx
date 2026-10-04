import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import Header from "./components/Header"

import Home from "./pages/Home"
import Movies from "./pages/movies/Movies"
import Series from "./pages/series/Series"
import Groups from "./pages/groups/Groups"
import Reviews from "./pages/reviews/Reviews"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"
import Moviepage from "./pages/movies/Moviepage"
import SeriePage from "./pages/series/seriePage"
import Genres from "./pages/genres/Genres"
import Favorites from "./pages/favorites/UserFavorites"
import SharedFavorites from "./pages/favorites/SharedFavorites"
import GroupPage from "./pages/groups/GroupPage"
import NotFound from "./pages/NotFound"



import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/shared/favorites/:userId" element={<SharedFavorites />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:movieId" element={<Moviepage />} />
        <Route path="/serie/:seriesId" element={<SeriePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
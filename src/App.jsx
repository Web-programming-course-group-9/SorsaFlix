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
import Reviews from "./pages/Reviews"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Search from "./pages/Search"

import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
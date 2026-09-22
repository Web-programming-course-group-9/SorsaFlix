import {useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import DeleteAccountButton from "./DeleteAccountButton"
import "./Header.css"

import logo from "../assets/logo.svg"

function Header() {
  // get login state (user) and logout function from AuthContext
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  // track wether user dropdown menu is open
  const [menuOpen, setMenuOpen] = useState(false)
  // log out and return to the front page
  async function handleLogout() {
    await logout()
    navigate("/")
  }

return (
  <header className="header">

    <Link to="/" className="logo-link">
      <img
        className="logo"
        src={logo}
        alt="Sorsaflix"
      />
    </Link>

    <nav className="header-nav">
      <Link to="/movies" className="nav-button">
        Movies
      </Link>

      <Link to="/series" className="nav-button">
        Series
      </Link>

      <Link to="/genres" className="nav-button">
        Genres
      </Link>

      <Link to="/groups" className="nav-button">
        Groups
      </Link>

      <Link to="/reviews" className="nav-button">
        Reviews
      </Link>

      {user ? (
        <div className="user-menu">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {user.username}
          </button>

          {menuOpen && (
            <div className="dropdown">
              <button onClick={handleLogout}>
                Log out
              </button>

              <DeleteAccountButton />
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="nav-button">
          Login
        </Link>
      )}
    </nav>

  </header>
  )
}

export default Header
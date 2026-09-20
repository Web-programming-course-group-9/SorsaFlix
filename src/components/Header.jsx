import {useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import DeleteAccountButton from "./DeleteAccountButton"
import "./Header.css"

import logo from "../assets/logo.svg"
import moviesButton from "../assets/moviesButton.svg"
import seriesButton from "../assets/seriesButton.svg"
import groupsButton from "../assets/groupsButton.svg"
import reviewsButton from "../assets/reviewsButton.svg"
import loginButton from "../assets/loginButton.svg"

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
          alt="Sortsaflix"
        />
      </Link>

      <nav className="navigation">

        <Link to="/movies">
          <img
            src={moviesButton}
            alt="Movies"
          />
        </Link>

        <Link to="/series">
          <img
            src={seriesButton}
            alt="Series"
          />
        </Link>

        <Link to="/groups">
          <img
            src={groupsButton}
            alt="Groups"
          />
        </Link>

        <Link to="/reviews">
          <img
            src={reviewsButton}
            alt="Reviews"
          />
        </Link>
        {user ? (
          <div className="user-menu">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {user.username}
            </button>

            {menuOpen && (
              <div className="dropdown">
                <button onClick={handleLogout}>Log out</button>
                <DeleteAccountButton />
              </div>
            )}
          </div>
        ) : (

          <Link to="/login">
            <img
              src={loginButton}
              alt="Log in"
            />
          </Link>
        )}
      </nav>

    </header>
  )
}

export default Header
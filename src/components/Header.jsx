import { Link } from "react-router-dom";

import logo from "../assets/logo.svg";
import moviesButton from "../assets/moviesButton.svg";
import seriesButton from "../assets/seriesButton.svg";
import groupsButton from "../assets/groupsButton.svg";
import reviewsButton from "../assets/reviewsButton.svg";
import loginButton from "../assets/loginButton.svg";


function Header () {
    return (
        <header className="header">
            <Link to="/">
            <img
              className="logo"
              src={logo}
              alt="Sorsaflix"
            />
            </Link>  

         <nav className="navigation">
       
        <Link to="/movies">
          <img src={moviesButton} alt="Movies" />
        </Link>

        
        <Link to="/series">
          <img src={seriesButton} alt="Series" />
        </Link>

       
        <Link to="/groups">
          <img src={groupsButton} alt="Groups" />
        </Link>

        
        <Link to="/reviews">
          <img src={reviewsButton} alt="Reviews" />
        </Link>

        
        <Link to="/login">
          <img src={loginButton} alt="Log in" />
        </Link>
      </nav>
    </header>
  );
}

export default Header;
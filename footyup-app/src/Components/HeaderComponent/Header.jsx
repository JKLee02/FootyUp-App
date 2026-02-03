import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">FootyUp</Link>
        </div>

        {/* Hamburger nav for mobile and navigation bar for desktop */}
        <button
          className={`hamburger ${isNavOpen ? "open" : ""}`}
          onClick={toggleNav}
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-bar ${isNavOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/" onClick={toggleNav}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/howtouse" onClick={toggleNav}>
                How to Use
              </Link>
            </li>
            <li>
              <Link to="/aboutus" onClick={toggleNav}>
                About Us
              </Link>
            </li>
          </ul>
          <div className="mobile-auth-buttons">
            <Link to="/signup" className="register-btn" onClick={toggleNav}>
              Register
            </Link>
            <Link to="/login" className="sign-in-btn" onClick={toggleNav}>
              Sign In
            </Link>
          </div>
        </nav>

        <div className="desktop-auth-buttons">
          <Link to="/signup" className="register-btn">
            Register
          </Link>
          <Link to="/login" className="sign-in-btn">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

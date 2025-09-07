import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserHeader.css';

function UserHeader() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user_firstname');
    // Redirect to the front page
    navigate('/');
  };

  return (
    <header className="user-header">
      <div className="user-header-content">
        <div className="user-logo">
          <Link to="/userhome">FootyUp</Link>
        </div>

        <button 
          className={`user-hamburger ${isNavOpen ? 'open' : ''}`} 
          onClick={toggleNav}
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`user-nav-bar ${isNavOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/userhome" onClick={toggleNav}>Home</Link></li>
            <li><Link to="/usertournaments" onClick={toggleNav}>Tournaments</Link></li>
            <li><Link to="/uservenue" onClick={toggleNav}>Venue</Link></li>
            <li><Link to="/userteam" onClick={toggleNav}>Team</Link></li>
            <li><Link to="/userprofile" onClick={toggleNav}>Profile</Link></li>
          </ul>
          <div className="user-mobile-logout-button">
            <button onClick={() => { toggleNav(); handleLogout(); }} className="user-logout-btn">
              Log Out
            </button>
          </div>
        </nav>

        <div className="user-desktop-logout-button">
          <button onClick={handleLogout} className="user-logout-btn">Log Out</button>
        </div>
      </div>
    </header>
  );
}

export default UserHeader;

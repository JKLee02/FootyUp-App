import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../utils/auth';
import './AdminHeader.css';

function AdminHeader() {
  const navigate = useNavigate();

  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    if (!auth.isAdminAuthenticated()) {
      navigate('/adminlogin');
    }
  }, [navigate]);

  const handleLogout = () => {
    auth.clearAdminSession();
    navigate('/adminlogin');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="admin-logo">
          <Link to="/adminhome">FootyUp Admin</Link>
        </div>

        {/* Hamburger menu for mobile */}
        <button 
          className={`admin-hamburger ${isNavOpen ? 'open' : ''}`} 
          onClick={toggleNav}
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <nav className={`admin-nav-bar ${isNavOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/adminhome" onClick={toggleNav}>Home</Link></li>
            <li><Link to="/adminteamslist" onClick={toggleNav}>Teams</Link></li>
            <li><Link to="/adminplayerslist" onClick={toggleNav}>Players</Link></li>
            <li><Link to="/adminmatcheslist" onClick={toggleNav}>Tournaments</Link></li>
            <li><Link to="/adminvenueslist" onClick={toggleNav}>Venues</Link></li>
            <li><Link to="/adminapproval" onClick={toggleNav}>Approvals</Link></li>
          </ul>
          {/* Mobile Logout Button */}
          <div className="admin-mobile-logout-button">
            <button 
              onClick={() => { toggleNav(); handleLogout(); }} 
              className="admin-logout-btn"
            >
              Log Out
            </button>
          </div>
        </nav>

        {/* Desktop Logout Button */}
        <div className="admin-desktop-logout-button">
          <button onClick={handleLogout} className="admin-logout-btn">Log Out</button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;

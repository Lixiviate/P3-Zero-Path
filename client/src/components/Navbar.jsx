import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Auth from "../utils/auth";
import '../styles/Navbar.css';

const NavbarComponent = ({ onAuthToggle }) => {
  const [loggedIn, setLoggedIn] = useState(Auth.loggedIn());
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(Auth.loggedIn());
  }, []);

  const handleSignInClick = (e) => {
    e.stopPropagation();
    if (!loggedIn) {
      onAuthToggle();
    }
  };

  const handleSignOutClick = (e) => {
    e.stopPropagation();
    Auth.logout();
    setLoggedIn(false);
    navigate("/");
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 300);
  };

  return (
    <nav className="navbar">
      <div 
        className="fish-container" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span role="img" aria-label="fish" className="fish-icon">🐠</span>
        {isHovering && (
          <div className="nav-options">
            {loggedIn ? (
              <>
                <Link to="/tracker" className="nav-option">Tracker</Link>
                <Link to="/about" className="nav-option">About</Link>
                <Link to="/goals" className="nav-option">Goals</Link>
                <button onClick={handleSignOutClick} className="nav-option">Sign Out</button>
              </>
            ) : (
              <button onClick={handleSignInClick} className="nav-option">Sign In</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarComponent;
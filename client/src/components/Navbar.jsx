import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Auth from "../utils/auth";
import PropTypes from "prop-types";
import "../styles/Navbar.css";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";

const NavbarComponent = ({ onAuthToggle }) => {
  const [loggedIn, setLoggedIn] = useState(Auth.loggedIn());
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const { loading, data } = useQuery(GET_ME, {
    skip: !loggedIn,
  });
  const userData = data?.me || {};

  useEffect(() => {
    const handleUserStatusChange = () => {
      setLoggedIn(Auth.loggedIn());
    };

    window.addEventListener("userLoggedIn", handleUserStatusChange);
    window.addEventListener("userLoggedOut", handleUserStatusChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserStatusChange);
      window.removeEventListener("userLoggedOut", handleUserStatusChange);
    };
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
    <nav className="navbar fixed top-0 left-0 z-50 p-4 flex items-center">
      {/* Profile Icon Section */}
      {loggedIn && (
        <div className="flex items-center">
          <Link to="/profile">
            {userData.profilePhoto ? (
              <img
                src={userData.profilePhoto}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xl">👤</span>
              </div>
            )}
          </Link>
        </div>
      )}

      {/* Spacer to push fish icon to the right */}
      <div className="flex-grow"></div>

      {/* Fish Icon and Navigation Options */}
      <div
        className="fish-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span role="img" aria-label="fish" className="fish-icon">
          🐠
        </span>
        {isHovering && (
          <div className="nav-options">
            {loggedIn ? (
              <>
                <Link to="/tracker" className="nav-option">
                  Tracker
                </Link>
                <Link to="/goals" className="nav-option">
                  Goals
                </Link>
                <Link to="/dashboard" className="nav-option">
                  Dashboard
                </Link>
                <Link to="/about" className="nav-option">
                  About
                </Link>
                <button onClick={handleSignOutClick} className="nav-option">
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={handleSignInClick} className="nav-option">
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

NavbarComponent.propTypes = {
  onAuthToggle: PropTypes.func.isRequired,
};

export default NavbarComponent;

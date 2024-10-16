import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar/Navbar";
import AuthForm from "./components/Form/AuthForm";
import Auth from "./utils/auth";
import Canvas from "./components/Canvas/Canvas";

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleAuth = () => {
    setShowAuth(!showAuth);
  };

  useEffect(() => {
    if (location.pathname === "/dashboard" && !Auth.loggedIn()) {
      navigate("/");
    }
  }, [location, navigate]);

  const handleAuthCancel = () => {
    setShowAuth(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-teal-300 to-blue-500" style={{ zIndex: 0 }}></div>
      
      {/* Canvas for bubbles */}
      <Canvas />
      
    
      <div className="relative z-10 min-h-screen">
        <Navbar onAuthToggle={toggleAuth} />
        <div className="pt-20">
          {showAuth && (
            <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
              <AuthForm onCancel={handleAuthCancel} />
            </div>
          )}
          <Outlet context={{ showAuth, toggleAuth }} />
        </div>
      </div>
    </div>
  );
}

export default App;
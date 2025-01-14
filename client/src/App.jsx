import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
    <div className="App">
      <Canvas enableRipples={location.pathname === "/"} />{" "}
      {/* Enable ripples only on the main page */}
      <Navbar onAuthToggle={toggleAuth} />
      {showAuth && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <AuthForm onCancel={handleAuthCancel} />
        </div>
      )}
      <Outlet context={{ showAuth, toggleAuth }} />
      <Footer />
    </div>
  );
}

export default App;

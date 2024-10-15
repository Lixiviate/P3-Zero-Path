import { useState } from "react";
import Canvas from "../../components/Canvas/Canvas";
import About from "../About";
import AuthForm from "../../components/Form/AuthForm";
import "./LandingPage.css";

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);

  const toggleAuth = () => {
    setShowAuth(!showAuth);
  };

  return (
    <div className="landing-page">
      <Canvas />
      <div className="content">
        <h1 className="title">
          <span className="title-zero">Zero</span>
          <span className="title-path">Path</span>
        </h1>
        <p className="subtitle">A Tranquil Journey to Sustainability</p>
        {showAuth ? (
          <AuthForm onCancel={toggleAuth} />
        ) : (
          <About isStandalone={false} />
        )}
      </div>
    </div>
  );
};

export default LandingPage;

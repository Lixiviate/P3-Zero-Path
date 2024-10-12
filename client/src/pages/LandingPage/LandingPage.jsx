import Canvas from "../../components/Canvas/Canvas";
import AuthForm from "../../components/Form/AuthForm";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-300 to-blue-500 overflow-hidden font-serif">
      <Canvas />
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-white">Zero</span>
          <span className="text-teal-100">Path</span>
        </h1>
        <p className="text-2xl mb-8 text-white">
          A Tranquil Journey to Sustainability
        </p>
        <AuthForm /> {/* Renders the new AuthForm with tabs */}
      </div>
    </div>
  );
};

export default LandingPage;

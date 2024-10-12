// ZeroPath: client/src/App.jsx
import Navbar from "./components/Navbar"; // Import Navbar
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Outlet /> {/* This will render the LandingPage */}
    </div>
  );
}

export default App;

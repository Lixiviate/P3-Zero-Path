// ZeroPath: client/src/main.jsx
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is loaded
import "./styles/index.css";

import App from "./App";
import LandingPage from "./pages/LandingPage/LandingPage";
import Home from "./pages/Home"; // Replace this with actual Home component if needed

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Main App component that contains the Navbar and Outlet
    errorElement: <h1 className="display-2">Page not found!</h1>,
    children: [
      {
        index: true, // This ensures the landing page is rendered on the root "/"
        element: <LandingPage />,
      },
      {
        path: "/home",
        element: <Home />, // Example additional route
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

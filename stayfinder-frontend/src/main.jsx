import { AuthProvider } from "./context/AuthContext.jsx";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.jsx";
import "./index.css";
// import App from './App.jsx'

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { AuthixProvider } from "@neuctra/authix";
import { authix } from "./utils/authixInit.js";

createRoot(document.getElementById("root")).render(
  <AuthixProvider authix={authix} >
    <AppProvider>
      <App />
    </AppProvider>
  </AuthixProvider>,
);

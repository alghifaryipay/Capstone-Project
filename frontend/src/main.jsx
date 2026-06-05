import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  LanguageProvider,
} from "./context/LanguageContext";

import AppRoutes from "./routes";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <LanguageProvider>

          <AppRoutes />

        </LanguageProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>
);

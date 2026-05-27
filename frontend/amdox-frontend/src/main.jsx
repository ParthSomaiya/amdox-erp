import React from "react";

import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import "./index.css";

import ToastContainer from "./components/notifications/ToastContainer";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <BrowserRouter>

      <ToastContainer />

      <App />

    </BrowserRouter>

  </React.StrictMode>
);
import React from "react";

import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";

import ToastContainer from "./components/notifications/ToastContainer";

import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <ErrorBoundary>

      <BrowserRouter>

        <App />

        <ToastContainer />

      </BrowserRouter>

    </ErrorBoundary>

  </React.StrictMode>

);
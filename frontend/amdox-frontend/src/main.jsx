import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ToastContainer from "./components/notifications/ToastContainer";
import ErrorBoundary from "./components/ErrorBoundary";

// 🚀 F-12: PWA / OFFLINE SUPPORT SERVICE WORKER REGISTRATION
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(reg => console.log("AMDOX PWA Service Worker Registered! Scope:", reg.scope))
      .catch(err => console.warn("PWA Service Worker registration failed:", err));
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </ErrorBoundary>
);
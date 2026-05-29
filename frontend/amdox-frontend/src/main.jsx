import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ToastContainer from "./components/notifications/ToastContainer";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  // 🔹 સુધારેલ: React.StrictMode નો ટેગ હટાવ્યો જેથી react-beautiful-dnd બરાબર કામ કરી શકે
  <ErrorBoundary>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </ErrorBoundary>
);
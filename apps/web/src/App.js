import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import HomePage from "./pages/HomePage";
import SelectPage from "./pages/SelectPage";
import ChatPage from "./pages/ChatPage";

function App() {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useEffect(() => {
    setScreenSize();
  });

  const location = useLocation();

  return (
    <AnimatePresence wait>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/select" element={<SelectPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function AnimatedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

// App.js
import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AllOutput from "./pages/AllOutput";
import Details from "./pages/Details"; // Ensure this is imported
import Home from "./pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <ConditionalSidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/allOutput" element={<AllOutput />} />
        <Route path="/port/:port" element={<Details />} />
      </Routes>
    </Router>
  );
}

const ConditionalSidebar = () => {
  const location = useLocation();
  return location.pathname !== "/" ? <Sidebar /> : null;
};

export default App;

	

import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PostApplication from "./pages/PostApplication";
import Register from "./pages/Register";


const App = () => {
  const backend_URL="http://localhost:8000";

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home url={backend_URL} />} />
          <Route path="/jobs" element={<Jobs url={backend_URL} />} />
          <Route path="/dashboard" element={<Dashboard url={backend_URL} />} />
          <Route path="/post/application/:jobId" element={<PostApplication url={backend_URL} />} />
          <Route path="/register" element={<Register url={backend_URL} />} />
          <Route path="/login" element={<Login url={backend_URL} />} />
          <Route path="*" element={<NotFound url={backend_URL} />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

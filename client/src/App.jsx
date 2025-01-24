import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      {/* Route without nav pane */}
      <Route path="/" element={<HomePage />} />

      {/* Routes with nav pane */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/safety-trends" element={<Dashboard />} />
        <Route path="/timeline" element={<Dashboard />} />
        <Route path="/alert-history" element={<Dashboard />} />
        <Route path="/construction-sites" element={<Dashboard />} />
        <Route path="/cameras" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;

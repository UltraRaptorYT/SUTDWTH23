import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Error from "./pages/404";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./pages/Layout";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about/:aboutId" element={<About />} />
      </Route>
      
      {/* 404 ERROR */}
      <Route path="/*" element={<Error />} />
    </Routes>
  );
}

export default App;

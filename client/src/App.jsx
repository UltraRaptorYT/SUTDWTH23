import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Error from "./pages/404";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Layout from "./pages/Layout";
import Login from "./components/Login";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/" element={<Layout />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/login" element={<Login />} />
      {/* 404 ERROR */}
      <Route path="/*" element={<Error />} />
    </Routes>
  );
}

export default App;

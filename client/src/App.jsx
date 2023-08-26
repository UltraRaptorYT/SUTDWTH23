import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Error from "./pages/404";
import Layout from "./pages/Layout";
import Login from "./components/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Inventory from "./pages/Inventory";
import Store from "./pages/Store";
import Recipe from "./pages/Recipe";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/" element={<Layout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/store" element={<Store />} />
        <Route path="/recipe" element={<Recipe />} />
      </Route>

      <Route path="/login" element={<Login />} />
      {/* 404 ERROR */}
      <Route path="/*" element={<Error />} />
    </Routes>
  );
}

export default App;

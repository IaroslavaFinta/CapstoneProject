import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Account from "./components/Account";
import Register from "./components/Register";
import Login from "./components/Login";
import AllProducts from "./components/AllProducts";
import SingleProduct from "./components/SingleProduct";

function App() {

  return (
    <>
      <h1 className="logo">
        <img
          id="logo-image"
          src=""
          alt="wizards store logo"
        />
        Wizards Store
      </h1>
      <div id="container">
        <Navigation />
        <div id="main section">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/account"
              element={<Account />}
            />
            <Route
              path="/register"
              element={<Register />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/books"
              element={<AllProducts />}
            />
            <Route
              path="/products/:id"
              element={<SingleProduct />}
            />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App

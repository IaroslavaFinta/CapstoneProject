import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Account from "./components/Account";
import Register from "./components/Register";
import Login from "./components/Login";
import AllProducts from "./components/AllProducts";
import SingleProduct from "./components/SingleProduct";
import SingleCategory from "./components/SingleCategory";
import MyCart from "./components/MyCart";
import UserSettings from "./components/UserSettings";

function App() {
  const [token, setToken] = useState(null);

  return (
    <>
      <h1 className="logo">
        <img id="logo-image"
        src=""
        alt="terrarium store logo" />
        Terrarium
      </h1>
      <div id="container">
        <Navigation />
        <div id="main section">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account token={token} />} />
            <Route
              path="/register"
              element={<Register token={token} setToken={setToken} />}
            />
            <Route
              path="/login"
              element={<Login token={token} setToken={setToken} />}
            />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route path="/categories/:name" element={<SingleCategory />} />
            <Route path="/myCart" element={<MyCart token={token} />} />
            <Route
              path="/UserSettings"
              element={<UserSettings token={token} />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;

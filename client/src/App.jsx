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
import OrderConfirm from "./components/OrderConfirm";
import ForgotPassword from "./components/ForgotPassword";
import DeliveryData from "./components/DeliveryData";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  return (
    <>
      <h1 className="logo">
        <img
        src="https://d20zyr0oabjxc2.cloudfront.net/variants/media/raw_images/javierfarfanc/2021/05/20210515153021.569-C4A2F5CC-63E9-4E62-9-300x300-1.jpeg?signature=B6BBB4F82254480347A69373F92FA7BD91864E530D437CBBE51EB4D75D9A83BE" 
        alt="terrarium store logo" />
        Reptile World
      </h1>
      <div id="container">
        <Navigation token={token} />
        <div id="main section">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/account"
              element={<Account token={token} setToken={setToken} />}
            />
            <Route
              path="/register"
              element={
                <Register
                  user={user}
                  setUser={setUser}
                  token={token}
                  setToken={setToken}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login
                  user={user}
                  setUser={setUser}
                  token={token}
                  setToken={setToken}
                />
              }
            />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/products" element={<AllProducts />} />
            <Route
              path="/products/:id"
              element={<SingleProduct token={token} />}
            />
            <Route path="/categories/:name" element={<SingleCategory />} />
            <Route path="/myCart" element={<MyCart token={token} />} />
            <Route path="/checkout/delivery" element={<DeliveryData token={token} />} />
            <Route path="/checkout/confirm" element={<OrderConfirm token={token} />} />
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

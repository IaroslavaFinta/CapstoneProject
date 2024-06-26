import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function MyCart({ token }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState({});

  const getCartItems = async () => {
    try {
      const response = await fetch(
        `${API_URL}/mycart/cartitems`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      setCartItems(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  const getTotalPrice = async () => {
      try {
        const response = await fetch(
          `${API_URL}/mycart/cartitemsprice`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        setTotalPrice(result);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    getTotalPrice();
  }, []);

  async function changeQuantity(cartItemId, quantity) {
    try {
      const response = await fetch(`${API_URL}/mycart/cartitems/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity
        }),
      });
      const result = await response.json();
      await getCartItems();
      await getTotalPrice();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteItem(cartItemId) {
    try {
      const response = await fetch(`${API_URL}/mycart/cartitems/${cartItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Item could not be deleted.");
      }
      await getCartItems();
      await getTotalPrice();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteCartWhenCheckout() {
    try {
      const response = await fetch(`${API_URL}/mycart/cartitems`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Items could not be deleted.");
      }
      await getCartItems();
    } catch (error) {
      console.log(error);
    }
  }

  const navigateCheckoutDelivery = () => {
    navigate("/checkout/delivery");
  };

  return (
    <>
      <div className="cartItems">
        <h1>My Cart</h1>
        <div className="cartItems-display">
          {token ? (
            // if token is valid display cartItems
            cartItems.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((cartItem) => {
                    return (
                      <tr key={cartItem.id}>
                        <td>{cartItem.name}</td>
                        <td>{cartItem.quantity}</td>
                        <td>{cartItem.price}</td>
                        <button onClick={() => {changeQuantity(cartItem.id, +1)}}>+</button>
                        <button onClick={() => {changeQuantity(cartItem.id, -1)}}>-</button>
                        <button onClick={() => {deleteItem(cartItem.id)}}>Remove Item</button>
                      </tr>
                    );
                  })}
                </tbody>
              <h3>Total price: ${totalPrice.sum}</h3>
              <button onClick={() => {navigateCheckoutDelivery(); deleteCartWhenCheckout()}}>Checkout</button>
              </table>
            ) : (
              // if no items in cart display text
              <p>Cart is currently empty</p>
            )
          ) : (
            // if token is not valid link to register or login
            <h3>
              Please log in
              <button onClick={() => navigate("/login")}>Login</button>
              or register
              <button onClick={() => navigate("/register")}>Register</button>
              to your account
            </h3>
          )}
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    </>
  );
}

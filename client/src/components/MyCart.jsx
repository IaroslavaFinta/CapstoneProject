import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function MyCart({ token }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  let { id } = useParams();

  const getCartItems = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/mycart/cartitems`,
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

  async function changeQuantity() {
    try {
      const response = await fetch(`${API_URL}/api/mycart/cartitems`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteItem(cartItemId) {
    try {
      const response = await fetch(`${API_URL}/api/mycart/cartitems/${cartItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Item could not be deleted.");
      }
      await getCartItems();
    } catch (error) {
      console.log(error);
    }
  }

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
                        <button onClick={() => {changeQuantity()}}>Increase</button>
                        <button onClick={() => {deleteItem(cartItem.id)}}>Remove Item</button>
                      </tr>
                    );
                  })}
                </tbody>
                <button>Checkout</button>
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

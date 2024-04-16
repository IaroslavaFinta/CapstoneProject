import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function SingleProduct({ token }) {
  const [productDetails, setProductDetails] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProductDetails(result);
      } catch (error) {
        console.log(error);
      }
    };
    getSingleProduct();
  }, []);

  // logged in user can add item to cart
  async function handleClick() {
    try {
      console.log(token);
      const response = await fetch(`${API_URL}/mycart/cartitems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: 1,
          product_id: productDetails.id
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Item is added to cart");
      } else {
        setError("Unable to add this item to cart");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="singleProduct">
        <h1>{productDetails.name}</h1>
        <img src={productDetails.imageurl} alt="product image" />
        <h2>Description: {productDetails.description}</h2>
        <p>Price: {productDetails.price}</p>
        {token ? (
          <>
          <button onClick={()=>{handleClick()}}>Add Product</button>
          {successMessage && <p>{successMessage}</p>}
          {error && <p>{error}</p>}
          </>
        ) : (
          <p>Item is available for purchase, please log in</p>
        )}
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </>
  );
}

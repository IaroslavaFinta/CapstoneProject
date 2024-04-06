import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function SingleProduct({ token }) {
  const [productDetails, setProductDetails] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
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
      const response = await fetch(`${API_URL}/users/${id}/cart/cartProducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(),
      });
      const result = await response.json();
      setSuccessMessage(result.message);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="singleProduct">
        <h1>{productDetails.name}</h1>
        <img src={productDetails.imageURL} alt="product image" />
        <h2>Description: {productDetails.description}</h2>
        <p>Price: {productDetails.price}</p>
        {token ? (
          <button onClick={()=>{handleClick()}}>Add Product</button>
        ) : (
          <p>Item is available for purchase, please log in</p>
        )}
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </>
  );
}

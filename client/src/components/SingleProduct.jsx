import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function SingleProduct() {
  const [productDetails, setProductDetails] = useState({});
  const navigate = useNavigate();
  let { productId } = useParams();

  async function getSingleProduct() {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setProductDetails(result.product);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSingleProduct();
  }, [productDetails]);

  return (
    <>
      <div className="singleProduct">
        <h1>{productDetails.name}</h1>
        <h2>{productDetails.description}</h2>
        <p>{productDetails.price}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </>
  );
}

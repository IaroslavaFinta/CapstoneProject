import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function SingleProduct() {
  const [productDetails, setProductDetails] = useState({});
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    const getSingleProduct = async() => {
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

  return (
    <>
      <div className="singleProduct">
        <h1>{productDetails.name}</h1>
        <h2>Description: {productDetails.description}</h2>
        <p>Price: {productDetails.price}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function SingleCategory() {
  const [categoryDetails, setCategoryDetails] = useState({});
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    const getSingleCategory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setCategoryDetails(result);
      } catch (error) {
        console.log(error);
      }
    };
    getSingleCategory();
  }, []);

  return (
    <>
      <div className="singleCategory">
        {/* <h1>{categoryDetails.name}</h1> */}
        <ul className="categoryProducts">
          {categoryDetails.map((categoryDetail) => {
            return (
              <li key={categoryDetail.id} className="product">
                <h3>{categoryDetail.name}</h3>
                <p>Price: ${categoryDetail.price}</p>
                {/* <button onClick={() => navigate(`/products/${product.id}`)}>
                  View Product
                </button>
                <button>Add Product</button> */}
              </li>
            );
          })}
        </ul>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </>
  );
}

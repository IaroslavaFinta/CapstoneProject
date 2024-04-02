import { useState, useEffect } from "react";
import { API_URL } from "../main";
import { useNavigate } from "react-router-dom";

export default function AllProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch(`${API_URL}/api/products`);
      const json = await response.json();
      setProducts(json);
    };
    getProducts();
  }, []);

  return (
    <>
      <ul className="product">
        {products.map((product) => {
          return (
            <li key={product.id} className="product">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>{product.price}</p>
              <button onClick={() => navigate(`/products/${product.id}`)}>
                      View Product
              </button>
              <button>Add Product</button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

import { useState, useEffect } from "react";

export default function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch("/api/products");
      const json = await response.json();
      setProducts(json);
    };
    getProducts();
  }, []);

  return (
    <>
      <ul>
        {products.map((product) => {
          return (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>{product.price}</p>
              <button>View Product</button>
              <button>Add Product</button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

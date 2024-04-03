import { useState, useEffect } from "react";
import { API_URL } from "../main";
import { useNavigate } from "react-router-dom";

export default function AllProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch(`${API_URL}/api/products`);
      const json = await response.json();
      setProducts(json);
    };
    getProducts();
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  return (
    <>
      <div className="search-bar">
        <div className="input-wrapper">
          <input
            className="search-input"
            type="search"
            placeholder="Type to search for a product"
            value={searchInput}
            onChange={handleChange}
          />
        </div>
      </div>
      <ul className="product">
        {products
          .filter((product) =>
            product.name.toLowerCase().match(searchInput.toLowerCase())
          )
          .map((product) => {
            return (
              <li key={product.id} className="product">
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Category: {product.category_name}</p>
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

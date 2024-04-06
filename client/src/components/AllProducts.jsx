import { useState, useEffect } from "react";
import { API_URL } from "../main";
import { useNavigate } from "react-router-dom";
import AllCategories from "./AllCategories";

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
      <div>
        <AllCategories />
      </div>
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
                <img src={product.imageURL} alt="product image" />
                <p>Price: ${product.price}</p>
                <button onClick={() => navigate(`/products/${product.id}`)}>
                  View Product
                </button>
              </li>
            );
          })}
      </ul>
    </>
  );
}

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
      const response = await fetch(`${API_URL}/products`);
      const json = await response.json();
      setProducts(json);
    };
    getProducts();
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    console.log(products);
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
      <ul className="p-2.5 m-2.5 list-none justify-start grid grid-cols-2">
        {products
          .filter((product) =>
            product.name.toLowerCase().match(searchInput.toLowerCase())
          )
          .map((product) => {
            return (
              <li key={product.id} className="p-5">
                <h3 className="text-2xl">{product.name}</h3>
                <img
                  className="w-28"
                  src={product.imageurl}
                  alt="product image"
                />
                <p>Price: ${product.price}</p>
                <button
                  className="border-2 border-solid border-inherit
                   bg-white p-2 rounded-lg text-base m-2.5"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  View Product
                </button>
              </li>
            );
          })}
      </ul>
    </>
  );
}

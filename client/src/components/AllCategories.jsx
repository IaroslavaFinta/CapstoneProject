import { useState, useEffect } from "react";
import { API_URL } from "../main";
import { useNavigate } from "react-router-dom";

export default function AllCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetch(`${API_URL}/api/categories`);
      const json = await response.json();
      setCategories(json);
    };
    getCategories();
  }, []);

  return (
    <>
      <ul className="category">
        {categories
          .map((category) => {
            return (
              <li key={category.id} className="category">
                <h3>{category.name.toUpperCase()}</h3>
                <button onClick={() => navigate(`/categories/${category.id}`)}>
                  View Products
                </button>
              </li>
            );
          })}
      </ul>
    </>
  );
}
import { useState, useEffect } from "react";
import { API_URL } from "../main";
import { useNavigate } from "react-router-dom";

export default function AllCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetch(`${API_URL}/categories`);
      const json = await response.json();
      setCategories(json);
    };
    getCategories();
  }, []);

  return (
    <>
      <ul className="flex p-5">
        {categories
          .map((category) => {
            return (
              <li key={category.id} className="flex p-5">
                <h3 className="text-2xl">{category.name.toUpperCase()}</h3>
                <button
                className="border-2 border-solid border-inherit
                bg-white p-2 rounded-lg text-base m-2.5"
                onClick={() => navigate(`/categories/${category.name}`)}>
                  View Products
                </button>
              </li>
            );
          })}
      </ul>
    </>
  );
}
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function SingleCategory() {
  const [categoryDetails, setCategoryDetails] = useState([]);
  const navigate = useNavigate();
  let { name } = useParams();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const getSingleCategory = async () => {
      try {
        const response = await fetch(`${API_URL}/categories/${name}`, {
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

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  return (
    <>
      <div className="singleCategory">
        <h1>{name.toUpperCase()}</h1>
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
        <ul className="categoryProducts">
          {categoryDetails
            .filter((categoryDetail) =>
              categoryDetail.name.toLowerCase().match(searchInput.toLowerCase())
            )
            .map((categoryDetail) => {
              return (
                <>
                  <li key={categoryDetail.id} className="product">
                    <h3>{categoryDetail.name}</h3>
                    <img src={categoryDetail.imageurl} alt="product image" />
                    <p>Price: ${categoryDetail.price}</p>
                    <button
                      onClick={() => navigate(`/products/${categoryDetail.id}`)}
                    >
                      View Product
                    </button>
                  </li>
                </>
              );
            })}
        </ul>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </>
  );
}

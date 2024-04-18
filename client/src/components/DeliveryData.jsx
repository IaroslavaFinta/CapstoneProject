import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function DeliveryData({ token }) {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/checkout/delivery`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: `${address}`,
          city: `${city}`,
          state: `${state}`,
          zipcode: `${zipcode}`,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Submitted");
        console.log(result);
      } else {
        setError("Failed to submit");
        console.log(result);
      }
      // reset values for email and password.
      setAddress("");
      setCity("");
      setState("");
      setZipcode("");
    } catch (error) {
      console.log(error);
    }
  };

  const navigateOrderConfirm = () => {
    navigate("/checkout/confirm");
  };

  return (
    <>
      {token ? (
        <div>
          <h1>Please submit a form to get your delivery address</h1>
          <form className="form">
            <label htmlFor={"address"} className="firstName">
              Address:{" "}
              <input
                type={"address"}
                value={address}
                onChange={(ev) => setAddress(ev.target.value)}
              />
            </label>
            <label htmlFor={"city"} className="lastName">
              City:{" "}
              <input
                type={"city"}
                value={city}
                onChange={(ev) => setCity(ev.target.value)}
              />
            </label>
            <label htmlFor={"state"} className="phoneNumber">
              State:{" "}
              <input
                type={"state"}
                value={state}
                onChange={(ev) => setState(ev.target.value)}
              />
            </label>
            <label htmlFor={"zipcode"} className="phoneNumber">
              Zipcode:{" "}
              <input
                type={"zipcode"}
                value={zipcode}
                onChange={(ev) => setZipcode(ev.target.value)}
              />
            </label>
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </form>
          <button onClick={() => navigateOrderConfirm()}>Next</button>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      ) : (
        <div>
          <p>If you already has an account, just log in</p>
          <button onClick={() => navigate("/login")}>Log in</button>
        </div>
      )}
    </>
  );
}

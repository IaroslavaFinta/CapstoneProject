import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function Account({ token }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/myaccount`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        setUserData(result);
    } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, []);

  async function deleteUser() {
    try {
      const response = await fetch(`${API_URL}/api/myaccount`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error("User could not be deleted.");
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="account">
        <h1>Account</h1>
          {token ? (
            // if token is valid display MyCart button, settings button, delete user button
            <>
              <ul className="user">
                  <li key={userData.id}>
                    <h3>Email: {userData.email}</h3>
                    <h3>First Name: {userData.firstname}</h3>
                    <h3>Last Name: {userData.lastname}</h3>
                    <h3>Phone number: {userData.phonenumber}</h3>
                  </li>
              </ul>
              <button onClick={() => navigate("/myCart")}>MyCart</button>
              <button onClick={() => navigate("/UserSettings")}>User Settings</button>
              <button onClick={() => {deleteUser()}}>Delete User</button>
            </>
          ) : (
            // if token is not valid link to register or login
            <h3>
              Please log in
              <button onClick={() => navigate("/login")}>Login</button>
              or register
              <button onClick={() => navigate("/register")}>Register</button>
              to your account
            </h3>
          )
        }
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function Account({ token }) {
  const navigate = useNavigate();
  let { id } = useParams();
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetch(`${API_URL}/api/users`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await response.json();
      setUserData(json);
    };
    getUserData();
  }, []);

  async function deleteUser() {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
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
                {userData.map((user) => {
                    return (
                      <li key={user.id}>
                        <h3>Email: {user.email}</h3>
                        <h3>First Name: {user.firstName}</h3>
                        <h3>Last Name: {user.lastName}</h3>
                        <h3>Phone number: {user.phone_number}</h3>
                      </li>
                    );
                  })}
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

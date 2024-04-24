import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function Account({ token, setToken }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/myaccount`,
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
      const response = await fetch(`${API_URL}/auth/myaccount`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("User could not be deleted.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setToken({});
  };

  const navigateHome = () => {
    navigate("/");
    setToken({});
  };

  return (
    <>
      <div className="p-16">
        <h1 className="text-5xl">Account</h1>
          {token ? (
            // if token is valid display MyCart button, settings button, delete user button
            <>
              <ul className="p-2.5 m-2.5 list-none justify-start grid grid-cols-2">
                  <li className="p-5" key={userData.id}>
                    <h3 className="text-2xl">Email: {userData.email}</h3>
                    <h3 className="text-2xl">First Name: {userData.firstname}</h3>
                    <h3 className="text-2xl">Last Name: {userData.lastname}</h3>
                    <h3 className="text-2xl">Phone number: {userData.phonenumber}</h3>
                  </li>
              </ul>
              <button className="border-2 border-solid border-inherit
                   bg-white p-2 rounded-lg text-base m-2.5" onClick={() => navigate("/myCart")}>My Cart</button>
              <button className="border-2 border-solid border-inherit
                   bg-white p-2 rounded-lg text-base m-2.5"
                   >My Orders</button>
              <button className="border-2 border-solid border-inherit
                   bg-white p-2 rounded-lg text-base m-2.5"
                   onClick={() => navigate("/UserSettings")}>User Settings</button>
              <button className="border-2 border-solid border-inherit
                   bg-white p-2 rounded-lg text-base m-2.5"
                   onClick={() => {deleteUser(); navigateHome()}}>Delete User</button>
              <button className="border-2 border-solid border-inherit
                   bg-white p-2 rounded-lg text-base m-2.5"
                   onClick={() => {logout(); navigateHome()}}>Logout</button>
            </>
          ) : (
            // if token is not valid link to register or login
            <h3 className="text-2xl">
              Please log in
              <button
                className="border-2 border-solid border-inherit
                    bg-white p-2 rounded-lg text-base m-2.5"
                onClick={() => navigate("/login")}>Login</button>
              or register
              <button
                className="border-2 border-solid border-inherit
                bg-white p-2 rounded-lg text-base m-2.5"
                onClick={() => navigate("/register")}>Register</button>
                to your account
            </h3>
          )
        }
      </div>
    </>
  );
}

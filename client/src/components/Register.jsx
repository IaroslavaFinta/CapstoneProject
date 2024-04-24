import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function Register({ user, setUser, token, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = (ev) => {
    ev.preventDefault();
    register({ email, password });
  };

  const register = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        window.localStorage.setItem("token", result.token);
        setSuccessMessage(
          "Registered successfully. Please log in to your account"
        );
        setToken(result.token);
        setUser(email);
      } else {
        setError("Failed to register");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function validateForm() {
    if (password.length < 5) {
      alert(
        "Invalid Form, Password must contain greater than or equal to 5 characters."
      );
      return;
    }
    if (email == password) {
      alert("Invalid Form, Password cant be the same as email.");
      return;
    }
  }

  return (
    <>
      {token ? (
        <h1 className="text-5xl">Logged in as {user}</h1>
      ) : (
        <div className="login">
          <h1 className="text-5xl">Register</h1>
          {error && <p>{error}</p>}
          {successMessage && <p>{successMessage}</p>}
          <form className="form" onSubmit={submit}>
            <label htmlFor={"email"} className="email">
              Email address:{" "}
              <input
                type={"email"}
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </label>
            <label htmlFor={"password"} className="password">
              Password:{" "}
              <input
                type={"password"}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </label>
            <button
              disabled={!email || !password}
              type="submit"
              onClick={() => {
                validateForm();
              }}
            >
              Register
            </button>
          </form>
          <p>If you already has an account, just log in</p>
          <button onClick={() => navigate("/login")}>Log in</button>
        </div>
      )}
    </>
  );
}

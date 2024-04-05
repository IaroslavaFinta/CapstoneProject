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
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        window.localStorage.setItem("token", result.token);
        setSuccessMessage("Registered");
        setToken(result.token);
        setUser(email);
        console.log(result);
      } else {
        setError("Failed to register");
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {token ? (
        <h1>Logged in as {user}</h1>
      ) : (
        <div className="login">
          <h1>Register</h1>
          <form className="form" onSubmit={submit}>
            <label htmlFor={"email"} className="email">
              Email address:{" "}
              <input
                type={"email"}
                value={email}
                placeholder="email"
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </label>
            <label htmlFor={"password"} className="password">
              Password:{" "}
              <input
                type={"password"}
                value={password}
                placeholder="password"
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </label>
            <button disabled={!email || !password}>Register</button>
          </form>
          <p>If you already has an account, just log in</p>
          <button onClick={() => navigate("/login")}>Log in</button>
        </div>
      )}
    </>
  );
}

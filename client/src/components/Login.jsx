import { useState } from "react";
import { API_URL } from "../main";

export default function Login({ user, setUser, token, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const submit = (ev) => {
    ev.preventDefault();
    login({ email, password });
  };

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      
      if (response.ok) {
        console.log(result);
      } else {
        window.localStorage.removeItem("token");
      }
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
      });
      const result = await response.json();
      if (response.ok) {
        window.localStorage.setItem("token", result.token);
        setToken(result.token);
        attemptLoginWithToken();
        setUser(`${email}`);
        setSuccessMessage("Login success");
      } else {
        setError("Failed to login");
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setToken({});
  };

  return (
    <>
      {!token ?
      (
        <div>
          <form className="form"
        onSubmit={submit}>
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
          <button disabled={!email || !password}>Login</button>
        </form>
        <p>Don't have an account yet?</p>
        <button onClick={() => navigate("/register")}>Sign Up</button>
        </div>
      ) : (
        <div>
          <h1>Logged in as {user}</h1>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </>
  );
}

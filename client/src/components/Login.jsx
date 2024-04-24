import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../main";

export default function Login({ user, setUser, token, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const submit = (ev) => {
    ev.preventDefault();
    login({ email, password });
  };

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const response = await fetch(`${API_URL}/auth/me`, {
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
      const response = await fetch(`${API_URL}/auth/login`, {
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
        setError("Failed to login. Please use correct password or register");
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
      {!token ? (
        <div>
          <h1 className="text-5xl">Login</h1>
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
            className="border-2 border-solid border-inherit
            bg-white p-2 rounded-lg text-base m-2.5"
            disabled={!email || !password}>Login</button>
          </form>
          <p>Forget password?</p>
          <button 
          className="border-2 border-solid border-inherit
          bg-white p-2 rounded-lg text-base m-2.5"
          onClick={() => navigate("/forgotpassword")}>
            Password reset
          </button>
          <p>Don't have an account yet?</p>
          <button 
          className="border-2 border-solid border-inherit
          bg-white p-2 rounded-lg text-base m-2.5"
          onClick={() => navigate("/register")}>Register</button>
        </div>
      ) : (
        <div>
          <h1 className="text-5xl">Logged in as {user}</h1>
          <button 
          className="border-2 border-solid border-inherit
          bg-white p-2 rounded-lg text-base m-2.5"
          onClick={logout}>Logout</button>
        </div>
      )}
    </>
  );
}

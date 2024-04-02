import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const submit = (ev) => {
    ev.preventDefault();
    login({ email, password });
  };

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: token,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setAuth(result);
      } else {
        window.localStorage.removeItem("token");
      }
    }
  };

  const login = async (credentials) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (response.ok) {
      window.localStorage.setItem("token", result.token);
      attemptLoginWithToken();
      setSuccessMessage("Login success");
    } else {
      setError("Failed to login");
      console.log(result);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setAuth({});
  };

  return (
    <>
      {!auth.id ?
      (
        <form onSubmit={submit}>
          <input
            value={email}
            placeholder="email"
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            value={password}
            placeholder="password"
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button disabled={!email || !password}>Login</button>
        </form>
      ) : (
        <button onClick={logout}>Logout {auth.email}</button>
      )}
    </>
  );
}

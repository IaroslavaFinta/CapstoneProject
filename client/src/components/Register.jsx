import { useState } from "react";
import { API_URL } from "../main";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const submit = (ev) => {
    ev.preventDefault();
    register({ email, password });
  };

  const register = async (credentials) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem("token", json.token);
      setSuccessMessage("Registered");
      console.log(json);
    } else {
      setError("Failed to register");
      console.log(json);
    }
  };

  return (
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
      <button disabled={!email || !password}>Register</button>
    </form>
  );
}
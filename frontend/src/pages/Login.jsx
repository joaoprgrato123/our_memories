import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const theme = useOutletContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.status === 401) {
        setError("Wrong email or password.");
        return;
      }

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      navigate("/planning");
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server.");
    }
  };

  return (
    <>
      <h1 className="page-title">Login</h1>

      <div className="page-container" style={{ background: theme?.container }}>
        <div className="login-container">
          <div className="field-row">
            <label htmlFor="email">Email:</label>

            <input
              id="email"
              type="email"
              placeholder="Email"
              title="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={error ? "login-input-error" : ""}
            />
          </div>

          <div className="field-row">
            <label htmlFor="password">Password:</label>

            <input
              id="password"
              type="password"
              placeholder="Password"
              title="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className={error ? "login-input-error" : ""}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}

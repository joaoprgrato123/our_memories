import { useOutletContext } from "react-router-dom";

export default function Login() {
  const theme = useOutletContext();

  return (
    <>
      <h1 className="page-title">Login</h1>

      <div className="page-container" style={{ background: theme?.container }}>
        <div className="login-container">
          <div className="field-row">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              title="Username"
            />
          </div>

          <div className="field-row">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              title="Password"
            />
          </div>

          <button type="button">Login</button>
        </div>
      </div>
    </>
  );
}

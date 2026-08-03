import { Navigate, Outlet, useOutletContext } from "react-router-dom";

export default function ProtectedRoute() {
  const context = useOutletContext();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={context} />;
}
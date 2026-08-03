import AppLayout from "./components/common/AppLayout";
import Login from "./pages/Login";
import Planning from "./pages/Planning";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Garden from "./pages/Garden";
import MTG from "./pages/Magic";
import Resources from "./pages/Resources";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Planning /> },
          { path: "planning", element: <Planning /> },
          { path: "movies", element: <Movies /> },
          { path: "tvshows", element: <TVShows /> },
          { path: "garden", element: <Garden /> },
          { path: "mtg", element: <MTG /> },
          { path: "resources", element: <Resources /> },
        ],
      },
    ],
  },
]);

import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const location = useLocation();

  const pageThemes = {
     login: {
      background: "#ea8ab1",
      container: "#f4c8db",
      firstEvenItem: "#e7659a",
    },
    planning: {
      background: "#8a98ea",
      container: "#b4bbee",
      firstCardTitle: "#9099da",
      firstEvenItem: "#d0d4f0",
      firstOddItem: "#b4bbee",
      secondCardTitle: "#8aa9ea",
      secondEvenItem: "#dae9ff",
      secondOddItem: "#b4ccf9",
      thirdCardTitle: "#90c6da",
      thirdEvenItem: "#d0ecf0",
      thirdOddItem: "#b4e7ee",
    },
    movies: {
      background: "#54abb2",
      container: "#b4f4f9",
      firstCardTitle: "#5ac3cc",
      firstEvenItem: "#baf0f5",
      firstOddItem: "#86dde5",
      secondCardTitle: "#5aa7cc",
      secondEvenItem: "#bbe6fb",
      secondOddItem: "#8fd0f0",
    },

    tvshows: {
      background: "#ead80e",
      container: "#f9eeb4",
      firstCardTitle: "#dfcc00",
      firstEvenItem: "#f5f3ba",
      firstOddItem: "#f6ef7f",
      secondCardTitle: "#e4bd09",
      secondEvenItem: "#fbefbb",
      secondOddItem: "#f0e18f",
    },

    garden: {
      background: "#54b261",
      container: "#b4f9b8",
      firstCardTitle: "#5acc5d",
      firstEvenItem: "#bff5ba",
      firstOddItem: "#8be586",
      secondCardTitle: "#90e409",
      secondEvenItem: "#e8fbbb",
      secondOddItem: "#c5f08f",
    },

    mtg: {
      background: "#b28854",
      container: "#f9dab4",
      firstCardTitle: "#cc9d5a",
      firstEvenItem: "#f5deba",
      firstOddItem: "#e5c386",
      secondCardTitle: "#e4b009",
      secondEvenItem: "#fbf3bb",
      secondOddItem: "#f0dc8f",
    },

    resources: {
      background: "#b25454",
      container: "#f9b4b4",
      firstEvenItem: "#e58686",
      firstOddItem: "#f5baba",
    },
  };

  const pageKey = location.pathname.split("/")[1] || "planning";

  const theme = pageThemes[pageKey];

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content" style={{ background: theme.background }}>
        <Outlet context={theme} />
      </main>
    </div>
  );
}

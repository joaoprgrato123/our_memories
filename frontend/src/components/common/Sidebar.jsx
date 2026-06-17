import { Link } from "react-router-dom";
import "../../styles/sidebar.css";
import logo from "/assets/logo.jpg";

import {
  PiPlant,
  PiMonitorPlay,
  PiCalendarDots,
  PiPopcorn,
  PiLink,
} from "react-icons/pi";
import { GiMagicPortal } from "react-icons/gi";

const links = [
  {
    path: "/planning",
    label: "Planning",
    icon: <PiCalendarDots />,
    color: "#b4bbee",
  },
  {
    path: "/movies",
    label: "Movies",
    icon: <PiPopcorn />,
    color: "#b4f4f9",
  },
  {
    path: "/tvshows",
    label: "TV Shows",
    icon: <PiMonitorPlay />,
    color: "#f9eeb4",
  },
  {
    path: "/garden",
    label: "Garden",
    icon: <PiPlant />,
    color: "#b4f9b8",
  },
  {
    path: "/mtg",
    label: "Magic The Gathering",
    icon: <GiMagicPortal />,
    color: "#f9dab4",
  },
  {
    path: "/resources",
    label: "Resources",
    icon: <PiLink />,
    color: "#f9b4b4",
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="logo">
        <Link to="/">
          <img src={logo} alt="OM logo" />
        </Link>
      </h1>

      <nav className="nav">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="nav-link"
            title={link.label}
            style={{ backgroundColor: link.color }}
          >
            <span className="nav-icon">{link.icon}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

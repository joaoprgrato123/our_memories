import "../../styles/header.css";
import { MdSearch } from "react-icons/md";

export default function Header({
  title,
  placeholder = "Search...",
  search,
  onSearch,
}) {
  return (
    <header className="page-header">
      <h1 className="page-title">{title}</h1>

      <div className="search-container">
        <MdSearch className="search-icon" />

        <input
          type="text"
          placeholder={placeholder}
          className="search-input"
          value={search}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </header>
  );
}

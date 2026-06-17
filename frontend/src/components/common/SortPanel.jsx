export default function SortPanel({
  options = [],
  selected,
  onSelect,
  activeColor,
}) {
  return (
    <aside className="sort-panel">
      <ul>
        {options.map((opt) => {
          const isSelected = selected === opt;

          return (
            <li
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                  color: isSelected ? activeColor : "black",
              }}
            >
              <span style={{ flex: 1 }}>{opt}</span>

              <span
                style={{
                  width: 22,
                  textAlign: "right",
                  color: isSelected ? activeColor : "transparent",
                }}
              >
                ✔
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default function ItemCard({
  title,
  showCheckbox,
  checked,
  onToggle,
  checkboxColor,
  checkboxIcon = "✓",
}) {
  return (
    <div className="flex-container">
      <span>{title}</span>

      {showCheckbox && (
        <label className="custom-checkbox">
          <input type="checkbox" checked={checked} onChange={onToggle} readOnly/>

          <span
            className="checkmark"
            style={{
              "--check-color": checkboxColor,
              "border": "2px solid " + checkboxColor
            }}
          >
            {checked && checkboxIcon}
          </span>
        </label>
      )}
    </div>
  );
}

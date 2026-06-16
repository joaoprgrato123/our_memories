import { useState } from "react";

export default function ItemModal({
  open,
  onClose,
  mode = "add",
  item,
  colors,
  fields,
  setMode,
  checkboxIcon,
  columnTitle,
}) {
  const [formData, setFormData] = useState(item || {});
  const [hoverValue, setHoverValue] = useState(null);

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const readOnly = isView;

  const inputProps = {
    readOnly,
    style: isView
      ? {
          background: "transparent",
          border: "none",
          pointerEvents: "none",
          color: "inherit",
        }
      : {},
  };

  const headerFields = fields.filter((f) => f.section === "header");
  const bodyFields = fields.filter((f) => f.section === "body");

  if (!open) return null;

  const renderStars = (value = 0, fieldName) => {
    const stars = [];

    const displayValue = hoverValue ?? value;

    for (let i = 1; i <= 5; i++) {
      const isFull = displayValue >= i;
      const isHalf = displayValue >= i - 0.5 && displayValue < i;

      stars.push(
        <span
          key={i}
          style={{
            cursor: isView ? "default" : "pointer",
            fontSize: "24px",
            position: "relative",
          }}
          onMouseMove={(e) => {
            if (isView) return;

            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const isLeft = x < rect.width / 2;
            const newValue = isLeft ? i - 0.5 : i;

            setHoverValue(newValue);
          }}
          onMouseLeave={() => {
            if (isView) return;
            setHoverValue(null);
          }}
          onClick={() => {
            if (isView) return;

            setFormData((prev) => ({
              ...prev,
              [fieldName]: hoverValue ?? i,
            }));
          }}
        >
          {isFull ? (
            "★"
          ) : isHalf ? (
            <span style={{ position: "relative" }}>
              <span style={{ color: "transparent" }}>★</span>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  width: "50%",
                  overflow: "hidden",
                  color: "black",
                }}
              >
                ★
              </span>
            </span>
          ) : (
            "☆"
          )}
        </span>,
      );
    }

    return stars;
  };

  const renderFields = (groupFields) => {
    const rows = [];
    let current = [];

    for (let i = 0; i < groupFields.length; i++) {
      const field = groupFields[i];
      const group = field.group || field.name;

      const prevGroup =
        i > 0 ? groupFields[i - 1].group || groupFields[i - 1].name : null;

      if (prevGroup === null || group === prevGroup) {
        current.push(field);
      } else {
        rows.push(current);
        current = [field];
      }
    }

    if (current.length) rows.push(current);

    return rows.map((row, rowIndex) => {
      const elements = [];

      row.forEach((field, idx) => {
        if (field.label) {
          elements.push(
            <label key={`l-${field.name}`}>{field.placeholder}:</label>,
          );
        }

        if (field.type === "rating") {
          elements.push(
            <div
              key={field.name}
              className="rating-field"
              title={field.placeholder}
            >
              {renderStars(formData?.[field.name] || 0, field.name)}
            </div>,
          );
        } else if (field.type === "checkbox") {
          elements.push(
            <label
              key={field.name}
              className="custom-checkbox"
              style={{
                position: "static",
              }}
            >
              <input
                type="checkbox"
                checked={!!formData?.[field.name]}
                disabled={isView}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: !prev?.[field.name],
                  }))
                }
              />

              <span
                className="checkmark"
                title={field.placeholder}
                style={{
                  "--check-color": colors.title,
                  border: `2px solid ${colors.title}`,
                }}
              >
                {formData?.[field.name] && checkboxIcon}
              </span>
            </label>,
          );
        } else if (field.type === "static") {
          elements.push(
            <div key={field.name} className="static-field">
              {field.label && <label>{field.placeholder}:</label>}
              <span>{columnTitle}</span>
            </div>,
          );
        } else {
          elements.push(
            <input
              key={field.name}
              type={field.type}
              min={0}
              placeholder={field.placeholder}
              title={field.placeholder}
              defaultValue={item?.[field.name] || ""}
              className={field.title ? "title-modal" : ""}
              {...inputProps}
            />,
          );
        }

        if (
          idx < row.length - 1 &&
          row[idx].type === "date" &&
          row[idx + 1].type === "date"
        ) {
          elements.push(
            <p key={`sep-${field.name}`} style={{ margin: "0 6px" }}>
              -
            </p>,
          );
        }
      });

      return (
        <div className="field-row" key={rowIndex}>
          {elements}
        </div>
      );
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ background: colors.background }}
      >
        <div className="modal-content">
          {/* HEADER */}
         {headerFields.length > 0 && (
  <div
    className="title-border-wrapper"
    style={{ background: colors.title }}
  >
    <div className="title-container-modal">
      {renderFields(headerFields)}
    </div>
  </div>
)}

          {/* BODY */}
          <div
            className="body-container-modal"
            style={{ background: colors.body }}
          >
            {renderFields(bodyFields)}

            <div className="modal-actions">
              {isView ? (
                <>
                  <button
                    className="primary"
                    style={{ background: colors.title }}
                    onClick={() => setMode("edit")}
                  >
                    Edit ✎
                  </button>
                  <button className="danger">Delete ☓</button>
                </>
              ) : (
                <>
                  <button
                    className="primary"
                    style={{ background: colors.title }}
                  >
                    {isEdit ? "Save ✓" : "Add +"}
                  </button>
                  {isEdit && <button className="danger">Delete ☓</button>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

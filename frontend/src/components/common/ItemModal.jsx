import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

export default function ItemModal({
  open,
  onClose,
  onSave,
  onDelete,
  mode = "add",
  item,
  colors,
  fields,
  setMode,
  checkboxIcon,
  columnTitle,
}) {
  const [hoverValue, setHoverValue] = useState(null);
  const emojiPickerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const headerFields = fields.filter((f) => f.section === "header");
  const bodyFields = fields.filter((f) => f.section === "body");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toISODate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toISOString();
  };

  const toDateInput = (value) => {
    if (!value) return "";
    return new Date(value).toISOString().split("T")[0];
  };

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const normalizeItem = (item) => {
    if (!item) {
      const newItem = {};

      fields.forEach((field) => {
        if (field.name === "added_date") {
          newItem[field.name] = getToday();
        }
      });

      return newItem;
    }

    const normalized = { ...item };

    fields.forEach((field) => {
      if (field.type === "date" && item[field.name]) {
        normalized[field.name] = toDateInput(item[field.name]);
      }
    });

    return normalized;
  };

  const getInitialFormData = () => {
    if (item) {
      return normalizeItem(item);
    }

    return {
      added_date: new Date().toISOString().split("T")[0],
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);

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
                  color: "inherit",
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
            <label
              key={`l-${field.name}`}
              style={{ color: colors.title, filter: "brightness(0.8)" }}
            >
              {field.placeholder}:
            </label>,
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
              className={`custom-checkbox ${isView ? "view-only" : ""}`}
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
        } else if (field.type === "emoji") {
          elements.push(
            <div
              key={field.name}
              ref={emojiPickerRef}
              style={{ position: "relative" }}
            >
              <button
                type="button"
                className="emoji-input"
                onClick={() => {
                  if (!isView) {
                    setShowEmojiPicker((prev) => !prev);
                  }
                }}
                style={{
                  cursor: isView ? "default" : "pointer",
                  fontSize: "24px",
                }}
              >
                {formData?.[field.name] || "😀"}
              </button>

              {showEmojiPicker && !isView && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 1000,
                  }}
                >
                  <EmojiPicker
                    theme="auto"
                    emojiStyle="native"
                    onEmojiClick={(emojiData) => {
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: emojiData.emoji,
                      }));

                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}
            </div>,
          );
        } else {
          elements.push(
            isView ? (
              <>
                <span
                  key={field.name}
                  className={
                    field.title
                      ? "view-field-value title-modal"
                      : "view-field-value"
                  }
                  title={field.placeholder}
                >
                  {formData?.[field.name] ?? ""}
                </span>
                {field.suffix && (
                  <span style={{ marginLeft: "6px" }}>{field.suffix}</span>
                )}
              </>
            ) : (
              <>
                <input
                  key={field.name}
                  type={field.type}
                  min={0}
                  placeholder={field.placeholder}
                  title={field.placeholder}
                  value={formData?.[field.name] ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]:
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                    }))
                  }
                  className={field.title ? "title-modal" : ""}
                />

                {field.suffix && (
                  <span style={{ marginLeft: "6px" }}>{field.suffix}</span>
                )}
              </>
            ),
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
                  <button
                    className="danger"
                    onClick={async () => {
                      await onDelete?.(formData.id);
                      onClose?.();
                    }}
                  >
                    Delete ☓
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="primary"
                    style={{ background: colors.title }}
                    onClick={async () => {
                      const buildPayload = (formData) => {
                        const payload = { ...formData };

                        fields.forEach((f) => {
                          if (f.type === "date") {
                            payload[f.name] = toISODate(payload[f.name]);
                          }
                        });

                        return payload;
                      };
                      const payload = buildPayload(formData);

                      await onSave?.(
                        {
                          ...payload,
                          ...(columnTitle === "Juju" || columnTitle === "Dudi"
                            ? { owner: columnTitle.toLowerCase() }
                            : { status: columnTitle.toLowerCase() }),
                        },
                        mode,
                      );

                      onClose?.();
                    }}
                  >
                    {isEdit ? "Save ✓" : "Add +"}
                  </button>
                  {isEdit && (
                    <button
                      className="danger"
                      onClick={async () => {
                        await onDelete?.(formData.id);
                        onClose?.();
                      }}
                    >
                      Delete ☓
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

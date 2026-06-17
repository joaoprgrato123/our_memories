import { useEffect, useRef, useState } from "react";

import ItemCard from "./ItemCard";
import SortPanel from "./SortPanel";
import ItemModal from "./ItemModal";

export default function ItemColumn({
  title,
  items,
  theme,
  variant,
  showCheckbox,
  checkedItems = {},
  checkboxIcon,
  sortOptions = [],
  fields,
  onSave,
  onDelete,
}) {
  const colors = {
    first: {
      title: theme.firstCardTitle,
      even: theme.firstEvenItem,
      odd: theme.firstOddItem,
    },

    second: {
      title: theme.secondCardTitle,
      even: theme.secondEvenItem,
      odd: theme.secondOddItem,
    },

    third: {
      title: theme.thirdCardTitle,
      even: theme.thirdEvenItem,
      odd: theme.thirdOddItem,
    },
  };

  const titleColor = colors[variant].title;
  const evenColor = colors[variant].even;
  const oddColor = colors[variant].odd;

  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef(null);
  const isResources =
    Array.isArray(items) && typeof items[0] === "object" && "icon" in items[0];
  const [sortSelected, setSortSelected] = useState(sortOptions?.[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSort(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="item-column">
      <div className="column-header" style={{ background: titleColor }}>
        <h2 className="item-title">{title}</h2>

        <div className="actions" ref={sortRef}>
          <button
            className="action-button"
            onClick={() => {
              setSelectedItem(null);
              setModalMode("add");
              setModalOpen(true);
            }}
          >
            +
          </button>

          {!isResources && (
            <button
              className="action-button"
              onClick={() => setShowSort((prev) => !prev)}
            >
              ⇅
            </button>
          )}

          {showSort && !isResources && (
            <SortPanel
              options={sortOptions}
              selected={sortSelected}
              onSelect={(opt) => setSortSelected(opt)}
              activeColor={titleColor}
            />
          )}
        </div>
      </div>

      <div className="column-items">
        {isResources ? (
          <div className="resources-grid">
            {items.map((item, index) => {
              const row = Math.floor(index / 2);
              const col = index % 2;
              const isEvenRow = row % 2 === 0;
              const isEvenCell = col === 0;

              const useEvenColor =
                (isEvenRow && isEvenCell) || (!isEvenRow && !isEvenCell);

              return (
                <a
                  key={item.link}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card"
                  style={{
                    backgroundColor: useEvenColor ? evenColor : oddColor,
                  }}
                >
                  <span>{item.label}</span>
                  <span className="resource-icon">{item.icon}</span>
                </a>
              );
            })}
          </div>
        ) : (
          (items || []).map((item, index) => {
            const isChecked = !!checkedItems?.[item.id];

            return (
              <div
                key={item.id}
                className="item-card-container"
                style={{
                  backgroundColor: index % 2 === 0 ? oddColor : evenColor,
                }}
                onClick={() => {
                  setSelectedItem(item);
                  setModalMode("view");
                  setModalOpen(true);
                }}
              >
                <ItemCard
                  title={item.name ?? item.title}
                  showCheckbox={showCheckbox}
                  checked={isChecked}
                  checkboxColor={titleColor}
                  checkboxIcon={checkboxIcon}
                />
              </div>
            );
          })
        )}
      </div>

      <ItemModal
        key={selectedItem?.id || "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
        onDelete={onDelete}
        mode={modalMode}
        setMode={setModalMode}
        item={selectedItem}
        colors={{
          title: titleColor,
          background: oddColor,
          body: evenColor,
        }}
        fields={fields}
        checkboxIcon={checkboxIcon}
        columnTitle={title}
      />
    </section>
  );
}

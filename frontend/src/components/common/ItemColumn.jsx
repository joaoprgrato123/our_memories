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
  onMove,
  dropStatus,
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
  const [sortDirection, setSortDirection] = useState("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);

  const sortedItems = [...(items || [])].sort((a, b) => {
    switch (sortSelected) {
      case "Name":
      case "Title":
        return sortDirection === "asc"
          ? String(a.name ?? a.title ?? "").localeCompare(
              String(b.name ?? b.title ?? ""),
            )
          : String(b.name ?? b.title ?? "").localeCompare(
              String(a.name ?? a.title ?? ""),
            );

      case "Planted":
        return sortDirection === "asc"
          ? Number(a.planted) - Number(b.planted)
          : Number(b.planted) - Number(a.planted);

      case "Cost":
        return sortDirection === "asc"
          ? Number(a.cost) - Number(b.cost)
          : Number(b.cost) - Number(a.cost);

      case "Owned":
        return sortDirection === "asc"
          ? Number(a.owned) - Number(b.owned)
          : Number(b.owned) - Number(a.owned);

      case "Amount":
        return sortDirection === "asc"
          ? Number(a.amount ?? 0) - Number(b.amount ?? 0)
          : Number(b.amount ?? 0) - Number(a.amount ?? 0);

      case "Rate":
      case "Score":
        return sortDirection === "asc"
          ? Number(a.score ?? 0) - Number(b.score ?? 0)
          : Number(b.score ?? 0) - Number(a.score ?? 0);

      case "Seed Season":
        return sortDirection === "asc"
          ? String(a.seed_season ?? "").localeCompare(
              String(b.seed_season ?? ""),
            )
          : String(b.seed_season ?? "").localeCompare(
              String(a.seed_season ?? ""),
            );

      case "Genre":
        return sortDirection === "asc"
          ? String(a.genre ?? "").localeCompare(String(b.genre ?? ""))
          : String(b.genre ?? "").localeCompare(String(a.genre ?? ""));

      case "Duration":
        return sortDirection === "asc"
          ? Number(a.duration ?? 0) - Number(b.duration ?? 0)
          : Number(b.duration ?? 0) - Number(a.duration ?? 0);

      case "Added Date":
        return sortDirection === "asc"
          ? new Date(a.added_date ?? 0) - new Date(b.added_date ?? 0)
          : new Date(b.added_date ?? 0) - new Date(a.added_date ?? 0);

      case "Date":
        return sortDirection === "asc"
          ? new Date(a.date ?? 0) - new Date(b.date ?? 0)
          : new Date(b.date ?? 0) - new Date(a.date ?? 0);

      case "Location":
        return sortDirection === "asc"
          ? String(a.location ?? "").localeCompare(String(b.location ?? ""))
          : String(b.location ?? "").localeCompare(String(a.location ?? ""));

      default:
        return 0;
    }
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSort(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDragStart = (event, item) => {
    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (!onMove) {
      return;
    }

    const itemData = event.dataTransfer.getData("application/json");

    if (!itemData) {
      return;
    }

    const item = JSON.parse(itemData);

    onMove(item, dropStatus);
  };

  return (
    <section
      className="item-column"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
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
              onSelect={(opt) => {
                if (opt === sortSelected) {
                  setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                } else {
                  setSortSelected(opt);
                  setSortDirection("asc");
                }
              }}
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
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card"
                  style={{
                    backgroundColor: useEvenColor ? evenColor : oddColor,
                  }}
                >
                  <span>
                    {item.name}

                    <button
                      className="resources-edit-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        setSelectedItem(item);
                        setModalMode("edit");
                        setModalOpen(true);
                      }}
                    >
                      ✎
                    </button>
                  </span>

                  <span className="resource-icon">{item.icon}</span>
                </a>
              );
            })}
          </div>
        ) : (
          sortedItems.map((item, index) => {
            const isChecked = !!checkedItems?.[item.id];

            return (
              <div
                key={item.id}
                className="item-card-container"
                draggable
                onDragStart={(event) => handleDragStart(event, item)}
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

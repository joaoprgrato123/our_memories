import Header from "../components/common/Header";
import ItemColumn from "../components/common/ItemColumn";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MTG() {
  const theme = useOutletContext();
  const [checkedItems, setCheckedItems] = useState({});
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");

  const refreshCards = async () => {
    const res = await fetch("http://localhost:8080/cards");
    const json = await res.json();

    const normalized = Array.isArray(json) ? json : json.cards;

    setCards(normalized || []);

    const initialChecked = {};
    (normalized || []).forEach((card) => {
      initialChecked[card.id] = card.owned;
    });

    setCheckedItems(initialChecked);
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:8080/cards");
      const data = await res.json();

      const normalized = Array.isArray(data) ? data : data.cards;

      setCards(normalized || []);

      const initialChecked = {};
      (normalized || []).forEach((card) => {
        initialChecked[card.id] = card.owned;
      });

      setCheckedItems(initialChecked);
    };

    load().catch((err) => console.error("Error fetching cards:", err));
  }, []);

  const handleSave = async (data, mode) => {
    if (mode === "edit") {
      await fetch(`http://localhost:8080/cards/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`http://localhost:8080/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    await refreshCards();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/cards/${id}`, {
      method: "DELETE",
    });

    await refreshCards();
  };

  const sortOptions = ["Name", "Amount", "Cost", "Owned"];

  const fields = [
    {
      name: "name",
      placeholder: "Name",
      type: "text",
      section: "header",
      title: true,
    },
    {
      name: "owner",
      placeholder: "Owner",
      type: "static",
      section: "header",
    },
    {
      name: "cost",
      placeholder: "Cost",
      type: "number",
      section: "body",
      label: true,
    },
    {
      name: "owned",
      placeholder: "Owned",
      type: "checkbox",
      section: "body",
      label: true,
      group: "1",
    },
    {
      name: "amount",
      placeholder: "Amount",
      type: "number",
      section: "body",
      label: true,
      group: "1",
    },
    {
      name: "link",
      placeholder: "Link",
      type: "url",
      section: "body",
      label: true,
    },
  ];

  const searchField = fields[0]?.name;

  const filteredCards = cards.filter((card) =>
    String(card[searchField] ?? "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const jujuCards = filteredCards.filter((c) => c.owner === "juju");
  const dudiCards = filteredCards.filter((c) => c.owner === "dudi");

  return (
    <>
      <Header
        title="Magic The Gathering"
        placeholder="Search card..."
        search={search}
        onSearch={setSearch}
      />

      <div className="page-container" style={{ background: theme.container }}>
        <ItemColumn
          title="Juju"
          items={jujuCards}
          theme={theme}
          variant="first"
          showCheckbox
          checkedItems={checkedItems}
          checkboxIcon="✵"
          sortOptions={sortOptions}
          fields={fields}
          onSave={handleSave}
          onDelete={handleDelete}
        />

        <ItemColumn
          title="Dudi"
          items={dudiCards}
          theme={theme}
          variant="second"
          showCheckbox
          checkedItems={checkedItems}
          checkboxIcon="𖤓"
          sortOptions={sortOptions}
          fields={fields}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

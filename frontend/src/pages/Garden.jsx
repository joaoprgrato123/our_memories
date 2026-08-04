import Header from "../components/common/Header";
import ItemColumn from "../components/common/ItemColumn";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Garden() {
  const theme = useOutletContext();
  const [checkedItems, setCheckedItems] = useState({});
  const sortOptions = [
    "Name",
    "Planted",
    "Owned",
    "Amount",
    "Rate",
    "Seed Season",
  ];

  const fields = [
    {
      name: "name",
      placeholder: "Name",
      type: "text",
      section: "header",
      title: true,
    },

    {
      name: "score",
      placeholder: "Rate",
      type: "rating",
      section: "header",
    },

    {
      name: "seed_season",
      placeholder: "Seed Season",
      type: "text",
      section: "body",
      label: true,
      group: "1",
    },

    {
      name: "fruit_season",
      placeholder: "Fruit Season",
      type: "text",
      section: "body",
      label: true,
      group: "1",
    },

    {
      name: "owned",
      placeholder: "Owned",
      type: "checkbox",
      section: "body",
      label: true,
      group: "2",
    },

    {
      name: "amount",
      placeholder: "Amount",
      type: "number",
      section: "body",
      label: true,
      group: "2",
    },

    {
      name: "planted",
      placeholder: "Is Planted",
      type: "checkbox",
      section: "body",
      label: true,
    },
  ];

  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");

  const searchField = fields[0]?.name;
  
  const filteredPlants = plants.filter((plant) =>
    String(plant[searchField] ?? "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const refreshPlants = async () => {
    const res = await fetch("http://localhost:8080/plants");
    const json = await res.json();

    const normalized = Array.isArray(json) ? json : json.plants;

    setPlants(normalized || []);

    const initialChecked = {};

    (normalized || []).forEach((plant) => {
      initialChecked[plant.id] = plant.owned;
    });

    setCheckedItems(initialChecked);
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:8080/plants");
      const data = await res.json();

      const normalized = Array.isArray(data) ? data : data.plants;

      setPlants(normalized || []);

      const initialChecked = {};

      (normalized || []).forEach((plant) => {
        initialChecked[plant.id] = plant.owned;
      });

      setCheckedItems(initialChecked);
    };

    load().catch((err) => console.error("Error fetching plants:", err));
  }, []);

  const handleSave = async (data, mode) => {
    if (mode === "edit") {
      await fetch(`http://localhost:8080/plants/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`http://localhost:8080/plants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    await refreshPlants();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/plants/${id}`, {
      method: "DELETE",
    });

    await refreshPlants();
  };

  const handleMove = async (item, newStatus) => {
    if (item.status === newStatus) {
      return;
    }
    
    await fetch(`http://localhost:8080/plants/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, status: newStatus }),
    });

    await refreshPlants();
  };

  const seasonal = filteredPlants.filter((p) => p.status === "seasonal");
  const permanent = filteredPlants.filter((p) => p.status === "permanent");

  return (
    <>
      <Header
        title="Garden"
        placeholder="Search plant..."
        search={search}
        onSearch={setSearch}
      />

      <div className="page-container" style={{ background: theme.container }}>
        <ItemColumn
          title="Seasonal"
          items={seasonal}
          theme={theme}
          variant="first"
          showCheckbox
          checkedItems={checkedItems}
          checkboxIcon="✿"
          sortOptions={sortOptions}
          fields={fields}
          onSave={handleSave}
          onDelete={handleDelete}onMove={handleMove}
          dropStatus="seasonal"
        />

        <ItemColumn
          title="Permanent"
          items={permanent}
          theme={theme}
          variant="second"
          showCheckbox
          checkedItems={checkedItems}
          checkboxIcon="𖢔"
          sortOptions={sortOptions}
          fields={fields}
          onSave={handleSave}
          onDelete={handleDelete}onMove={handleMove}
          dropStatus="permanent"
        />
      </div>
    </>
  );
}

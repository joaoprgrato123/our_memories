import Header from "../components/common/Header";
import ItemColumn from "../components/common/ItemColumn";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Planning() {
  const theme = useOutletContext();

  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");

  const refreshPlans = async () => {
    const res = await fetch("http://localhost:8080/plans");
    const json = await res.json();

    const normalized = Array.isArray(json) ? json : json.plans;
    setPlans(normalized || []);
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:8080/plans");
      const data = await res.json();

      const normalized = Array.isArray(data) ? data : data.plans;
      setPlans(normalized || []);
    };

    load().catch((err) => console.error("Error fetching plans:", err));
  }, []);

  const handleSave = async (data, mode) => {
    if (mode === "edit") {
      await fetch(`http://localhost:8080/plans/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`http://localhost:8080/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    await refreshPlans();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/plans/${id}`, {
      method: "DELETE",
    });

    await refreshPlans();
  };

  const handleMove = async (item, newStatus) => {
    if (item.status === newStatus) {
      return;
    }
    
    await fetch(`http://localhost:8080/plans/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, status: newStatus }),
    });

    await refreshPlans();
  };

  // Search by the first field: title
  const filteredPlans = plans.filter((plan) =>
    plan.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const someday = filteredPlans.filter((p) => p.status === "someday");
  const planned = filteredPlans.filter((p) => p.status === "planned");
  const ourMemories = filteredPlans.filter((p) => p.status === "our memories");

  const sortOptions = ["Name", "Date", "Location"];

  const fields = [
    {
      name: "title",
      placeholder: "Title",
      type: "text",
      section: "header",
      title: true,
    },

    {
      name: "occurs_start",
      placeholder: "Occurs Start Date",
      type: "date",
      section: "header",
      group: "1",
    },
    {
      name: "occurs_end",
      placeholder: "Occurs End Date",
      type: "date",
      section: "header",
      group: "1",
    },

    {
      name: "location",
      placeholder: "Location",
      type: "text",
      section: "header",
    },

    {
      name: "added_date",
      placeholder: "Added Date",
      type: "date",
      section: "body",
      label: true,
    },

    {
      name: "achieved_date_start",
      placeholder: "Start Date",
      type: "date",
      section: "body",
      group: "2",
      label: true,
    },
    {
      name: "achieved_date_end",
      placeholder: "End Date",
      type: "date",
      section: "body",
      group: "2",
      label: true,
    },

    {
      name: "hotel",
      placeholder: "Hotel",
      type: "text",
      section: "body",
      group: "3",
      label: true,
    },
    {
      name: "category",
      placeholder: "Category",
      type: "text",
      section: "body",
      group: "3",
      label: true,
    },

    {
      name: "images",
      placeholder: "Images URL",
      type: "url",
      section: "body",
      group: "4",
    },
    {
      name: "pdf",
      placeholder: "Documents URL",
      type: "url",
      section: "body",
      group: "4",
    },
  ];

  return (
    <>
      <Header
        title="Planning"
        placeholder="Search event..."
        search={search}
        onSearch={setSearch}
      />

      <div className="page-container" style={{ background: theme.container }}>
        <ItemColumn
          title="Someday"
          items={someday}
          theme={theme}
          variant="first"
          sortOptions={sortOptions}
          fields={fields}
          onSave={handleSave}
          onDelete={handleDelete}
          onMove={handleMove}
          dropStatus="someday"
        />

        <ItemColumn
          title="Planned"
          items={planned}
          theme={theme}
          variant="second"
          sortOptions={sortOptions}
          fields={fields}
          onSave={handleSave}
          onDelete={handleDelete}
          onMove={handleMove}
          dropStatus="planned"
        />

        <ItemColumn
          title="Our Memories"
          items={ourMemories}
          theme={theme}
          variant="third"
          sortOptions={sortOptions}
          fields={fields}
          onSave={handleSave}
          onDelete={handleDelete}
          onMove={handleMove}
          dropStatus="our memories"
        />
      </div>
    </>
  );
}

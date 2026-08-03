import Header from "../components/common/Header";
import ItemColumn from "../components/common/ItemColumn";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Resources() {
  const theme = useOutletContext();

  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");

  const refreshResources = async () => {
    const res = await fetch("http://localhost:8080/resources");
    const json = await res.json();

    const normalized = Array.isArray(json) ? json : json.resources;

    setResources(normalized || []);
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:8080/resources");
      const data = await res.json();

      const normalized = Array.isArray(data) ? data : data.resources;

      setResources(normalized || []);
    };

    load().catch((err) => console.error("Error fetching resources:", err));
  }, []);

  const handleSave = async (data, mode) => {
    if (mode === "edit") {
      await fetch(`http://localhost:8080/resources/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("http://localhost:8080/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }

    await refreshResources();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/resources/${id}`, {
      method: "DELETE",
    });

    await refreshResources();
  };

  const fields = [
    {
      name: "name",
      placeholder: "Name",
      type: "text",
      section: "body",
      title: true,
    },
    {
      name: "icon",
      placeholder: "Icon",
      type: "emoji",
      section: "body",
      label: true,
    },
    {
      name: "link",
      placeholder: "Link",
      type: "url",
      section: "body",
      label: true,
    },
  ];

  const searchField = fields[0].name;

  const filteredResources = resources.filter((resource) =>
    String(resource[searchField] ?? "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      <Header
        title="Resources"
        placeholder="Search resource..."
        search={search}
        onSearch={setSearch}
      />

      <div
        className="page-container resources"
        style={{ background: theme.container }}
      >
        <ItemColumn
          title=""
          items={filteredResources}
          theme={theme}
          fields={fields}
          variant="first"
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

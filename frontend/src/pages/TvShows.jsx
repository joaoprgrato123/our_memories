import Header from "../components/common/Header";
import ItemColumn from "../components/common/ItemColumn";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TVShows() {
  const theme = useOutletContext();

  const [series, setSeries] = useState([]);
  const [search, setSearch] = useState("");

  const refreshSeries = async () => {
    const res = await fetch("http://localhost:8080/series");
    const json = await res.json();

    const normalized = Array.isArray(json) ? json : json.series;

    setSeries(normalized || []);
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:8080/series");
      const data = await res.json();

      const normalized = Array.isArray(data) ? data : data.series;

      setSeries(normalized || []);
    };

    load().catch((err) => console.error("Error fetching series:", err));
  }, []);

  const handleSave = async (data, mode) => {
    if (mode === "edit") {
      await fetch(`http://localhost:8080/series/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`http://localhost:8080/series`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    await refreshSeries();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/series/${id}`, {
      method: "DELETE",
    });

    await refreshSeries();
  };

  const handleMove = async (item, newStatus) => {
    if (item.status === newStatus) {
      return;
    }

    await fetch(`http://localhost:8080/series/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, status: newStatus }),
    });

    await refreshSeries();
  };

  const sortOptions = ["Title", "Genre", "Score", "Duration", "Added Date"];

  const fields = [
    {
      name: "title",
      placeholder: "Title",
      type: "text",
      section: "header",
      title: true,
    },

    {
      name: "start_date",
      placeholder: "Start Date",
      type: "date",
      section: "header",
      group: "1",
    },
    {
      name: "end_date",
      placeholder: "End Date",
      type: "date",
      section: "header",
      group: "1",
    },

    {
      name: "genre",
      placeholder: "Genre",
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
      name: "score",
      placeholder: "Score",
      type: "rating",
      section: "body",
      label: true,
    },
    {
      name: "duration",
      placeholder: "Duration",
      type: "number",
      section: "body",
      label: true,
      suffix: "eps",
    },
  ];

  const filteredSeries = series.filter((show) =>
    String(show.title ?? "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const toWatch = filteredSeries.filter((s) => s.status === "to watch");
  const seen = filteredSeries.filter((s) => s.status === "seen");

  return (
    <>
      <Header
        title="TV Shows"
        placeholder="Search TV Show..."
        search={search}
        onSearch={setSearch}
      />

      <div className="page-container" style={{ background: theme.container }}>
        <ItemColumn
          title="To Watch"
          items={toWatch}
          theme={theme}
          variant="first"
          sortOptions={sortOptions}
          fields={fields}
          onSave={handleSave}
          onDelete={handleDelete}
          onMove={handleMove}
          dropStatus="to watch"
        />

        <ItemColumn
          title="Seen"
          items={seen}
          theme={theme}
          variant="second"
          sortOptions={sortOptions}
          fields={fields}
          onSave={handleSave}
          onDelete={handleDelete}
          onMove={handleMove}
          dropStatus="seen"
        />
      </div>
    </>
  );
}

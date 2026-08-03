import Header from "../components/common/Header";
import ItemColumn from "../components/common/ItemColumn";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Movies() {
  const theme = useOutletContext();

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  const refreshMovies = async () => {
    const res = await fetch("http://localhost:8080/movies");
    const json = await res.json();

    const normalized = Array.isArray(json) ? json : json.movies;
    setMovies(normalized || []);
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:8080/movies");
      const data = await res.json();

      const normalized = Array.isArray(data) ? data : data.movies;

      setMovies(normalized || []);
    };

    load().catch((err) => console.error("Error fetching movies:", err));
  }, []);

  const handleSave = async (data, mode) => {
    if (mode === "edit") {
      await fetch(`http://localhost:8080/movies/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`http://localhost:8080/movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    await refreshMovies();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/movies/${id}`, {
      method: "DELETE",
    });

    await refreshMovies();
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
      suffix: "mins",
    },
  ];

  const searchField = fields[0]?.name;

  const filteredMovies = movies.filter((movie) =>
    String(movie[searchField] ?? "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const toWatch = filteredMovies.filter((m) => m.status === "to watch");
  const seen = filteredMovies.filter((m) => m.status === "seen");

  return (
    <>
      <Header
        title="Movies"
        placeholder="Search movie..."
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
        />
      </div>
    </>
  );
}

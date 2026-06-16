import Header from "../components/common/Header";
import ItemColumn from "../components/common/ItemColumn";
import { useOutletContext } from "react-router-dom";

const toWatch = ["Breaking Dawn", "The Batman", "The King"];
const seen = ["Spirit", "Scary Movie 3", "Super Movie"];
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
    name: "occursStart",
    placeholder: "Occurs Start Date",
    type: "date",
    section: "header",
    group: "1",
  },
  {
    name: "occursEnd",
    placeholder: "Occurs End Date",
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
    name: "addedDate",
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

export default function Movies() {
  const theme = useOutletContext();
  return (
    <>
      <Header title="Movies" placeholder="Search movie..." />

      <div className="page-container" style={{ background: theme.container }}>
        <ItemColumn
          title="To Watch"
          items={toWatch}
          theme={theme}
          variant="first"
          sortOptions={sortOptions}
          fields={fields}
        />

        <ItemColumn
          title="Seen"
          items={seen}
          theme={theme}
          variant="second"
          sortOptions={sortOptions}
          fields={fields}
        />
      </div>
    </>
  );
}

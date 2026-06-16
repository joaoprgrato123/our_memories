import Header from "../components/common/Header";
import ItemColumn from "../components/common/ItemColumn";
import { useOutletContext } from "react-router-dom";

const someday = ["Beach Trip", "Snow Trip", "Swim"];
const planned = ["First Anniversary", "Lisbon Weekend", "Iberanime"];
const ourMemories = ["Lisbon Trip", "Aveiro Weekend"];
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
    name: "location",
    placeholder: "Location",
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
    name: "startDate",
    placeholder: "Start Date",
    type: "date",
    section: "body",
    group: "2",
    label: true,
  },
  {
    name: "endDate",
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
    name: "documents",
    placeholder: "Documents URL",
    type: "url",
    section: "body",
    group: "4",
  },
];

export default function Planning() {
  const theme = useOutletContext();
  return (
    <>
      <Header title="Planning" placeholder="Search event..." />

      <div className="page-container" style={{ background: theme.container }}>
        <ItemColumn
          title="Someday"
          items={someday}
          theme={theme}
          variant="first"
          sortOptions={sortOptions}
          fields={fields}
        />

        <ItemColumn
          title="Planned"
          items={planned}
          theme={theme}
          variant="second"
          sortOptions={sortOptions}
          fields={fields}
        />

        <ItemColumn
          title="Our Memories"
          items={ourMemories}
          theme={theme}
          variant="third"
          sortOptions={sortOptions}
          fields={fields}
        />
      </div>
    </>
  );
}

import Header from "../components/common/Header";
import ItemColumn from "../components/common/ItemColumn";
import { useOutletContext } from "react-router-dom";

export default function Resources() {
  const theme = useOutletContext();
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
      type: "text",
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
  return (
    <>
      <Header title="Resources" placeholder="Search resource..." />

      <div
        className="page-container resources"
        style={{ background: theme.container }}
      >
        <ItemColumn
          title=""
          theme={theme}
          fields={fields}
          variant="first"
          items={[
            {
              label: "Tasty Finds",
              icon: "🍴",
              link: "https://tastyfinds.vercel.app/",
            },
            {
              label: "Charts",
              icon: "📊",
              link: "https://docs.google.com/spreadsheets/d/1C_rgl7TwJAr4wddUhCmYtVp9zp-TCQQEpON-OukPQ4w/edit",
            },
            {
              label: "Finance",
              icon: "💶",
              link: "https://docs.google.com/spreadsheets/d/1quejREVkPmgC3L3NXhT_PAaVtLOlEB-7NhcIgcCjyhI/edit",
            },
            {
              label: "Chores",
              icon: "🧹️",
              link: "https://docs.google.com/spreadsheets/d/1M8SKk5ETEpIc3XEkggC4IrB7fq3DpnhwnWnU8zpfPfw/edit",
            },
          ]}
        />
      </div>
    </>
  );
}

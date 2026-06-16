import Header from "../components/common/Header";
import ItemColumn from "../components/common/ItemColumn";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

const seasonal = ["Tomatoes", "Bell Pepper", "Marigold"];
const permanent = ["Lemons", "Roses", "Peaches", "Onions"];

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
      name: "rate",
      placeholder: "Rate",
      type: "rating",
      section: "header",
    },

    {
      name: "seed",
      placeholder: "Seed Season",
      type: "text",
      section: "body",
      label: true,
      group: "1",
    },

    {
      name: "fruit",
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

  return (
    <>
      <Header title="Garden" placeholder="Search plant..." />

      <div className="page-container" style={{ background: theme.container }}>
        <ItemColumn
          title="Seasonal"
          items={seasonal}
          theme={theme}
          variant="first"
          showCheckbox
          checkedItems={checkedItems}
          checkboxIcon="✿"
          setCheckedItems={setCheckedItems}
          sortOptions={sortOptions}
          fields={fields}
        />

        <ItemColumn
          title="Permanent"
          items={permanent}
          theme={theme}
          variant="second"
          showCheckbox
          checkedItems={checkedItems}
          checkboxIcon="𖢔"
          setCheckedItems={setCheckedItems}
          sortOptions={sortOptions}
          fields={fields}
        />
      </div>
    </>
  );
}

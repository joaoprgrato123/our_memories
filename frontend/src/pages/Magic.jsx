import Header from "../components/common/Header";
import ItemColumn from "../components/common/ItemColumn";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

const juju = ["Chitterspitter", "Putrefy", "Swarmyard"];
const dudi = ["Twilight Mire", "Chatterstorm", "Plaguecrafter", "Sol Ring"];

export default function MTG() {
  const theme = useOutletContext();
  const [checkedItems, setCheckedItems] = useState({});
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

  return (
    <>
      <Header title="Magic The Gathering" placeholder="Search card..." />

      <div className="page-container" style={{ background: theme.container }}>
        <ItemColumn
          title="Juju"
          items={juju}
          theme={theme}
          variant="first"
          showCheckbox
          checkedItems={checkedItems}
          checkboxIcon="✵"
          setCheckedItems={setCheckedItems}
          sortOptions={sortOptions}
          fields={fields}
        />

        <ItemColumn
          title="Dudi"
          items={dudi}
          theme={theme}
          variant="second"
          showCheckbox
          checkedItems={checkedItems}
          checkboxIcon="𖤓"
          setCheckedItems={setCheckedItems}
          sortOptions={sortOptions}
          fields={fields}
        />
      </div>
    </>
  );
}

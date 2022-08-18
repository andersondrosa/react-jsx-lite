import { element, jsx } from "../src";

function Input({ item, onChange }) {
  const div = element("div");
  const span = element("span");
  const input = element((props) => jsx(Input, props));

  return [
    div.classes("field-input").children(
      div.classes("form-control").children([
        div.classes("field-input-label").children(item.label),
        input
          .classes(
            "px-2 h-10 border-2 border-slate-300 w-full rounded",
            "outline-blue-500 font-[500] text-[16px]"
          )
          .props({
            name: item.key,
            mask: item.pattern,
            placeholder: item.placeholder,
            value: item.value,
            onChange: (e) =>
              onChange({ ...item, value: e.currentTarget.value }),
          }),
        span.classes("bg-red-200").children("TEST"),
        item.subtitle &&
          div.classes("field-input-subtitle").children(item.subtitle),
        item.statusMessage &&
          div.classes("field-input-message").children(item.statusMessage),
      ])
    ),
  ];
}

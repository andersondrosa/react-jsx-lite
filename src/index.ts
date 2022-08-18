const { jsx, jsxs, Fragment }: any = require("react/jsx-runtime");

function close(children) {
  if (!children) return;
  if (children.map) return children.map(close);
  return children.children ? children.children() : children;
}

const element = (type: any) => {
  const Element = (props: any = {}, children: any = null) =>
    jsx(type, { ...props, children: close(children) });
  Element.classes = (...classes) => {
    return {
      props: (props) => ({
        children: (children: any = null) =>
          jsx(type, {
            ...props,
            className: classes.join(" "),
            children: close(children),
          }),
      }),
      children: (children: any = null) =>
        jsx(type, { className: classes.join(" "), children: close(children) }),
    };
  };
  Element.props = (props) => ({
    children: (children: any = null) =>
      jsx(type, { ...props, children: close(children) }),
  });
  return Element;
};

function Input() {
  return "input";
}

export default function FormInput({ item, onChange }) {
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

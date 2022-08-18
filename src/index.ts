const { jsx, jsxs, Fragment }: any = require("react/jsx-runtime");

export function element(type: any) {
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
}

function close(children) {
  if (!children) return;
  if (children.map) return children.map(close);
  return children.children ? children.children() : children;
}

export { jsx };

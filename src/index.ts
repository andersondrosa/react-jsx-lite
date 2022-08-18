const { jsx, jsxs, Fragment }: any = require("react/jsx-runtime");

type Props = {
  style: any;
  children?: any;
  onChange?: Function;
};

type Context = { type: any; props: Props; classes: string[] };

function getElement(context: Context) {
  const { props } = context;

  const setProps = (props: any) => (
    (context.props = Object.assign(context.props, props)), getElement(context)
  );

  return Object.assign(setProps, {
    props: setProps,
    classes: (...classes: string[]) => (
      classes.map((x) => context.classes.push(x)), getElement(context)
    ),
    style: (style: any) => (
      (props.style = Object.assign(props.style, style)), getElement(context)
    ),
    onChange: (fn) => ((props.onChange = fn), getElement(context)),
    children: (children: any) => (
      (props.children = children), getElement(context)
    ),
    jsx() {
      const data: any = { ...props, children: getJsx(props.children) };
      if (context.classes.length) data.className = context.classes.join(" ");
      if (props.style) data.style = props.style;
      if (props.onChange) data.onChange = props.onChange;
      return jsx(context.type, data);
    },
  });
}

function getJsx(children) {
  if (!children) return;
  if (children.map) return children.map(getJsx);
  return children.jsx ? children.jsx() : children;
}

export function element(type: any) {
  return getElement({ type, classes: [], props: { style: {} } });
}

export { jsx };

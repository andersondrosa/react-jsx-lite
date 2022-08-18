import React from "react";

const { jsx, jsxs, Fragment }: any = require("react/jsx-runtime");

type Props = {
  style?: any;
  children?: any;
  onChange?: Function;
};

type Context = { type: any; props: Props; classes: string[] };

const ReactJsxLite = Symbol("ReactJsxLite");

const isElement = (x) => x.$$type === ReactJsxLite;

const isProps = (x) =>
  x instanceof Object && !Array.isArray(x) && !isElement(x);

function getJsx(children) {
  if (!children) return;
  if (Array.isArray(children))
    return jsxs(Fragment, { children: children.map(getJsx) });
  return isElement(children) ? children.jsx() : children;
}

function getElement(context: Context, instanced = false) {
  const { type, props, classes } = context;
  const isFirst = !instanced;

  const _props = (props: any) => {
    if (isFirst)
      return getElement({ type, classes: [], props: { ...props } }, true);
    context.props = Object.assign(context.props, props);
    return getElement(
      { type, classes: [...classes], props: { ...context.props } },
      true
    );
  };

  const children = (children: any) => {
    if (isFirst)
      return getElement({ type, classes: [], props: { children } }, true);
    props.children = children;
    return getElement(
      { type, classes: [...classes], props: { ...context.props } },
      true
    );
  };

  return Object.assign(
    (x) => {
      return isProps(x) ? _props(x) : children(x);
    },
    {
      $$type: ReactJsxLite,
      props: _props,
      children,
      classes: (..._classes: string[]) => {
        if (isFirst)
          return getElement({ type, classes: [..._classes], props: {} }, true);
        _classes.map((x) => classes.push(x));
        return getElement(
          { type, classes: [...classes], props: { ...props } },
          true
        );
      },
      style: (style: any) => {
        if (isFirst)
          return getElement(
            { type, classes: [], props: { style: { ...style } } },
            true
          );
        props.style = Object.assign({}, props.style, style);
        return getElement(
          { type, classes: [...classes], props: { ...props } },
          true
        );
      },
      onChange: (onChange) => {
        if (isFirst)
          return getElement({ type, classes: [], props: { onChange } }, true);
        props.onChange = onChange;
        return getElement(
          { type, classes: [...classes], props: { ...props } },
          true
        );
      },
      jsx() {
        const data: any = { ...props, children: getJsx(props.children) };
        if (classes.length) data.className = classes.join(" ");
        if (props.style) data.style = props.style;
        if (props.onChange) data.onChange = props.onChange;
        return jsx(type, data);
      },
    }
  );
}

export function element(type: any) {
  return getElement({ type, classes: [], props: {} });
}

export { jsx, jsxs, Fragment };

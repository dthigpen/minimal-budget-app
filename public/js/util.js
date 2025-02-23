import van from './vender/van.debug.js';
import { Modal } from './vender/van-ui.js';
const { dialog, div, span, article, header, footer, button, p } = van.tags;
export function formatMoney(amount = 0.0, currencySymbol = '$') {
  return currencySymbol + amount.toFixed(2);
}

export function formatDate(date) {
  return `${d.getFullYear().padStart(4, '0')}-${(d.getMonth() + 1).padStart(2, '0')}-${d.getDate().padStart(2, '0')}`;
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function resolveFunctions(obj, ...args) {
  // if its a function, call it
  if (typeof obj === 'function') {
    return obj(...args);
    // if its an object check the key values
  } else if (isObject(obj)) {
    for (const key in obj) {
      const ret = resolveFunctions(obj[key]);
      obj[key] = ret;
    }
    // if its an array iterate it and update any items
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const ret = resolveFunctions(obj[i]);
      obj[i] = ret;
    }
  }
  return obj;
}

export function initDialog(initialConfig = null, renderFn) {
  initialConfig ??= () => {};
  if (isObject(initialConfig)) {
    initialConfig = () => initialConfig;
  }

  const closed = van.state(true);
  const close = () => {
    closed.val = true;
  };
  const defaultConfig = {
    title: '',
    cornerClose: true,
    buttons: [
      {
        text: 'Close',
        class: 'secondary',
        onclick: () => close(),
      },
    ],
  };
  return {
    close,
    open: (ctx) => {
      // evalutate the initial config with the ctx, apply over default
      const config = mergeDeep(defaultConfig, initialConfig(ctx));
      const children = renderFn(ctx);
      closed.val = false;
      van.add(
        document.body,
        Modal(
          { closed },
          dialog(
            { open: true },
            article(
              header(
                config.cornerClose
                  ? button({
                      'aria-label': 'Close',
                      rel: 'prev',
                      onclick: () => close(),
                    })
                  : null,
                p({ class: 'dialogtitle' }, config.title ?? ''),
              ),
              // content
              ...(Array.isArray(children) ? children : [children]),
              footer(
                config?.buttons
                  ?.filter((b) => b)
                  ?.map((b) =>
                    button(
                      {
                        onclick: b.onclick,
                        class: b.class ?? '',
                      },
                      b.text,
                    ),
                  ),
              ),
            ),
          ),
        ),
      );
    },
  };
}

export const Table = ({ head, data, onRowClick = (r) => {} }) => {
  return table(
    head ? thead(tr(head.map((h) => th(h)))) : [],
    tbody(
      data.map((row) =>
        tr(
          { onclick: () => onRowClick(row) },
          row.map((col) => td(col)),
        ),
      ),
    ),
  );
};

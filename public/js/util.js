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

export function setupValidation(
  element,
  { invalid, reportImmediately = true },
) {
  function oninput() {
    element.setAttribute('aria-invalid', false);
    const invalidMsg = invalid.call(element, element);
    if (invalidMsg) {
      element.setCustomValidity(invalidMsg);
    }
    if (element.checkValidity()) {
      if (reportImmediately) {
        element.reportValidity();
      }
    }
  }
  function oninvalid() {
    element.setAttribute('aria-invalid', true);
  }
  element.oninput = oninput;
  element.oninvalid = oninvalid;
}

class ValidationError extends Error {
  constructor(messsage) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ParseError extends Error {
  constructor(messsage) {
    super(message);
    this.name = this.constructor.name;
  }
}

const predicates = {
  isNonEmpty: (v) => !!v.trim(),
  isNumber: (v) => !Number.isNaN(Number(v)),
  isPositiveOrZero: (v) => v >= 0,
  isDateStr: (v) =>
    !!v.match(/^\d{4}-\d{2}-\d{2}$/) && !Number.isNaN(new Date(v).getTime()), // the only date format we care about
};
const transformers = {
  asNumber: (v) => Number(v),
  trimmed: (v) => v.trim(),
};

export function addValidation(element, options) {
  const oldOninput = element.oninput;
  const oldOninvalid = element.oninvalid;

  // const transformEntries = Object.entries(options).map([k,v] => k in transformers);
  const transformFn = (v) => {
    if (options.trimmed) {
      v = transformers.trimmed(v);
    }
    if (options.asNumber) {
      v = transformers.asNumber(v);
    }
    return v;
  };

  const predicatesFn = (v) => {
    if (options.isNumber && !predicates.isNumber(v)) {
      return `Input must be a number.`;
    }
    if (options.isPositiveOrZero && !predicates.isPositiveOrZero(v)) {
      return `Input must greater than or equal to 0.`;
    }
    if (options.isNonEmpty && !predicates.isNonEmpty(v)) {
      return `Input must not be empty.`;
    }
    if (options.isDateStr && !predicates.isDateStr(v)) {
      return `Input must be a date in the format YYYY-MM-DD.`;
    }
    if (options.customValidator) {
      const msg = options.customValidator(v);
      return msg ? msg : undefined;
    }
  };

  function validate() {
    element.setAttribute('aria-invalid', false);
    const invalidMsg = predicatesFn(element.value);
    element.setCustomValidity(invalidMsg ? invalidMsg : '');
    element.checkValidity();
    element.reportValidity();
  }
  function oninput(e) {
    // call the old oninput first
    if (oldOninput) {
      oldOninput(e);
    }
    validate();
  }
  function oninvalid() {
    // call the old oninvalid first
    if (oldOninvalid) {
      oldOninvalid(e);
    }
    element.setAttribute('aria-invalid', true);
  }
  element.oninput = oninput;
  element.oninvalid = oninvalid;

  return {
    element,
    validate,
    getValue: () => {
      transformFn(element.value);
    },
  };
}

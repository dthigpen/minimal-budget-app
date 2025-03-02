// import van from './vender/van.js';
import van from './vender/van.debug.js';
const { div, select, option, button } = van.tags;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MonthPicker = ({ date, onChange } = {}) => {
  if (!date.val) {
    date.val = new Date();
  }
  const currYear = date.val.getFullYear();
  const currMonth = Number(date.val.getMonth());
  // setup arrays on months and years to choose from
  const startYear = 2000;
  const futureYears = 5;
  const numYears = currYear + futureYears - startYear;
  const years = Array.from(new Array(numYears)).map((_, i) => startYear + i);
  years.reverse();
  const monthDoms = MONTHS.map((m, i) => option({ value: i }, m));
  // select the given year and month
  monthDoms.at(currMonth).selected = true;
  const yearDoms = years.map((y) => option({ value: y }, y));
  yearDoms.at(futureYears - 1).selected = true;

  return div(
    { class: 'month-picker' },
    select(
      {
        name: 'month-select',
        'aria-label': 'Select Month',
        onchange: function () {
          date.val.setMonth(Number(this.value));
          onChange && onChange(date.val);
        },
      },
      monthDoms,
    ),
    select(
      {
        name: 'year-select',
        'aria-label': 'Select Year',
        onchange: function () {
          date.val.setYear(Number(this.value));
          onChange && onChange(date.val);
        },
      },
      yearDoms,
    ),
    button(
      {
        class: 'small-button',
        onclick: () => {
          date.val = new Date();
        },
      },
      'This Month',
    ),
  );
};

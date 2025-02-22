// import van from './vender/van.js';
import van from './vender/van.debug.js';
const { div, select, option } = van.tags;

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

export const MonthPicker = () => {
  const date = new Date(Date.now());
  const currYear = date.getFullYear();
  const currMonth = Number(date.getMonth());
  const startYear = 2000;
  const futureYears = 5;
  const numYears = currYear + futureYears - startYear;
  const years = Array.from(new Array(numYears)).map((_, i) => startYear + i);
  const monthDoms = MONTHS.map((m, i) => option({ value: i }, m));
  monthDoms.at(currMonth).selected = true;
  const yearDoms = years.map((y) => option({ value: y }, y));
  yearDoms.at(-futureYears).selected = true;
  return div(
    { class: 'month-picker' },
    select(
      {
        name: 'month-select',
        'aria-label': 'Select Month',
        required: true,
        disabled: true,
      },
      monthDoms,
    ),
    select(
      {
        name: 'year-select',
        'aria-label': 'Select Year',
        required: true,
        disabled: true,
      },
      yearDoms,
    ),
  );
};

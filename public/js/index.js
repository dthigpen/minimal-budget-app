// import van from './vender/van.js';
import van from './vender/van.debug.js';
import { MonthPicker } from './month-picker.js';
import { CategoryDialog } from './category-dialog.js';
import { CategoriesLists } from './categories-lists.js';
import { TransactionsList } from './transactions-list.js';
import { formatMoney, initDialog } from './util.js';
import { Modal, MessageBoard, Tabs, Banner } from './vender/van-ui.js';
import * as vanX from './vender/van-x.js';
const {
  a,
  select,
  option,
  details,
  summary,
  label,
  fieldset,
  legend,
  article,
  footer,
  form,
  b,
  del,
  button,
  dialog,
  pre,
  code,
  div,
  h1,
  h2,
  h3,
  h4,
  li,
  p,
  ul,
  nav,
  strong,
  header,
  main,
  table,
  thead,
  tbody,
  tr,
  td,
  th,
  input,
  span,
  progress,
} = van.tags;

const DATA_KEY = 'minimal-budget-app';

const Nav = () =>
  nav(
    ul(li(strong('Minimal Budget'))),
    ul(li(a({ href: '#/settings' }, 'Settings'))),
  );

const DEFAULT_DATA = {
  categories: [],
  transactions: [],
};
const DUMMY_DATA = {
  categories: [
    {
      name: 'Groceries',
      type: 'expense',
      goal: 350.0,
    },
    {
      name: 'Job',
      type: 'income',
      goal: 1500,
    },
    {
      name: 'Entertainment',
      type: 'expense',
      goal: 12.5,
    },
    {
      name: 'No Goal Expense',
      type: 'expense',
    },
    {
      name: 'No Goal Income',
      type: 'income',
    },
  ],
  transactions: [
    {
      description: 'WALMART #123',
      date: '2025-01-09',
      amount: -123.45,
      account: 'Some Credit Card',
    },
    {
      description: 'COMPANY XYZ',
      date: '2025-01-03',
      amount: 1070.29,
      account: 'Checking Account',
    },
  ],
};
function resetLocalStorage() {
  // TODO change to DEFAULT_DATA
  localStorage.setItem(DATA_KEY, JSON.stringify(DUMMY_DATA));
}

function addValue(arr, value) {
  const maxId = Math.max(...arr.map((v) => v.id));
  value.id = maxId + 1;
  arr.push(value);
  return value;
}

function updateValue(arr, value) {
  if (value.id === undefined || value.id === null) {
    throw Error(`No id on object: ${JSON.stringify(value)}`);
  }
  console.debug(`updateValue BEFORE: ${JSON.stringify(arr)}`);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === value.id) {
      arr[i] = value;
      console.debug(`Updated value with id ${value.id}`);
      console.debug(`updateValue AFTER: ${JSON.stringify(arr)}`);
      return;
    }
  }
  throw Error(`Value with id ${value.id} was not found`);
}
function loadStateFromLocalStorage() {
  const data = JSON.parse(
    localStorage.getItem(DATA_KEY) ?? JSON.stringify(DEFAULT_DATA),
  );

  // add ids categories and transactions
  data.categories.forEach((c, i) => (c.id = i));
  data.transactions.forEach((t, i) => (t.id = i));

  console.debug(`loaded local storage data: ${JSON.stringify(data)}`);
  return vanX.reactive(data);
}
function saveStateToLocalStorage(stateObject) {
  const data = JSON.parse(JSON.stringify(vanX.compact(stateObject)));
  // remove ids categories and transactions
  data.categories.forEach((c) => delete c.id);
  data.transactions.forEach((t) => delete t.id);

  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

const App = () => {
  resetLocalStorage();
  let state = loadStateFromLocalStorage();
  const categoryDialog = CategoryDialog({
    onSave: (c) => {
      console.log(`Saving category: ${JSON.stringify(c)}`);
      // alert(`Saving category: ${JSON.stringify(c)}`);
      if (Number.isInteger(c.id)) {
        updateValue(state.categories, c);
      } else {
        addValue(state.categories, c);
      }
    },
  });

  van.derive(() => {
    console.debug(`Categories updated: ${JSON.stringify(state.categories)}`);
    saveStateToLocalStorage(state);
  });

  const fooDialog = initDialog(
    (ctx) => ({
      title: ctx.store?.text ?? 'No Title',
      buttons: [
        {
          text: 'Save',
          onclick: () => {
            fooDialog.close();
          },
        },
      ],
    }),
    (ctx) => {
      const inp = input({
        oninput: () => {
          console.log(`inp Ctx: ${JSON.stringify(ctx)}`);
          ctx.store.text = inp.value;
          console.debug(`input value: ${this.value}`);
        },
        value: ctx.store?.text ?? '',
      });
      return div(inp);
    },
  );
  const selectedMonthString = van.state('');
  const monthPickerInput = input({
    type: 'month',
    'aria-label': 'Month',
    oninput: () => (selectedMonthString.val = this.value),
  });
  return div(
    header(Nav()),
    main(
      MonthPicker(),
      () =>
        CategoriesLists({
          state,
          onClickCategory: (c, i) => {
            categoryDialog.open({
              category: JSON.parse(JSON.stringify(c)),
            });
          },
          onClickViewAll: () => console.debug(`View All clicked`),
          onClickNew: () => {
            console.log('New Category clicked');
            categoryDialog.open({});
          },
        }),

      () => TransactionsList({ state }),
    ),
  );
};

van.add(document.body, App());

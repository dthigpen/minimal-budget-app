// import van from './vender/van.js';
import van from './vender/van.debug.js';
import { MonthPicker } from './month-picker.js';
import { CategoryDialog } from './category-dialog.js';
import { CategoriesLists } from './categories-lists.js';
import { TransactionsList } from './transactions-list.js';
import { TransactionDialog } from './transaction-dialog.js';
import { formatMoney } from './util.js';
import { initDialog, initDialogWithButtons } from './dialog-util.js';
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
      category: 'Job',
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

function deleteValue(arr, valueId) {
  let deleted = false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === valueId) {
      delete arr[i];
      deleted = true;
      break;
    }
  }
  if (!deleted) {
    console.log(`Value not found with id ${valueId} in ${JSON.stringify(arr)}`);
  }
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

function openDialog(closed, items, title) {
  closed.val = false;
  van.add(
    document.body,
    Modal({ closed }, div(title), () => items.val.map((v) => v + ' ')),
  );
}

const App = () => {
  resetLocalStorage();
  let state = loadStateFromLocalStorage();
  const confirmDialog = initDialogWithButtons(
    {
      title: van.state('Confirmation'),
      description: van.state('Are you sure you want to do this?'),
      onDeny: () => {
        console.log(`Clicked deny`);
      },
      onConfirm: () => {
        console.log(`Clicked confirm`);
      },
    },
    (s, dialogActions) => [
      {
        text: 'No',
        onclick: () => {
          if (s.onDeny) {
            s.onDeny();
          }
          dialogActions.close();
        },
      },
      {
        text: 'Yes',
        onclick: () => {
          if (s.onConfirm) {
            s.onConfirm();
          }
          dialogActions.close();
        },
      },
    ],
    (s, dialogActions) =>
      p(s.description ?? 'Are you sure you want to do this?'),
  );

  const categoryDialog = CategoryDialog({
    category: null,
    onSave: (c) => {
      console.log(`Saving category: ${JSON.stringify(c)}`);
      // alert(`Saving category: ${JSON.stringify(c)}`);
      if (Number.isInteger(c.id)) {
        updateValue(state.categories, c);
      } else {
        addValue(state.categories, c);
      }
      categoryDialog.close();
    },
    onDelete: (c) => {
      confirmDialog.states.title.val = 'Delete category';
      confirmDialog.states.description.val = `Are you sure you want to delete ${c.name}?`;
      confirmDialog.states.onDeny = () => {
        console.debug('Category not deleted');
      };
      confirmDialog.states.onConfirm = () => {
        categoryDialog.close();
        deleteValue(state.categories, c.id);
      };
      confirmDialog.open();

      /*
      confirmDialog.open({
        title: 'Delete category',
        description: `Are you sure you want to delete ${c.name}?`,
        onDeny: () => {
          console.debug('Category not deleted');
        },
        onConfirm: () => {
          categoryDialog.close();
          deleteValue(state.categories, c.id);
        },
      });
      */
    },
  });
  const accounts = van.derive(() => [
    ...new Set(state.transactions.map((t) => t.account).filter((a) => a)),
  ]);
  const categoryNames = van.derive(() => [
    ...new Set(state.categories.map((c) => c.name).filter((c) => c)),
  ]);

  const transactionDialog = TransactionDialog({
    accounts: accounts,
    categories: categoryNames,
    onSave: (t) => {
      console.log(`Saving transaction: ${JSON.stringify(t)}`);
      // alert(`Saving transaction: ${JSON.stringify(c)}`);
      if (Number.isInteger(t.id)) {
        updateValue(state.transactions, t);
      } else {
        addValue(state.transactions, t);
      }
      transactionDialog.close();
    },
    onDelete: (t) => {
      confirmDialog.open({
        title: 'Delete transaction',
        description: `Are you sure you want to delete ${t.description}?`,
        onDeny: () => {
          console.debug('Transaction not deleted');
        },
        onConfirm: () => {
          transactionDialog.close();
          deleteValue(state.transactions, t.id);
        },
      });
    },
    onNewCategory: () => {
      categoryDialog.open({ category: {} });
    },
  });
  van.derive(() => {
    console.debug(`Categories updated: ${JSON.stringify(state.categories)}`);
    saveStateToLocalStorage(state);
  });

  const selectedMonthString = van.state('');
  const monthPickerInput = input({
    type: 'month',
    'aria-label': 'Month',
    oninput: () => (selectedMonthString.val = this.value),
  });

  const fooClosed = van.state(true);
  const fooTitle = van.state('Items:');
  const fooItems = van.state([111, 222, 333, 444, 555]);
  const fooDesc = van.derive(() => `Numbers: ${fooItems.val.join(', ')}`);
  /*
  const fooDialog = initDialog3(
    {
      title: fooTitle,
      description: fooDesc,
    },
    (s, {close}) => {
      return div(
      	h3(s.title),
      	p(s.description),
      	button({onclick: () => close()}, 'Close')
      )
    },
  );
  */
  const fooDialog = initDialogWithButtons(
    {
      title: fooTitle,
      cornerClose: van.state(true),
      description: fooDesc,
    },
    (s, { close }) => [
      {
        text: 'Close',
      },
      {
        text: 'Save',
        onclick: () => {
          console.log(`Save clicked`);
          close();
        },
        class: 'secondary',
      },
    ],
    (s, { close }) => {
      return div(p(s.description));
    },
  );

  return div(
    header(Nav()),
    main(
      () =>
        button(
          {
            onclick: () => {
              console.log('Dialog clicked');
              fooDialog.open({ updateValues: { title: 'nnnnnnn' } });
              setTimeout(() => {
                console.log('Setting title');
                fooTitle.val = 'New title';
              }, 2000);
              setTimeout(() => {
                console.log('Setting items');
                fooItems.val = [...fooItems.val.splice(2)];
              }, 3000);
            },
          },
          'open dialog',
        ),
      MonthPicker(),
      () =>
        CategoriesLists({
          state,
          onClickCategory: (c, i) => {
            categoryDialog.open({
              category: JSON.parse(JSON.stringify(c)),
            });
            console.log(categoryDialog.states.category.val);
          },
          onClickViewAll: () => console.debug(`View All clicked`),
          onClickNew: () => {
            console.log('New Category clicked');
            categoryDialog.open({});
          },
        }),

      () =>
        TransactionsList({
          state,
          onClickRow: (t) => {
            console.log(`Clicked: ${JSON.stringify(t)}`);
            transactionDialog.open({
              transaction: JSON.parse(JSON.stringify(t)),
            });
          },
        }),
    ),
  );
};

van.add(document.body, App());

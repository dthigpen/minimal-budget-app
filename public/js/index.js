// import van from './vender/van.js';
import van from './vender/van.debug.js';
import * as vanX from './vender/van-x.js';
import { generateCategories, generateTransactions } from './test-data.js';
import { MonthPicker } from './month-picker.js';
import { CategoryDialog } from './category-dialog.js';
import { CategoriesLists } from './categories-lists.js';
import { TransactionsList } from './transactions-list.js';
import { TransactionDialog } from './transaction-dialog.js';
import { formatMoney, formatDate } from './util.js';
import { initDialog, initDialogWithButtons } from './dialog-util.js';
import { Modal, MessageBoard, Tabs, Banner } from './vender/van-ui.js';
import { Route, goto } from './vender/router.js';
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

const DATA_KEY_NAME = 'minimal-budget-app-key';
const DEMO_DATA_KEY = 'minimal-budget-app-demo-data';
const USER_DATA_KEY = 'minimal-budget-app-data';

const Nav = () =>
  nav(
    { class: 'nav-bar' },
    ul(li(a({ href: '#', class: 'title' }, 'Minimal Budget'))),
    ul(li(a({ href: '#/settings' }, 'Settings'))),
  );

const DEFAULT_DATA = {
  categories: [],
  transactions: [],
};

function resetLocalStorage() {
  localStorage.removeItem(DATA_KEY_NAME);
  localStorage.removeItem(DEMO_DATA_KEY);
  localStorage.removeItem(USER_DATA_KEY);
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
    console.error(
      `Value not found with id ${valueId} in ${JSON.stringify(arr)}`,
    );
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

function getDataKey() {
  // first check which key to look at, either demo or real data
  // if does not exist, start in demo mode, so use demo key
  const dataKey = localStorage.getItem(DATA_KEY_NAME);
  if (!dataKey) {
    localStorage.setItem(DATA_KEY_NAME, DEMO_DATA_KEY);
    return DEMO_DATA_KEY;
  }
  return dataKey;
}

function isDemoMode() {
  return getDataKey() === DEMO_DATA_KEY;
}

function setDemoMode(enabled) {
  const dataKey = enabled ? DEMO_DATA_KEY : USER_DATA_KEY;
  localStorage.setItem(DATA_KEY_NAME, dataKey);
}
function loadStateFromLocalStorage() {
  const dataKey = getDataKey();
  let dataString = localStorage.getItem(dataKey);
  if (!dataString) {
    // in demo mode, use generated data
    if (isDemoMode()) {
      dataString = JSON.stringify({
        categories: generateCategories(),
        transactions: generateTransactions(),
      });
    } else {
      // default empty data
      dataString = JSON.stringify({
        categories: [],
        transactions: [],
      });
    }
    // immediately store so that it doesn't need to be recalculated again
    localStorage.setItem(dataKey, dataString);
  }
  // decode
  const data = JSON.parse(dataString);

  // add ids categories and transactions
  data.categories.forEach((c, i) => (c.id = i));
  data.transactions.forEach((t, i) => (t.id = i));

  console.debug(`loaded local storage data: ${JSON.stringify(data)}`);
  return data;
}
function saveStateToLocalStorage(stateObject) {
  const data = JSON.parse(JSON.stringify(vanX.compact(stateObject)));
  // remove ids categories and transactions
  data.categories.forEach((c) => delete c.id);
  data.transactions.forEach((t) => delete t.id);

  const dataKey = getDataKey();
  localStorage.setItem(dataKey, JSON.stringify(data));
}

function openDialog(closed, items, title) {
  closed.val = false;
  van.add(
    document.body,
    Modal({ closed }, div(title), () => items.val.map((v) => v + ' ')),
  );
}

const App = () => {
  // resetLocalStorage();
  const state = vanX.reactive(loadStateFromLocalStorage());
  const inDemo = van.state(isDemoMode());
  van.derive(() => {
    // persists value to local storage
    setDemoMode(inDemo.val);
    vanX.replace(state, loadStateFromLocalStorage());
  });
  const selectedDate = van.state(new Date());

  const accounts = van.derive(() => [
    ...new Set(state.transactions.map((t) => t.account).filter((a) => a)),
  ]);
  const categoryNames = van.derive(() => [
    ...new Set(state.categories.map((c) => c.name).filter((c) => c)),
  ]);
  const monthTransactions = van.derive(() => {
    if (!selectedDate.val) {
      return [];
    }
    const yearMonthStr = formatDate(selectedDate.val).slice(0, -3);
    return state.transactions.filter((t) => t.date.startsWith(yearMonthStr));
  });

  const confirmDialog = initDialogWithButtons(
    {
      title: van.state('Confirmation'),
      description: van.state('Are you sure you want to do this?'),
      onDeny: () => {
        console.debug(`Clicked deny`);
      },
      onConfirm: () => {
        console.debug(`Clicked confirm`);
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
    categoryNames: categoryNames,
    onSave: (c) => {
      console.debug(`Saving category: ${JSON.stringify(c)}`);
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
    },
  });

  const transactionDialog = TransactionDialog({
    accounts: accounts,
    categories: categoryNames,
    onSave: (t) => {
      console.debug(`Saving transaction: ${JSON.stringify(t)}`);
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
  return div(
    header(Nav()),
    () =>
      Route({
        rule: 'home',
        Loader() {
          return main(
            () =>
              inDemo.val
                ? Banner(
                    {
                      bannerClass: 'banner',
                      sticky: true,
                      backgroundColor: null,
                    },
                    div(
                      {
                        class: 'row',
                      },
                      '👋 You are looking at demo data. Exit the demo to get started for yourself!',
                      button(
                        {
                          onclick: () => {
                            confirmDialog.states.onDeny = () => {
                              console.debug('Remaining in demo mode');
                            };
                            confirmDialog.states.onConfirm = () => {
                              inDemo.val = false;
                              console.debug('Exiting demo mode');
                            };
                            confirmDialog.open({
                              title: 'Exit Demo Mode',
                              description: `Are you sure you want to exit demo mode? You can get back by clearing your browser cache.`,
                            });
                          },
                        },
                        'Exit Demo',
                      ),
                    ),
                  )
                : null,
            () =>
              MonthPicker({
                date: selectedDate,
                onChange: (d) => {
                  console.debug(d);
                  example2();
                },
              }),
            () =>
              CategoriesLists({
                state,
                onClickCategory: (c, i) => {
                  categoryDialog.open({
                    category: JSON.parse(JSON.stringify(c)),
                  });
                  console.debug(categoryDialog.states.category.val);
                },
                onClickViewAll: () => console.debug(`View All clicked`),
                onClickNew: () => {
                  console.debug('New Category clicked');
                  categoryDialog.open({ category: {} });
                },
              }),

            () =>
              TransactionsList({
                monthTransactions,
                onClickRow: (t) => {
                  console.debug(`Clicked: ${JSON.stringify(t)}`);
                  transactionDialog.open({
                    transaction: JSON.parse(JSON.stringify(t)),
                  });
                },
                onClickNew: () => {
                  transactionDialog.open({ transaction: {} });
                },
              }),
          );
        },
      }),
    () => Settings({ inDemo }),
  );
};

const Settings = ({ inDemo }) =>
  Route({
    rule: 'settings',
    // delayed: true,
    Loader() {
      return div(
        h2('Settings'),
        h3('Demo Mode'),
        p(
          'Demo mode uses fake categories and transactions to show what that app looks like with data. Switching to demo mode will not remove your data, you can always switch back.',
        ),
        button(
          { onclick: () => (inDemo.val = !inDemo.val) },
          inDemo.val ? 'Turn Off' : 'Turn On',
        ),
      );
    },
    async onLoad() {
      console.log('onLoad');
      // this.show();
    },
  });
van.add(document.body, App());

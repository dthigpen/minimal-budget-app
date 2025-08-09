// import van from './vender/van.js';
import van from './vender/van.debug.js';
import * as vanX from './vender/van-x.js';
import {
  loadDataFromLocalStorage,
  saveStateToLocalStorage,
  isDemoMode,
  setDemoMode,
  getDataKey,
  resetLocalStorage,
} from './data.js';
import { MonthPicker } from './month-picker.js';
import { CategoryDialog } from './category-dialog.js';
import { CategoriesLists } from './categories-lists.js';
import { TransactionsList } from './transactions-list.js';
import { TransactionDialog } from './transaction-dialog.js';
import { Tabs } from './tabs.js';
import { formatMoney, formatDate } from './util.js';
import { initDialog, initDialogWithButtons } from './dialog-util.js';
import { Modal, MessageBoard, Banner } from './vender/van-ui.js';
import { Route, goto } from './vender/router.js';
const {
  a,
  select,
  section,
  cite,
  blockquote,
  option,
  details,
  summary,
  small,
  label,
  figure,
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

const Nav = () =>
  nav(
    { class: 'nav-bar' },
    ul(li(a({ href: '#', class: 'title' }, 'Minimal Budget'))),
    ul(li(a({ href: '#/settings' }, 'Settings'))),
  );

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

function openDialog(closed, items, title) {
  closed.val = false;
  van.add(
    document.body,
    Modal({ closed }, div(title), () => items.val.map((v) => v + ' ')),
  );
}

const App = () => {
  resetLocalStorage();
  const state = vanX.reactive(loadDataFromLocalStorage());
  const inDemo = van.state(isDemoMode());
  // when demo mode status changes, reload data from local storage
  van.derive(() => {
    // persists value to local storage
    setDemoMode(inDemo.val);
    vanX.replace(state, loadDataFromLocalStorage());
  });

  // console.log(JSON.stringify(state.budgets[0]))
  // const selectedBudgetName = van.state();
  const selectedBudgetName = van.state(state.budgets[0].name);
  const selectedBudget = van.derive(() => {
    console.log(
      `Looking for ${selectedBudgetName.val} in ${state.budgets.map((b) => b.name)}`,
    );
    return (
      state.budgets?.find((b) => b.name === selectedBudgetName.val) ?? null
    );
  });

  const accounts = van.derive(() => [
    // ...new Set(state.transactions.map((t) => t.account).filter((a) => a)),
    'Account 1',
    'Account2',
  ]);
  const categoryNames = van.derive(() => [
    // ...new Set(state.categories.map((c) => c.name).filter((c) => c)),
    'Groceries',
    'Medical',
    'Job',
  ]);
  const monthTransactions = van.derive(() => {
    // if (!selectedDate.val) {
    //   return [];
    // }
    // const yearMonthStr = formatDate(selectedDate.val).slice(0, -3);
    // return state.transactions.filter((t) => t.date.startsWith(yearMonthStr));
    return [];
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

  const DemoModeBanner = () =>
    Banner(
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
    );
  const selectedTab = van.state('tab1');
  const budgetTitle = van.derive(() => {
    if (selectedBudgetName.val) {
      return selectedBudgetName.val + ' Budget';
    }
    return 'No Budget';
  });
  const totalFunds = van.derive(() =>
    selectedBudget.val.funds.reduce((acc, f) => acc + f.balance, 0),
  );

  const FundCard = (fundData) => {
    const onClick = () => console.log(`clicked fund: ${f.name}`);
    const hasGoal = fundData.goal !== undefined && fundData.goal !== null;
    return article(
      { class: 'category-row', onclick: onClick },
      span({ class: 'name' }, fundData.name),
      div(
        { class: 'hc' },
        div(
          {
            class: 'vc',
          },
          span(`Balance: ${formatMoney(fundData.balance)}`),
          fundData.goal ? span(`Goal: ${formatMoney(fundData.goal)}`) : null,
        ),
        div(
          {
            class: 'vc',
          },
          span(`Budgeted: ${formatMoney(fundData.budgeted)}`),
          div(
            'Actual: ',
            span(
              { class: `amount ${fundData.actual < 0 ? 'neg' : 'pos'}` },
              `${formatMoney(fundData.actual)}`,
            ),
          ),
        ),
      ),
      hasGoal
        ? progress({
            value: Math.round(fundData.balance),
            max: Math.round(fundData.goal),
          })
        : null,
    );
  };
  return div(
    header(Nav()),
    () =>
      Route({
        rule: 'home',
        Loader() {
          return main(
            () => (inDemo.val ? DemoModeBanner() : null),
            div(
              {
                style: `display: flex; justify-content: space-between; gap: 1rem; align-items: center;`,
              },
              h2({ style: `margin-bottom: 0` }, budgetTitle),
              div(
                { style: `display: flex; gap: 0.5rem;` },
                button({ class: 'small-button' }, 'Select'),
                button({ class: 'small-button' }, 'New'),
              ),
            ),
            () =>
              selectedBudgetName.val
                ? div(
                    {
                      class: 'categories-panel',
                      style: `padding-top: 1rem`,
                    },
                    article(
                      { class: 'summary-card' },
                      header('Summary'),
                      div(
                        { class: 'vc' },
                        div(
                          { class: 'hc' },
                          div('Starting Savings:'),
                          input({
                            type: 'text',
                            value: `${selectedBudget.val.startingSavings}`,
                            oninput: (e) =>
                              console.log('val: ' + e.target.value),
                            'aria-invalid':
                              selectedBudget.val.startingSavings !==
                              totalFunds.val,
                            'aria-describedby':
                              'invalid-starting-savings-helper',
                          }),
                        ),
                        div(
                          { class: 'hc' },
                          div('Fund Balances:'),
                          div(totalFunds.val),
                        ),
                        div(
                          { class: 'hc' },
                          div('Total Income:'),
                          div('1234.56'),
                        ),
                        div(
                          { class: 'hc' },
                          div('Total Expenses:'),
                          div('1234.56'),
                        ),
                        small(
                          { id: 'invalid-starting-savings-helper' },
                          `Fund balances must add up to Starting Balance. Total: ${formatMoney(totalFunds.val)}`,
                        ),
                      ),
                    ),
                    Tabs([
                      {
                        id: 'tab1',
                        label: 'Funds',
                        content: [
                          /*
                          div(
                            'Starting Savings: ',
                            
                            ,
                          ),
                          */
                          ...(selectedBudget.val?.funds?.map((f) =>
                            FundCard(f),
                          ) ?? []),
                        ],
                      },
                      {
                        id: 'tab2',
                        label: 'Expenses',
                        content: [div(h4('Expenses'))],
                      },
                      {
                        id: 'tab3',
                        label: 'Income',
                        content: [div(h4('Income'))],
                      },
                    ]),
                  )
                : span(
                    {
                      class: 'placeholder',
                      style: `display: grid; place-content: center; min-height: 10rem;`,
                    },
                    'Create or select a budget',
                  ),
            // () =>
            //   CategoriesLists({
            //     states: {
            //       categories: state.categories,
            //       transactions: monthTransactions,
            //     },
            //     onClickCategory: (c, i) => {
            //       categoryDialog.open({
            //         category: JSON.parse(JSON.stringify(c)),
            //       });
            //       console.debug(categoryDialog.states.category.val);
            //     },
            //     onClickViewAll: () => console.debug(`View All clicked`),
            //     onClickNew: () => {
            //       console.debug('New Category clicked');
            //       categoryDialog.open({ category: {} });
            //     },
            //   }),

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
    // () =>
    //   Route({
    //     rule: 'test',
    //     Loader() {
    //
    //     },
    //   }),
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
        button(
          {
            onclick: () => {
              localStorage.removeItem(DEMO_DATA_KEY);
              location.reload();
            },
          },
          'Reset Demo',
        ),
      );
    },
    async onLoad() {
      console.log('onLoad');
      // this.show();
    },
  });
setTimeout(() => {
  van.add(document.body, App());
}, 8000);

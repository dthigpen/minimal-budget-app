// import van from './vender/van.js';
import van from './vender/van.debug.js';
import { formatMoney } from './util.js';
import * as vanX from './vender/van-x.js';
const {
  a,
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

const { state } = van;

const Tab = (id, label, selectedTab) =>
  span(
    {
      class: () => 'tab' + (selectedTab.val === id ? ' active' : ''),
      onclick: () => (selectedTab.val = id),
    },
    label,
  );

const Content = (id, selectedTab, children) =>
  div(
    {
      class: 'tab-content',
      style: () => `display: ${selectedTab.val === id ? 'block' : 'none'}`,
    },
    children,
  );

export const CategoriesLists = ({
  states,
  onClickNew,
  onClickViewAll,
  onClickCategory,
}) => {
  const transactionsByCategoryName = Object.groupBy(
    states.transactions.val,
    (t) => t.category,
  );
  const categoryTransactionsTotals = Object.entries(
    transactionsByCategoryName,
  ).map(([catName, ts]) => {
    const total = ts.map((t) => t.amount).reduce((acc, v) => acc + v, 0);
    return [states.categories.find((c) => c.name === catName), ts, total];
  });
  const badCategoryTransactionTotals = categoryTransactionsTotals.filter(
    ([c]) => !c,
  );
  // console.log(`Unassigned or bad transactions: ${}`)
  const incomeCategories = categoryTransactionsTotals.filter(
    ([c, ..._]) => c && c.type === 'income',
  );
  const expenseCategories = categoryTransactionsTotals.filter(
    ([c, ..._]) => c && c.type === 'expense',
  );
  const selectedTab = state('tab1');
  return div(
    { class: 'categories-lists' },
    div(
      { class: 'titleholder' },
      h3({ class: 'title' }, 'Categories'),
      div(
        { class: 'buttons' },
        button({ class: 'small-button', onclick: onClickViewAll }, 'View All'),
        button(
          {
            class: 'small-button',
            onclick: onClickNew,
          },
          'New',
        ),
      ),
    ),
    div(
      { class: 'categoriesholder' },
      div(
        { class: 'tabs' },
        Tab('tab1', 'Funds', selectedTab),
        Tab('tab2', 'Expenses', selectedTab),
        Tab('tab3', 'Income', selectedTab),
      ),
      Content('tab1', selectedTab, [
        div(
          h4('Funds'),
          [].map(([v, ts, total], i) =>
            CategoryRow(v, {
              onClick: (e) => onClickCategory(v, i, e),
              total: total,
            }),
          ),
        ),
      ]),

      Content('tab2', selectedTab, [
        div(
          h4('Expenses'),
          expenseCategories.map(([v, ts, total], i) =>
            CategoryRow(v, {
              onClick: (e) => onClickCategory(v, i, e),
              total: total,
            }),
          ),
        ),
      ]),
      Content('tab3', selectedTab, [
        div(
          h4('Income'),
          div(
            incomeCategories.map(([v, ts, total], i) =>
              CategoryRow(v, {
                onClick: (e) => onClickCategory(v, i, e),
                total: total,
              }),
            ),
          ),
        ),
      ]),
    ),
  );
};

const ExpenseCard = (expense, { onClick, total = 0.0 }) => {
  console.log(`Expense total: ${total}`);
  // console.log(`TEST: ${expense}`)
  const categoryVal = expense;
  const hasGoal =
    categoryVal.budgeted !== undefined && categoryVal.budgeted !== null;
  const okayThreshold = 0.8;
  const zones = {
    BAD: '-bad',
    GOOD: '-good',
    OKAY: '-okay',
  };
  let zone = zones.GOOD;
  if (hasGoal) {
    if (total > categoryVal.budgeted) {
      zone = zones.BAD;
    } else {
      zone = zones.GOOD;
    }
  } else {
    zone = zones.BAD;
  }

  return div(
    { class: 'category-row', onclick: onClick },
    div(
      { class: 'holder' },
      span({ class: 'name' }, categoryVal.name),
      div(
        { class: 'amounts' },
        span('Spent:'),
        span({ class: 'total' }, formatMoney(total)),
        ...(hasGoal
          ? [
              // span({ class: 'divider' }, '/'),
              span('Budgeted:'),
              span({ class: 'goal' }, formatMoney(categoryVal.budgeted)),
            ]
          : []),
      ),
    ),
    progress({
      class: zone,
      value: Math.round(total),
      max: hasGoal ? Math.round(categoryVal.budgeted) : Math.round(total),
    }),
  );
};
const CategoryRow = (category, { onClick, total = 0.0 }) => {
  if (category.type === 'expense') {
    return ExpenseCard(category, { onClick, total });
  }
  console.log(`Category total: ${total}`);
  const categoryVal = category;
  const hasGoal = categoryVal.goal !== undefined && categoryVal.goal !== null;
  const isExpense = categoryVal.type === 'expense';
  const okayThreshold = 0.8;
  const zones = {
    BAD: '-bad',
    GOOD: '-good',
    OKAY: '-okay',
  };

  /*
		If income and has no goal, then always GOOD
		If income and total is >= threshold of goal then OKAY
		If income and total is < threshold of goal then BAD
		If income and total is >= goal then GOOD

		if expense and no goal, BAD
		if expense and total is < threshold of goal then GOOD
		if expense and total is >= threshold of goal then OKAY
		if expense and total >= goal then BAD
	*/
  // TODO use OK instead of just good and bad
  let zone = zones.GOOD;
  if (isExpense) {
    if (hasGoal) {
      if (total > categoryVal.goal) {
        zone = zones.BAD;
      } else {
        zone = zones.GOOD;
      }
    } else {
      zone = zones.BAD;
    }
  } else {
    // income
    if (hasGoal) {
      if (total > categoryVal.goal) {
        zone = zones.GOOD;
      } else {
        zone = zones.BAD;
      }
    } else {
      zone = zones.GOOD;
    }
  }

  return div(
    { class: 'category-row', onclick: onClick },
    div(
      { class: 'holder' },
      span({ class: 'name' }, categoryVal.name),
      div(
        { class: 'amounts' },
        span({ class: 'total' }, formatMoney(total)),
        ...(hasGoal
          ? [
              span({ class: 'divider' }, '/'),
              span({ class: 'goal' }, formatMoney(categoryVal.goal)),
            ]
          : []),
      ),
    ),
    progress({
      class: zone,
      value: Math.round(total),
      max: hasGoal ? Math.round(categoryVal.goal) : Math.round(total),
    }),
  );
};

const FundCard = (fund, { onClick }) => {
  console.log(`Category total: ${fund.total}`);
  const categoryVal = category;
  const hasGoal = categoryVal.goal !== undefined && categoryVal.goal !== null;
  const isExpense = categoryVal.type === 'expense';
  const okayThreshold = 0.8;
  const zones = {
    BAD: '-bad',
    GOOD: '-good',
    OKAY: '-okay',
  };
  /*
		If income and has no goal, then always GOOD
		If income and total is >= threshold of goal then OKAY
		If income and total is < threshold of goal then BAD
		If income and total is >= goal then GOOD

		if expense and no goal, BAD
		if expense and total is < threshold of goal then GOOD
		if expense and total is >= threshold of goal then OKAY
		if expense and total >= goal then BAD
	*/
  // TODO use OK instead of just good and bad
  let zone = zones.GOOD;
  if (isExpense) {
    if (hasGoal) {
      if (total > categoryVal.goal) {
        zone = zones.BAD;
      } else {
        zone = zones.GOOD;
      }
    } else {
      zone = zones.BAD;
    }
  } else {
    // income
    if (hasGoal) {
      if (total > categoryVal.goal) {
        zone = zones.GOOD;
      } else {
        zone = zones.BAD;
      }
    } else {
      zone = zones.GOOD;
    }
  }

  return div(
    { class: 'category-row', onclick: onClick },
    div(
      { class: 'holder' },
      span({ class: 'name' }, categoryVal.name),
      div(
        { class: 'amounts' },
        span({ class: 'total' }, formatMoney(total)),
        ...(hasGoal
          ? [
              span({ class: 'divider' }, '/'),
              span({ class: 'goal' }, formatMoney(categoryVal.goal)),
            ]
          : []),
      ),
    ),
    progress({
      class: zone,
      value: Math.round(total),
      max: hasGoal ? Math.round(categoryVal.goal) : Math.round(total),
    }),
  );
};

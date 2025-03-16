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
  	const total = ts.map(t => t.amount).reduce((acc, v) => acc+ v, 0)
    return [states.categories.find((c) => c.name === catName), ts, total];
  });
  const badCategoryTransactionTotals = categoryTransactionsTotals.filter(([c]) => !c)
  // console.log(`Unassigned or bad transactions: ${}`)
  const incomeCategories = categoryTransactionsTotals.filter(([c,..._]) => c && c.type === 'income');
  const expenseCategories = categoryTransactionsTotals.filter(
    ([c,..._]) => c && c.type === 'expense',
  );
  console.log(`FIRST`)
  console.log(JSON.stringify(expenseCategories[0]))
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
        h4('Income'),
        incomeCategories.map(([v,ts,total], i) =>
          CategoryRow(v, {
            onClick: (e) => onClickCategory(v, i, e),
            total: total,
          }),
        ),
        /*
        vanX.list(div, states.categories.filter(c => c.type ==='income'), (v, deleter, k) =>
          CategoryRow(v, {
            onClick: (e) => onClickCategory(v, k, e),
            total: Math.floor(Math.random() * ((v?.goal ?? 0) + 10 - 0) + 0),
          }),
        ),
        */
      ),
      div(
        h4('Expenses'),
       	expenseCategories.map(([v,ts,total], i) =>
            CategoryRow(v, {
              onClick: (e) => onClickCategory(v, i, e),
              total: total,
            }),
          ),
      ),
    ),
  );
};

const CategoryRow = (category, { onClick, total = 0.0 }) => {
	console.log(`Category total: ${ total}`)
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

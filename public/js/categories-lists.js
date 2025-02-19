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
  state,
  onClickNew,
  onClickViewAll,
  onClickCategory,
}) => {
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
        state.categories
          .filter((c) => c.type === 'income')
          .map((v, i) =>
            CategoryRow(v, {
              onClick: (e) => onClickCategory(v, i, e),
              total: Math.floor(Math.random() * ((v?.goal ?? 0) + 10 - 0) + 0),
            }),
          ),
        /*
        vanX.list(div, state.categories.filter(c => c.type ==='income'), (v, deleter, k) =>
          CategoryRow(v, {
            onClick: (e) => onClickCategory(v, k, e),
            total: Math.floor(Math.random() * ((v?.goal ?? 0) + 10 - 0) + 0),
          }),
        ),
        */
      ),
      div(
        h4('Expenses'),
        state.categories
          .filter((c) => c.type === 'expense')
          .map((v, i) =>
            CategoryRow(v, {
              onClick: (e) => onClickCategory(v, i, e),
              total: Math.floor(Math.random() * ((v?.goal ?? 0) + 10 - 0) + 0),
            }),
          ),
      ),
    ),
  );
};

const CategoryRow = (category, { onClick, total = 0.0 }) => {
  const categoryVal = category;
  console.log(`CategoryRow: ${JSON.stringify(categoryVal)}`);

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

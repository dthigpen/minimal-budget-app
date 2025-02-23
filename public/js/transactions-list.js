// import van from './vender/van.js';
import van from './vender/van.debug.js';
import { formatMoney } from './util.js';
const { div, span, button, h3, article } = van.tags;

const TransactionRow = ({ transaction, onClickRow }) => {
  onClickRow ??= () => {};
  const isNegative = transaction.amount < 0;
  return article(
    {
      class: 'transaction-row',
      onclick: () => onClickRow(transaction),
    },
    div(
      {
        class: 'row',
      },
      span(
        {
          class: 'description',
        },
        transaction.description ?? '',
      ),
      span(
        {
          class: `amount ${isNegative ? 'neg' : 'pos'}`,
        },
        // formatMoney(transaction.amount, ''),
        Math.abs(transaction.amount ?? 0).toFixed(2),
      ),
    ),
    div(
      {
        class: 'row',
      },
      span(
        {
          class: 'category',
        },
        transaction.category ??
          div(
            { class: 'categoryholder' },
            span('Uncategorized'),
            button({ class: 'assign' }, 'Assign'),
          ),
      ),
      span(
        {
          class: 'account',
        },
        transaction.account ?? '',
      ),
      span(
        {
          class: 'date',
        },
        transaction.date ?? span('<empty>'),
      ),
    ),
  );
};
export const TransactionsList = ({ state }) => {
  console.debug(`TransactionList ${state.transactions.length} transactions`);
  console.debug(`Transactions ${JSON.stringify(state.transactions)}`);
  return div(
    {
      class: 'transactions-list',
    },
    div(
      { class: 'title-button-bar' },
      h3({ class: 'title' }, 'Transactions'),
      div(
        { class: 'buttons' },
        button(
          {
            class: 'small-button',
            onclick: () => {
              console.debug('View all transactions clicked');
            },
          },
          'View All',
        ),
        button(
          {
            class: 'small-button',
            onclick: () => {
              console.debug('import transactions clicked');
            },
          },
          'Import',
        ),
        button(
          {
            class: 'small-button',
            onclick: () => {
              console.debug('new transaction clicked');
            },
          },
          'New',
        ),
      ),
    ),
    div(
      {
        class: 'transactionsholder',
      },

      ...state.transactions.map((t) => TransactionRow({ transaction: t })),
    ),
  );
};

// import van from './vender/van.js';
import van from './vender/van.debug.js';
import { formatMoney } from './util.js';
const { div, span, button, h3, article } = van.tags;

const TransactionRow = ({ transaction, onClick }) => {
  onClick ??= () => {};
  const isNegative = transaction.amount < 0;
  return article(
    {
      class: 'transaction-row',
      onclick: () => onClick(transaction),
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
export const TransactionsList = ({
  monthTransactions,
  onClickRow,
  onClickNew,
}) => {
  console.debug(`TransactionList ${monthTransactions.val.length} transactions`);
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
              onClickNew && onClickNew();
            },
          },
          'New',
        ),
      ),
    ),
    monthTransactions.val.length > 0
      ? div(
          {
            class: 'transactionsholder',
          },

          ...monthTransactions.val.map((t) =>
            TransactionRow({ transaction: t, onClick: onClickRow }),
          ),
        )
      : div(
          {
            class: 'transactionsempty',
          },
          span('No transactions for this month!'),
        ),
  );
};

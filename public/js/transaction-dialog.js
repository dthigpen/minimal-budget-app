import { initDialog, formatDate } from './util.js';
import van from './vender/van.debug.js';
import { Modal } from './vender/van-ui.js';
import * as vanX from './vender/van-x.js';
const {
  a,
  label,
  select,
  option,
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
  datalist,
} = van.tags;

export const TransactionDialog = ({ onSave, onDelete, onNewCategory }) => {
  const transactionDialog = initDialog(
    (ctx) => {
      const isNew = !Number.isInteger(ctx.transaction?.id);
      ctx.newTransaction ??= {};
      return {
        title: isNew ? 'New Transaction' : 'Edit Transaction',
        buttons: [
          {
            text: 'Cancel',
            class: 'secondary',
            onclick: () => {
              transactionDialog.close();
            },
          },
          isNew
            ? null
            : {
                text: 'Delete',
                class: 'contrast',
                onclick: () => {
                  if (onDelete) {
                    onDelete(ctx.transaction);
                  }
                },
              },
          {
            text: isNew ? 'Create' : 'Save',
            onclick: () => {
              // TODO figure out how to use form variable instead of queryselector
              const transactionForm =
                document.querySelector('#transaction-form');
              if (!transactionForm.checkValidity()) {
                transactionForm.reportValidity();
                return;
              }
              const newTransaction = {
                ...(ctx.transaction ?? {}),
                ...ctx.newTransaction,
              };
              if (onSave) {
                onSave(newTransaction);
              }
            },
          },
        ],
      };
    },
    (ctx) => {
      ctx.newTransaction ??= {};
      const categories = [
        'Uncategorized',
        ...new Set(
          (ctx.categories ?? []).filter(
            (c) => c.toLowerCase() !== 'uncategorized',
          ),
        ),
      ];
      const categoriesDom = categories.map((c) => option({ value: c }, c));
      let foundCategory = false;
      if (ctx.transaction?.category) {
        for (const o of categoriesDom) {
          if (ctx.transaction.category === o.value) {
            o.selected = true;
            foundCategory = false;
            break;
          }
        }
      }
      if (!foundCategory) {
        // select uncategorized
        categoriesDom[0].selected = true;
      }
      const isNew = !Number.isInteger(ctx.transaction?.id);
      return div(
        {
          class: 'transaction-dialog',
        },
        form(
          {
            id: 'transaction-form',
            onsubmit: (e) => {
              e.preventDefault();
            },
          },
          label(
            'Description',
            input({
              type: 'text',
              name: 'description',
              value: ctx.transaction?.description ?? '',
              oninput: function () {
                ctx.newTransaction.description = this.value;
              },
            }),
          ),
          label(
            'Amount',
            input({
              type: 'number',
              step: 0.01,
              name: 'amount',
              value: ctx.transaction?.amount ?? '',
              oninput: function () {
                ctx.newTransaction.amount = Number(this.value);
              },
            }),
          ),
          label(
            'Date',
            input({
              type: 'date',
              name: 'date',
              value: ctx.transaction?.date ?? '',
              oninput: function () {
                ctx.newTransaction.date = formatDate(new Date(this.value));
              },
            }),
          ),
          label(
            'Account',
            input({
              type: 'text',
              name: 'account',
              list: 'accounts-list',
              value: ctx.transaction?.account ?? '',
              oninput: function () {
                try {
                  ctx.newTransaction.date = formatDate(new Date(this.value));
                } catch (err) {
                  ctx.newTransaction.data = '';
                }
              },
            }),
          ),
          datalist(
            {
              id: 'accounts-list',
            },
            (ctx.accounts ?? []).map((a) => option({ value: a })),
          ),
          label(
            'Category',
            div(
              {
                class: 'row',
              },
              select(
                {
                  id: 'category-select',
                  name: 'category',
                  'aria-label': 'Category',
                },
                ...categoriesDom,
              ),
              button(
                {
                  onclick: () => onNewCategory && onNewCategory(),
                  disabled: true,
                },
                'New',
              ),
            ),
          ),
        ),
      );
    },
  );
  return transactionDialog;
};

import { formatDate, setupValidation } from './util.js';
import { initDialogWithButtons } from './dialog-util.js';
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

export const TransactionDialog = (states) => {
  // { onSave, onDelete, onNewCategory }
  // default states if needed before initing dialog
  states.transaction ??= van.state({});
  states.categories ??= van.state([]);
  states.accounts ??= van.state([]);
  states.isNew = van.derive(
    () => !Number.isInteger(states.transaction.val?.id),
  );
  states.newTransaction = {};

  return initDialogWithButtons(
    states,
    (s, dialogActions) => [
      {
        text: 'Cancel',
        class: 'secondary',
        onclick: () => {
          dialogActions.close();
        },
      },
      {
        text: 'Delete',
        class: () => (s.isNew.val ? '-gone' : 'contrast'),
        onclick: () => {
          if (s.onDelete) {
            s.onDelete(s.transaction.val);
          }
        },
      },
      {
        text: () => (s.isNew.val ? 'Create' : 'Save'),
        onclick: () => {
          // TODO figure out how to use form variable instead of queryselector
          const transactionForm = document.querySelector('#transaction-form');
          if (!transactionForm.checkValidity()) {
            transactionForm.reportValidity();
            return;
          }
          const newTransaction = {
            ...(s.transaction.val ?? {}),
            ...s.newTransaction,
          };
          if (s.onSave) {
            s.onSave(newTransaction);
          }
        },
      },
    ],
    (s, dialogActions) => {
      console.log(`isNew: ${s.isNew.val}`);
      s.newTransaction = {};
      const categoryNames = van.derive(() => [
        'Uncategorized',
        ...new Set(
          (s.categories.val ?? []).filter(
            (c) => c.toLowerCase() !== 'uncategorized',
          ),
        ),
      ]);
      // turns category names into select options and preselects the right one
      const categoriesDomFn = () => {
        const els = categoryNames.val.map((c) => option({ value: c }, c));
        let foundCategory = false;
        if (s.transaction.val.category) {
          for (const o of els) {
            if (s.transaction.val.category === o.value) {
              o.selected = true;
              foundCategory = true;
              break;
            }
          }
        }
        if (!foundCategory) {
          // select uncategorized
          els[0].selected = true;
        }
        return els;
      };
      const descriptionInput = input({
        type: 'text',
        name: 'description',
        value: s.transaction?.val?.description ?? '',
        oninput: function () {
          s.newTransaction.description = this.value;
        },
      });
      const amountInput = input({
        type: 'number',
        step: 0.01,
        name: 'amount',
        value: s.transaction?.val?.amount ?? '',
        oninput: function () {
          s.newTransaction.amount = Number(this.value);
        },
      });

      const dateInput = input({
        type: 'date',
        name: 'date',
        value: s.transaction?.val?.date ?? '',
        oninput: function () {
          s.newTransaction.date = formatDate(new Date(this.value));
        },
      });
      const accountInput = input({
        type: 'text',
        name: 'account',
        list: 'accounts-list',
        value: s.transaction?.val?.account ?? '',
        oninput: function () {
          try {
            s.newTransaction.date = formatDate(new Date(this.value));
          } catch (err) {
            s.newTransaction.date = '';
          }
        },
      });
      const elementValidations = [
        [
          descriptionInput,
          {
            invalid: (el) => {
              if (!el.value.trim()) {
                return 'Description must not be empty';
              }
            },
          },
        ],
        [
          amountInput,
          {
            invalid: (el) => {
              if (!el.value.trim()) {
                return 'Amount must not be empty';
              }
            },
          },
        ],
        [
          dateInput,
          {
            invalid: (el) => {
              if (!el.value.trim()) {
                return 'Date must not be empty';
              }
            },
          },
        ],
        [
          accountInput,
          {
            invalid: (el) => {
              if (!el.value.trim()) {
                return 'Account must not be empty';
              }
            },
          },
        ],
      ];
      for (const [el, validationConfig] of elementValidations) {
        setupValidation(el, validationConfig);
      }
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
          label('Description', descriptionInput),
          label('Amount', amountInput),
          label('Date', dateInput),
          label('Account', accountInput),
          () =>
            datalist(
              {
                id: 'accounts-list',
              },
              (s.accounts.val ?? []).map((a) => option({ value: a })),
            ),
          label(
            'Category',
            div(
              {
                class: 'row',
              },
              () =>
                select(
                  {
                    id: 'category-select',
                    name: 'category',
                    'aria-label': 'Category',
                    onchange: function () {
                      s.newTransaction.category = this.value;
                    },
                  },
                  categoriesDomFn(),
                ),
              button(
                {
                  onclick: () => s.onNewCategory && s.onNewCategory(),
                },
                'New',
              ),
            ),
          ),
        ),
      );
    },
  );
};

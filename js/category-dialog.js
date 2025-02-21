import { initDialog } from './util.js';
import van from './vender/van.debug.js';
import { Modal, MessageBoard, Tabs, Banner } from './vender/van-ui.js';
import * as vanX from './vender/van-x.js';
const {
  a,
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
} = van.tags;

export const CategoryDialog = ({ onSave }) => {
  const categoryDialog = initDialog(
    (ctx) => {
      const isNew = !Number.isInteger(ctx.category?.id);
      ctx.newCategory ??= {};
      return {
        title: isNew ? 'New Category' : 'Edit Category',
        buttons: [
          {
            text: 'Cancel',
            onclick: () => {
              categoryDialog.close();
            },
          },
          {
            text: isNew ? 'Create' : 'Save',
            onclick: () => {
              // TODO figure out how to use form variable instead of queryselector
              const categoryForm = document.querySelector('#category-form');
              if (!categoryForm.checkValidity()) {
                categoryForm.reportValidity();
                return;
              }
              const newCategory = {
                ...(ctx.category ?? {}),
                ...ctx.newCategory,
              };
              if (onSave) {
                onSave(newCategory);
              }
              categoryDialog.close();
            },
          },
        ],
      };
    },
    (ctx) => {
      ctx.newCategory ??= {};
      const isNew = !Number.isInteger(ctx.category?.id);
      const incomeGoalText = 'I want to make at least';
      const expenseGoalText = 'I want to spend under';
      const isExpenseState = isNew || ctx.category?.type === 'expense';
      const nameInput = input({
        type: 'text',
        placeholder: 'Groceries',
        required: true,
        name: 'category-name',
        minlength: 1,
        value: ctx.category?.name ?? '',
        oninput: () => (ctx.newCategory.name = nameInput.value),
      });
      const goalLabel = span({ id: 'category-goal-text' }, expenseGoalText);

      const incomeRadio = input({
        type: 'radio',
        id: 'category-type-income',
        name: 'category-type',
        value: 'income',
        checked: !isExpenseState,
        onchange: function (e) {
          if (this.value === 'income') {
            goalLabel.textContent = incomeGoalText;
          }
          ctx.newCategory.type = this.value;
        },
      });
      return div(
        form(
          {
            id: 'category-form',
            onsubmit: (e) => {
              e.preventDefault();
            },
          },
          label(
            'Category Name',
            // TODO add custom validation to check whether name is already in use
            nameInput,
          ),
          fieldset(
            legend('Type'),
            incomeRadio,
            label({ htmlFor: 'category-type-income' }, 'Income'),
            input({
              type: 'radio',
              id: 'category-type-expense',
              name: 'category-type',
              value: 'expense',
              checked: isExpenseState,
              onchange: function (e) {
                if (this.value === 'expense') {
                  goalLabel.textContent = expenseGoalText;
                }
                ctx.newcategory.type = this.value;
              },
            }),
            label({ htmlFor: 'category-type-expense' }, 'Expense'),
          ),
          label(
            goalLabel,
            input({
              type: 'number',
              placeholder: '350.00',
              name: 'category-goal',
              min: 0,
              value: ctx.category?.goal ?? '',
              oninput: function () {
                ctx.newCategory.goal = Number(this.value);
              },
            }),
          ),
        ),
      );
    },
  );
  return categoryDialog;
};

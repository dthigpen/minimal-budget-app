import { initDialog, initDialogWithButtons } from './dialog-util.js';
import van from './vender/van.debug.js';
import { Modal } from './vender/van-ui.js';
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

export const CategoryDialog = (states) => {
  const defaultCategoryValues = {
    name: '',
    type: 'expense',
    goal: undefined,
  };
  states.category ??= van.state({});
  states.isNew = van.derive(() => !Number.isInteger(states.category.val?.id));
  states.isExpenseState = van.derive(
    () => states.isNew.val || states.category.val?.type === 'expense',
  );
  states.newCategory = {};

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
            s.onDelete(s.category.val);
          }
        },
      },
      {
        text: s.isNew.val ? 'Create' : 'Save',
        onclick: () => {
          // TODO figure out how to use form variable instead of queryselector
          const categoryForm = document.querySelector('#category-form');
          if (!categoryForm.checkValidity()) {
            categoryForm.reportValidity();
            return;
          }
          const newCategory = {
            ...defaultCategoryValues,
            ...(s.category.val ?? {}),
            ...s.newCategory,
          };
          if (s.onSave) {
            s.onSave(newCategory);
          }
        },
      },
    ],
    (s, dialogActions) => {
      s.newCategory ??= {};
      console.log(`Category on render: ${JSON.stringify(s.category.val)}`);
      const incomeGoalText = 'I want to make at least';
      const expenseGoalText = 'I want to spend under';
      // const isExpenseState = van.derive(
      //   () => s.isNew.val || s.category.val?.type === 'expense',
      // );
      console.log(
        `isNew: ${states.isNew.val} type: ${states.category.val?.type}`,
      );
      const isExpenseState =
        states.isNew.val || states.category.val?.type === 'expense';
      const isIncomeStateFn = () =>
        !(s.isNew.val || s.category.val?.type === 'expense');
      const isExpenseStateFn = () =>
        s.isNew.val || s.category.val?.type === 'expense';
      const nameInput = input({
        type: 'text',
        placeholder: 'Groceries',
        required: true,
        name: 'category-name',
        minlength: 1,
        value: s.category.val?.name ?? '',
        oninput: () => (s.newCategory.name = nameInput.value),
      });
      const goalLabel = span({ id: 'category-goal-text' }, expenseGoalText);

      const incomeRadio = input({
        type: 'radio',
        id: 'category-type-income',
        name: 'category-type',
        value: 'income',
        checked: isIncomeStateFn,
        onchange: function (e) {
          if (this.value === 'income') {
            goalLabel.textContent = incomeGoalText;
          }
          s.newCategory.type = this.value;
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
              checked: isExpenseStateFn,
              onchange: function (e) {
                if (this.value === 'expense') {
                  goalLabel.textContent = expenseGoalText;
                }
                s.newcategory.type = this.value;
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
              value: s.category.val?.goal ?? '',
              oninput: function () {
                s.newCategory.goal = Number(this.value);
              },
            }),
          ),
        ),
      );
    },
  );
};

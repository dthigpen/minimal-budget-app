import { html } from './html.js';

function App() {
  console.log('Loading app');
  const DATA_KEY = 'minimal-budget-app';
  const DEFAULT_DATA = { categories: [], transactions: [] };
  const data = localStorage.getItem(DATA_KEY) ?? DEFAULT_DATA;
  const newCategoryForm = document.querySelector('#new-category-form');
  const categoriesTable = document.querySelector('#categories-table');

  function updateCategoriesTable() {
    const tbody = categoriesTable.querySelector('tbody');
    tbody.innerHTML = '';

    for (const category of data.categories) {
      const row = html`
        <tr>
          <td>${category.name}</td>
          <td>${category.goal ?? ''}</td>
          <td>${category.type}</td>
          <td>
            <div class="actions">
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </td>
        </tr>
      `;
      tbody.innerHTML += row;
    }
  }
  newCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.querySelector('#category-name');
    const incomeTypeEl = document.querySelector('#category-type-income');
    const expenseTypeEl = document.querySelector('#category-type-expense');
    const goalEl = document.querySelector('#category-goal');
    let validationErrors = [];
    // TODO add numeric validation to html
    const category = {};
    if (nameEl.value.trim()) {
      category.name = nameEl.value.trim();
    } else {
      validationErrors.push('Category name is required');
    }

    const goalValue = goalEl.value.trim();

    if (goalValue.length > 0) {
      const goal = Number(goalValue);
      if (!Number.isNaN(goal)) {
        category.goal = Number(goalValue);
      } else {
        validationErrors.push('Goal amount must be empty or be a valid number');
      }
    }

    if (incomeTypeEl.checked) {
      category.type = 'income';
    } else if (expenseTypeEl.checked) {
      category.type = 'expense';
    } else {
      validationErrors.push('Invalid category type');
    }

    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    console.log(`New category: ${JSON.stringify(category)}`);
    data.categories.push(category);
    e.target.reset();
    updateCategoriesTable();
  });

  updateCategoriesTable();
}
document.addEventListener('DOMContentLoaded', () => {
  App();
});

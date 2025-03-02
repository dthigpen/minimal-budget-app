/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

export function generateCategories() {
  return [
    {
      name: 'Job',
      goal: 2000,
      type: 'income',
    },
    {
      name: 'Side Hustle',
      goal: 50,
      type: 'income',
    },
    {
      name: 'Rewards',
      type: 'income',
    },
    {
      name: 'Entertainment',
      type: 'expense',
      goal: 50,
    },
    {
      name: 'Groceries',
      type: 'expense',
      goal: 250,
    },
    {
      name: 'Household Goods',
      type: 'expense',
      goal: 30,
    },
    {
      name: 'Travel',
      type: 'expense',
      // goal: {
      // 	period: 'year',
      // 	amount: 2000,
      // }
    },
    {
      name: 'Hobbies',
      type: 'expense',
      goal: 30,
    },
    {
      name: 'Clothes',
      type: 'expense',
      goal: 30,
    },
    {
      name: 'Transportation',
      type: 'expense',
      goal: 80,
    },
  ];
}
// ['WAL-MART #123', 'Household Goods'],
//     ['WAL-MART #456', 'Household Goods'],
//     ['AMAZON.COM A7878FS', 'Hobbies'],
//     ['AMAZON MRKT 12345', 'Clothes'],
//     ['COSTCO 485', 'Groceries'],
//     ['COSTCO 2345', 'Groceries'],
//     ['CINEMARK MOVIE THEATER', 'Entertainment'],
//     ['HOME DEPOT', 'House Repairs'],
//     ['DOMINOS PIZZA', 'Entertainment'],
//     ['SUSHI PLACE', 'Entertainment'],
//     ['BIKE SHOP', 'Transportation'],
//     ['SOWTHWEST.COM', 'Travel'],
//     ['HOTEL INN', 'Travel'],

function getRandomTransaction(
  descriptionCategoryPairs,
  accounts,
  { amountRange = [1000, 5000], randomlyUncategorize = false },
) {
  const [description, category] = getRandomItem(descriptionCategoryPairs);

  return {
    description: description,
    amount: getRandomInt(...amountRange) / 100,
    account: getRandomItem(accounts),
    category:
      !randomlyUncategorize || getRandomItem([true, false])
        ? category
        : undefined,
  };
}
export function generateTransactions() {
  const numMonths = 14;
  const now = new Date();
  const startYear = now.getFullYear();
  const startMonth = now.getMonth() + 1;
  const transactions = [];
  const bigIncomeDescriptionCategoryPairs = [
    ['JOB XYZ', 'Job'],
    ['UBER DRIVER', 'Side Hustle'],
  ];
  const smallIncomeDescriptionCategoryPairs = [
    ['CARD REWARDS', 'Rewards'],
    ['INTEREST EARNED', 'Rewards'],
    ['PAYPAL', undefined],
  ];
  const expenseDescriptionCategoryPairs = [
    ['WAL-MART #123', 'Household Goods'],
    ['WAL-MART #456', 'Household Goods'],
    ['AMAZON.COM A7878FS', 'Hobbies'],
    ['AMAZON MRKT 12345', 'Clothes'],
    ['COSTCO 485', 'Groceries'],
    ['COSTCO 2345', 'Groceries'],
    ['CINEMARK MOVIE THEATER', 'Entertainment'],
    ['HOME DEPOT', 'House Repairs'],
    ['DOMINOS PIZZA', 'Entertainment'],
    ['SUSHI PLACE', 'Entertainment'],
    ['BIKE SHOP', 'Transportation'],
    ['SOWTHWEST.COM', 'Travel'],
    ['HOTEL INN', 'Travel'],
  ];

  const incomeAccounts = ['Chase Checking', 'Wells Fargo Checking'];
  const expenseAccounts = [
    'Chase Credit Card',
    'Chase Debit Card',
    'Wells Fargo Checking',
  ];

  const monthlyRecurring = [
    getRandomTransaction(bigIncomeDescriptionCategoryPairs, incomeAccounts, {
      amountRange: [2000_00, 3000_00],
    }),
    getRandomTransaction(bigIncomeDescriptionCategoryPairs, incomeAccounts, {
      amountRange: [2000_00, 3000_00],
    }),
    {
      description: 'VISTA APARTMENTS',
      amount: getRandomInt(1500_00, 1700_00) / 100,
      account: getRandomItem(expenseAccounts),
      category: 'Rent',
    },
    {
      description: 'GROCERY-MART',
      amount: getRandomInt(90_00, 200_00) / 100,
      account: getRandomItem(expenseAccounts),
      category: 'Groceries',
    },
    {
      description: 'GROCERY-MART',
      amount: getRandomInt(90_00, 200_00) / 100,
      account: getRandomItem(expenseAccounts),
      category: 'Groceries',
    },
    {
      description: 'ENERGY COMPANY',
      amount: getRandomInt(50_00, 95_00) / 100,
      account: getRandomItem(expenseAccounts),
      category: 'Utilities',
    },
    {
      description: 'CITY WATER BILL',
      amount: getRandomInt(45_00, 50_00) / 100,
      account: getRandomItem(expenseAccounts),
      category: 'Utilities',
    },

    {
      description: 'COMCAST INTERNET',
      amount: getRandomInt(75_00, 79_00) / 100,
      account: getRandomItem(expenseAccounts),
      category: 'Internet',
    },
  ];
  // generate numMonths worth of transactions starting at the current month
  for (let i = 0, yr = startYear, mo = startMonth; i < numMonths; i++) {
    const yearMonth = `${String(yr).padStart(4, '0')}-${String(mo).padStart(2, '0')}`;

    const numSmallIncome = getRandomInt(1, 3);

    const numExpense = getRandomInt(5, 10);
    for (const transactionTemplate of monthlyRecurring) {
      const dayNum = getRandomInt(1, 29);

      const transaction = {
        ...transactionTemplate,
        date: `${yearMonth}-${String(dayNum).padStart(2, '0')}`,
      };
      transactions.push(transaction);
    }

    // generate income transactions
    for (let j = 0; j < numSmallIncome; j++) {
      const dayNum = getRandomInt(1, 29);
      // generate large amount for first two income description or small for rest
      const transaction = getRandomTransaction(
        smallIncomeDescriptionCategoryPairs,
        incomeAccounts,
        {
          amountRange: [5, 50_00],
          randomlyUncategorize: false,
        },
      );
      transaction.date = `${yearMonth}-${String(dayNum).padStart(2, '0')}`;
    }
    for (let j = 0; j < numExpense; j++) {
      const dayNum = getRandomInt(1, 29);
      const transaction = getRandomTransaction(
        expenseDescriptionCategoryPairs,
        expenseAccounts,
        {
          amountRange: [10_00, 295_00],
          randomlyUncategorize: true,
        },
      );
      transaction.date = `${yearMonth}-${String(dayNum).padStart(2, '0')}`;
      transactions.push(transaction);
    }
    // decrement yr, mo
    if (mo - 1 <= 0) {
      yr--;
      mo = 12;
    } else {
      mo--;
    }
  }
  // transactions.forEach(t => t.amount = Number((t.amount / 100).toFixed()))
  return transactions;
}

export function generateBudget() {
  const budget = {
    categories: [
      {
        name: 'Electric',
        includes: [
          {
            description: 'ENERGY',
          },
        ],
      },
      {
        name: 'Groceries',
        goal: 1000,
        includes: [
          {
            description: 'WAL-MART|COSTCO',
          },
        ],
      },
      {
        name: 'Entertainment',
        goal: 150,
        includes: [
          {
            description: 'THEATER',
          },
        ],
      },
      {
        name: 'Household',
        goal: 200,
        includes: [
          {
            description: 'HOME DEPOT',
          },
        ],
      },
      {
        name: 'Internet',
        includes: [
          {
            description: 'COMCAST',
          },
        ],
      },
      {
        name: 'Job',
        type: 'income',
        includes: [
          {
            description: 'JOB XYZ',
          },
        ],
      },
      {
        name: 'Supplemental',
        type: 'income',
        includes: [
          {
            description: 'UBER DRIVER',
          },
        ],
      },
    ],
  };
  return budget;
}

export function generateSettings() {
  return {};
}
const APP_STATE_DEMO_MODE_STORAGE_KEY = 'budget-app-demo-mode-state';

export function saveTestDataIntoStorage() {
  const state = {
    budget: generateBudget(),
    transactions: generateTransactions(),
    settings: generateSettings(),
  };
  localStorage.setItem(APP_STATE_DEMO_MODE_STORAGE_KEY, JSON.stringify(state));
}

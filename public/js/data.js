import { generateTestData } from './test-data.js';
import * as vanX from './vender/van-x.js';

// this key in local storage is used to store demo data
export const DEMO_DATA_KEY = 'minimal-budget-app-demo-data';
// this key in local storage is used to store actual user data
export const USER_DATA_KEY = 'minimal-budget-app-data';
// this key is used to store one of the above keys
// telling whether the data to load is demo data or user data
export const DATA_KEY_NAME = 'minimal-budget-app-key';

export function resetLocalStorage() {
  localStorage.removeItem(DATA_KEY_NAME);
  localStorage.removeItem(DEMO_DATA_KEY);
  localStorage.removeItem(USER_DATA_KEY);
}

export function getDataKey() {
  // first check which key to look at, either demo or real data
  // if does not exist, start in demo mode, so use demo key
  const dataKey = localStorage.getItem(DATA_KEY_NAME);
  if (!dataKey) {
    localStorage.setItem(DATA_KEY_NAME, DEMO_DATA_KEY);
    return DEMO_DATA_KEY;
  }
  return dataKey;
}

export function isDemoMode() {
  return getDataKey() === DEMO_DATA_KEY;
}

export function setDemoMode(enabled) {
  const dataKey = enabled ? DEMO_DATA_KEY : USER_DATA_KEY;
  localStorage.setItem(DATA_KEY_NAME, dataKey);
}

export function loadDataFromLocalStorage() {
  const dataKey = getDataKey();
  let dataString = localStorage.getItem(dataKey);
  if (!dataString) {
    // in demo mode, use generated data
    if (isDemoMode()) {
      dataString = JSON.stringify(generateTestData());
    } else {
      // otherwise use empty or default data
      dataString = JSON.stringify({
        settings: {
          currency: 'USD',
        },
        unbudgetedTransactions: [],
        budgets: [],
      });
    }
    // immediately store so that it doesn't need to be recalculated again
    localStorage.setItem(dataKey, dataString);
  }
  // decode
  const data = JSON.parse(dataString);

  // add ids categories and transactions
  // data.categories.forEach((c, i) => (c.id = i));
  // data.transactions.forEach((t, i) => (t.id = i));

  console.debug(`loaded local storage data: ${JSON.stringify(data)}`);
  return data;
}

export function saveStateToLocalStorage(stateObject) {
  const data = JSON.parse(JSON.stringify(vanX.compact(stateObject)));
  // remove ids categories and transactions
  // data.categories.forEach((c) => delete c.id);
  // data.transactions.forEach((t) => delete t.id);

  const dataKey = getDataKey();
  localStorage.setItem(dataKey, JSON.stringify(data));
}

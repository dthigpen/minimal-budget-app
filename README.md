# minimal-budget-app

A [minimal web based budgeting application](https://dthigpen.github.io/minimal-budget-app/). A project to explore a simple development stack: VanJS and CSS.

> [!NOTE]
> This application is under active development so not all features are implemented. Stay tuned for further progress!

## Features

| Feature                                     | Status          | Notes                                                                                                                     |
|---------------------------------------------|-----------------|---------------------------------------------------------------------------------------------------------------------------|
| Store data on device only (local storage)   | ✅ (Implemented) |                                                                                                                           |
| Categories (Create, read, delete, update)   | ✅ (Implemented) |                                                                                                                           |
| Category Goals                              | ✅ (Implemented) | "I want to spend under $amount" or "I want to make over $amount"                                                          |
| Goal Time Periods                           | 📅 (Planned)     | For example, "Spend a max of $600 in this category in the next 6 months". Currently only monthly goals are supported.     |
| Input Validation                            | ✅ (Implemented) | Prevents making input mistakes by showing invalid values. E.g non-numeric values in the Amount field, missing fields, etc |
| Transactions (Create, read, delete, update) | ✅ (Implemented) |                                                                                                                           |
| Manual Category Assignment                  | ✅ (Implemented) | Assign a category to a transaction by clicking the transaction and selecting a category.                                  |
| Automatic Category Assignment               | 📅 (Planned)     | Automatically assign category based on similar categorizations                                                            |
| Reoccurring Transactions                    | 📅 (Planned)     | Create a transaction that happens again at an interval (e.g. every 2 weeks, every month, etc).                            |
| Placeholder Transactions                    | 📅 (Planned)     | Create a placeholder transaction that will get replaced when importing the month's real transactions                      |
| CSV Transaction Import                      | 📅 (Planned)     | Import bank transactions and specify column names if necessary                                                            |
| Data Import/Export                          | 📅 (Planned)     | Import and export all application data to backup and restore safely                                                       |
 	

# minimal-budget-app

A [minimal web based budgeting application](https://dthigpen.github.io/minimal-budget-app/). A project to explore a simple development stack: VanJS and CSS.

> [!NOTE]
> This application is under active development so not all features are implemented. Stay tuned for further progress!

## Planned Features
- [x] Store data on device only (local storage)
- Categories
    - [x] Create, read, delete, update
    - [x] Goals (e.g. "I want to spend under $amount" or "I want to make over $amount")
    - [ ] Goal periods
    	- Groceries category might be $150 per month
    	- Travel category might be $2000 per year
    - Category dialog
   		- field validation
   			- [x] border change on input
   			- [x] prevent same name category
- Transactions
    - [x] Create, read, delete, update
    - Category assignment
    	- [x] Manually from transaction dialog
    	- [ ] Automatic from transaction confirm
   	- [ ] Reccurring (e.g. Every 2 weeks, every month, etc)
   	- [ ] Placeholder (e.g. temporary transaction acting as reminder until real transaction imported/entered)
    - Transaction dialog
   		- field validation
   			- [x] border change on input
 	

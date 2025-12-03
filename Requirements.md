High-Level Software Requirements Document
Overview
The 2-bucket investment simulator is an application designed to aid users in early retirement planning by simulating financial scenarios based on user inputs. The application will have a spreadsheet-like interface and be developed using React and SCSS.

Functional Requirements
Spreadsheet Interface

Develop a user interface with columns for Age1, Age2, Annual Expense, Fixed Expense, Tuition, One-off Expenses, Total Expenses, Rental Income, Income1, Income2, SS1, SS2, Effective Tax Rate, Total Income, Annual Need, Cash, Stock, Net Worth, and Inflation Adjusted.
Automatically calculate total expenses, total income, annual need, stock, net worth, and inflation-adjusted net worth based on user inputs and predefined formulas.
User Inputs

Allow users to input initial parameters:
Current Age of both individuals (Age1, Age2).
Starting portfolio amount.
Inflation expectation.
Social Security details for both individuals (amounts and starting ages for SS1 and SS2).
COLA percentage.
Effective Tax Rate.
Enable users to update inputs and recalculate projections dynamically upon pressing the "Update" button.
Implement input validations to ensure reasonableness of values (e.g., non-negative ages, non-negative incomes).
Simulation Logic

Calculate and display age-based data rows incrementally, stopping when both individuals exceed the age of 92.
Adjust financial values annually based on user inputs such as inflation and stock returns.
Implement cash bucket replenishment logic if it falls below a defined threshold and adjust stock values accordingly.
Data Persistence

Provide functionality to save the initial starting points in a JSON file for later reloading.
Enable users to reload simulations from a saved JSON file effortlessly.
Data Visualization

Generate and display a graph showing the Net Worth over time, including both inflation-adjusted and non-adjusted values.
Technical Considerations

Build the front-end application using React for the user interface and SCSS for styling.
Ensure the application operates in the USD currency only.
Implement common-sense validation based on industry standards.
Facilitate intuitive navigation and manipulation of data with no advanced spreadsheet features like filtering or sorting.
Non-Functional Requirements
Performance: Ensure the application responds quickly to user inputs and updates without noticeable lag.
Scalability: Design the application in a way that facilitates future expansion or inclusion of additional features if needed.
Tools and Frameworks
Front-End Framework: React
Styling: SCSS
Use modern, slick and dark-theme.

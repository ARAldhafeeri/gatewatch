# Test coverage:

- If changes are made to the code, the tests should be run to ensure that the changes have not broken the code.
- The tests should be run before a pull request is made to ensure that the code is working as expected.

## Running the tests

- To run the tests, navigate to the root directory of the project and run the following command:

```bash
npm test
```

- This will run the tests and display the results in the terminal.

## Test coverage

- Since the library is focused on cyber security test coverage must be high. minimum 90% coverage is required after any changes are made to the code.


## Logging test coverage

- v1.0.0 5/23/2023 : test_coverage > 90%

------------------------|---------|----------|---------|---------|-------------------                                
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                 
------------------------|---------|----------|---------|---------|-------------------
All files               |      95 |    97.05 |    90.9 |   97.29 | 
 src                    |   95.58 |    97.05 |      95 |   96.82 | 
  AccessControl.js      |    90.9 |      100 |   88.88 |    90.9 | 122-123
  utils.js              |   97.82 |    97.05 |     100 |     100 | 150
 src/core               |   91.66 |      100 |      50 |     100 | 
  AccessControlError.js |     100 |      100 |     100 |     100 | 
  erros.js              |    87.5 |      100 |       0 |     100 | 
------------------------|---------|----------|---------|---------|-------------------


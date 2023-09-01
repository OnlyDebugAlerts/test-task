How to change the code to support different file format versions?
- Just write another class that implements the interface and use it instead of the old one.

How will the import system change if in the future we need to get this data from a web API?
- Yuo can implement IExchangeOfficeParserResult interface and use it structure from web API.

If in the future it will be necessary to do the calculations using the national bank rate, how could this be added to the system?
- integrate api (for example websockets) with national bank rate and use it in the calculation

How would it be possible to speed up the execution of requests if the task allowed you to update market data once a day or even less frequently? Please explain all possible solutions you could think of
- Use cache, https://www.postgresql.org/docs/current/rules-materializedviews.html, add indexes, optimize sql query  
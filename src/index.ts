import { SimplexCalculator } from './simpexCalculator';
import { SimplexTable } from './simplexTable';

let matrix = [
  [1, -2, -12, -7, 0],
  [0, 1, 3, 2, 10000],
  [0, 2, 2, 1, 4000],
];
let table = new SimplexTable(matrix);

console.log(table);
console.log(table.getBaseVariableCollumnIndex());
console.log(table.getPivoLineIndex());
console.log(table.getCollumn(table.getBaseVariableCollumnIndex()));
console.log(table.getLine(table.getPivoLineIndex()));
console.log(table.getElement(1, 6));

let calculator = new SimplexCalculator(table);

calculator.solve();
console.log(calculator);

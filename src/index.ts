import { InputsManager } from './InputsManager';
import { SimplexCalculator } from './SimpexCalculator';
import { SimplexTable } from './SimplexTable';
import { Table } from './Table';

const inputsManager = new InputsManager(
  'objective-function-input',
  'restrictions-input',
);

const tableElement = new Table('result', []);

const solveButton = document.getElementById('solve');
solveButton?.addEventListener('click', (event) => {
  const simplexTable = new SimplexTable(inputsManager.getValues());
  const simpexCalculator = new SimplexCalculator(simplexTable);
  simpexCalculator.solve();
  tableElement.setContent(simpexCalculator.getSimplexTable().getStringTable());
  console.log(simpexCalculator);
});

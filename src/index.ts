import { InputsManager } from './InputsManager';
import { SimplexCalculator } from './SimpexCalculator';
import { SimplexTable } from './SimplexTable';
import { SolutionList } from './SolutionList';
import { Table } from './Table';

const inputsManager = new InputsManager(
  'objective-function-input',
  'restrictions-input',
);

const tableElement = new Table('result', []);
const solutionListElement = new SolutionList('result', null);

const solveButton = document.getElementById('solve');
solveButton?.addEventListener('click', (event) => {
  const resultElement = document.getElementById('result');
  const simplexTable = new SimplexTable(inputsManager.getValues());
  const simpexCalculator = new SimplexCalculator(simplexTable);
  simpexCalculator.solve();

  const result = simpexCalculator.getSimplexTable();
  const solution = simpexCalculator.getSolution();

  tableElement.setContent(result.getStringTable());
  solutionListElement.setIsIndeterminate(!simpexCalculator.hasSolution());
  solutionListElement.setSolution(solution);

  resultElement?.classList.remove('none');
});

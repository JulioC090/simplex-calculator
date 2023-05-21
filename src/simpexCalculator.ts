import { SimplexTable } from './SimplexTable';

export class SimplexCalculator {
  private simplexTable: SimplexTable;

  constructor(table: SimplexTable) {
    this.simplexTable = table;
  }

  public getSimplexTable() {
    return this.simplexTable;
  }

  public isSolved() {
    let line = this.simplexTable.getLine(0);
    let isSolved = true;
    line.map((value) => {
      if (value < 0) {
        isSolved = false;
      }
    });
    return isSolved;
  }

  public iterate(): void {
    let pivoLineIndex = this.simplexTable.getPivoLineIndex();

    let baseVariableCollumnIndex =
      this.simplexTable.getBaseVariableCollumnIndex();
    let pivoElement = this.simplexTable.getElement(
      pivoLineIndex,
      baseVariableCollumnIndex,
    );

    let newPivoLine = this.simplexTable.getLine(pivoLineIndex).map((value) => {
      return value / pivoElement;
    });

    this.simplexTable.setLine(pivoLineIndex, newPivoLine);

    this.simplexTable.getTable().forEach((line, index) => {
      if (index === pivoLineIndex) return;

      let normalize =
        -line[baseVariableCollumnIndex] / newPivoLine[baseVariableCollumnIndex];

      let newLine = line.map((value, index) => {
        return newPivoLine[index] * normalize + value;
      });

      this.simplexTable.setLine(index, newLine);
    });
  }

  public solve(): void {
    while (!this.isSolved()) {
      this.iterate();
    }
  }
}

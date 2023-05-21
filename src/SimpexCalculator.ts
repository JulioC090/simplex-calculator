import { SimplexTable } from './SimplexTable';

export type Solution = {
  basic: Array<{
    variable: string;
    value: number;
  }>;
  notBasic: Array<{
    variable: string;
    value: number;
  }>;
};
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

  public getSolution(): Solution {
    const table = this.simplexTable.getTable();
    const solution: Solution = {
      basic: [],
      notBasic: [],
    };

    for (let j = 0; j < table[0].length - 1; j++) {
      let isBasic = true;
      let index = 0;
      let amountOfNumber = 0;

      for (let i = 0; i < table.length; i++) {
        if (table[i][j] !== 0) {
          amountOfNumber++;
        }

        if (table[i][j] === 1) {
          index = i;
        }

        if (table[i][j] > 1 || amountOfNumber > 1) {
          isBasic = false;
          break;
        }
      }

      if (isBasic) {
        solution.basic.push({
          variable: this.simplexTable.getHeader()[j],
          value: this.simplexTable.getBValue(index),
        });
      } else {
        solution.notBasic.push({
          variable: this.simplexTable.getHeader()[j],
          value: 0,
        });
      }
    }

    return solution;
  }
}

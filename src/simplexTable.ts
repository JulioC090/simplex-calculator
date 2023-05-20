export class SimplexTable {
  private header: Array<string> = [];
  private table: Array<Array<number>> = [];
  private numberOfVariables: number = 0;
  private numberOfLooseness: number = 0;

  constructor(matrix: Array<Array<number>>) {
    this.numberOfVariables = matrix[0].length - 2;
    this.numberOfLooseness = matrix.length - 1;

    matrix.forEach((currentLine, index) => {
      let currentTableLine = [currentLine[0]];

      for (let i = 1; i < this.numberOfVariables + 1; i++) {
        currentTableLine.push(currentLine[i]);
      }

      for (let i = 0; i < this.numberOfLooseness; i++) {
        if (index - 1 === i) {
          currentTableLine.push(1);
        } else {
          currentTableLine.push(0);
        }
      }

      currentTableLine.push(currentLine[currentLine.length - 1]);

      this.table.push(currentTableLine);
    });

    this.header.push("z");

    for (let i = 0; i < this.numberOfVariables; i++) {
      this.header.push(`x${i + 1}`);
    }

    for (let i = 0; i < this.numberOfLooseness; i++) {
      this.header.push(`f${i + 1}`);
    }

    this.header.push("b");
  }

  public getNumberOfVariables(): number {
    return this.numberOfVariables;
  }

  public getNumberOfLooseness(): number {
    return this.numberOfLooseness;
  }

  public getLine(index: number): Array<number> {
    return this.table[index];
  }

  public setLine(index: number, line: Array<number>): void {
    this.table[index] = line;
  }

  public getCollumn(index: number): Array<number> {
    let collumn: Array<number> = [];
    this.table.map((line) => {
      collumn.push(line[index]);
    });
    return collumn;
  }

  public getElement(line: number, collumn: number): number {
    return this.table[line][collumn];
  }

  public getBValue(line: number): number {
    return this.table[line][this.table[line].length - 1];
  }

  public getTable(): Array<Array<number>> {
    return this.table;
  }

  public getBaseVariableCollumnIndex(): number {
    let lowerValue = this.table[0][1];
    let lowerValueIndex = 0;

    for (let i = 1; i <= this.numberOfVariables; i++) {
      if (this.table[0][i] < lowerValue) {
        lowerValue = this.table[0][i];
        lowerValueIndex = i;
      }
    }

    return lowerValueIndex;
  }

  public getPivoLineIndex(): number {
    let baseVariableCollumn = this.getBaseVariableCollumnIndex();
    let lowerPositiveValueIndex = 1;
    let lowerPositiveValue =
      this.getBValue(lowerPositiveValueIndex) /
      this.table[lowerPositiveValueIndex][baseVariableCollumn];

    for (let i = 2; i < this.table.length; i++) {
      let calculation = this.getBValue(i) / this.table[i][baseVariableCollumn];
      if (calculation < lowerPositiveValue) {
        lowerPositiveValue = calculation;
        lowerPositiveValueIndex = i;
      }
    }

    return lowerPositiveValueIndex;
  }
}

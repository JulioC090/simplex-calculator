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

    this.header.push('z');

    for (let i = 0; i < this.numberOfVariables; i++) {
      this.header.push(`x${i + 1}`);
    }

    for (let i = 0; i < this.numberOfLooseness; i++) {
      this.header.push(`f${i + 1}`);
    }

    this.header.push('b');
  }

  public getNumberOfVariables(): number {
    return this.numberOfVariables;
  }

  public getNumberOfLooseness(): number {
    return this.numberOfLooseness;
  }

  public getHeader(): Array<string> {
    return this.header;
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

  public getStringTable(): Array<Array<string>> {
    const table: Array<Array<string>> = [];
    table.push(this.header);

    const convertedTable: Array<Array<string>> = [];
    this.table.map((line) => {
      const convertedLine: Array<string> = [];
      line.map((value) => {
        convertedLine.push((Math.round(value * 100) / 100).toString());
      });
      convertedTable.push(convertedLine);
    });

    table.push(...convertedTable);
    return table;
  }

  public getBaseVariableCollumnIndex(): number {
    let lowerValue = this.table[0][0];
    let lowerValueIndex = 0;

    for (let i = 1; i < this.table[0].length; i++) {
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
      if (
        (calculation < lowerPositiveValue && calculation > 0) ||
        lowerPositiveValue <= 0
      ) {
        lowerPositiveValue = calculation;
        lowerPositiveValueIndex = i;
      }
    }

    if (lowerPositiveValue < 0) {
      lowerPositiveValueIndex = 0;
    }

    console.log(this.getStringTable());

    return lowerPositiveValueIndex;
  }
}

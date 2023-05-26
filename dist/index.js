// build/dist/ObjectiveFunctionInput.js
var ObjectiveFunctionInput = class {
  constructor(inputId, inputsManager2) {
    this.variableInputs = [];
    this.numberOfVariables = 0;
    this.element = document.getElementById(inputId);
    if (!this.element) {
      throw new Error(`ObjectiveFunctionInput: no element was found with id '${inputId}'`);
    }
    this.expressionElement = this.element.querySelector(".form__expression");
    if (!this.expressionElement) {
      throw new Error(`ObjectiveFunctionInput: expression element not found'`);
    }
    this.addButton = this.element.querySelector(".form__input__controls .controls__add");
    if (!this.addButton) {
      throw new Error(`ObjectiveFunctionInput: add button not found'`);
    }
    this.addButton.addEventListener("click", () => this.addVariableInput());
    this.removeButton = this.element.querySelector(".form__input__controls .controls__remove");
    if (!this.removeButton) {
      throw new Error(`ObjectiveFunctionInput: remove button not found'`);
    }
    this.removeButton.addEventListener("click", () => this.removeVariableInput());
    this.inputsManager = inputsManager2;
    this.variableInputs.push(this.createVariableInput());
    this.numberOfVariables++;
    this.render();
  }
  getValues() {
    const values = [];
    this.variableInputs.map((input) => {
      if (input.value) {
        values.push(Number(input.value));
      } else {
        values.push(0);
      }
    });
    return values;
  }
  createVariableInput() {
    const input = document.createElement("input");
    input.placeholder = "0";
    input.type = "number";
    return input;
  }
  addVariableInput() {
    this.variableInputs.push(this.createVariableInput());
    this.numberOfVariables++;
    this.inputsManager.addVariable();
    this.render();
  }
  removeVariableInput() {
    if (this.numberOfVariables <= 1) {
      return;
    }
    this.variableInputs.pop();
    this.numberOfVariables--;
    this.inputsManager.decreaseVariable();
    this.render();
  }
  render() {
    this.expressionElement.innerHTML = "Z = ";
    this.variableInputs.map((value, index) => {
      this.expressionElement.append(value);
      this.expressionElement.append(` X${index + 1} `);
      if (index != this.numberOfVariables - 1) {
        this.expressionElement.append("+ ");
      }
    });
  }
};

// build/dist/RestrictionsInputs.js
var RestrictionsInputs = class {
  constructor(restrictionsInputId) {
    this.restrictionsInputs = [];
    this.numberOfRestrictions = 0;
    this.numberOfVariables = 2;
    this.element = document.getElementById(restrictionsInputId);
    if (!this.element) {
      throw new Error(`RestrictionsInputs: no element was found with id '${restrictionsInputId}'`);
    }
    this.restrictionsElement = this.element.querySelector(".form__restrictions");
    if (!this.restrictionsElement) {
      throw new Error(`RestrictionsInputs: restrictions element not found'`);
    }
    this.addButton = this.element.querySelector(".form__input__controls .controls__add");
    if (!this.addButton) {
      throw new Error(`RestrictionsInputs: add button not found'`);
    }
    this.addButton.addEventListener("click", () => this.addRestrictionInput());
    this.removeButton = this.element.querySelector(".form__input__controls .controls__remove");
    if (!this.removeButton) {
      throw new Error(`RestrictionsInputs: remove button not found'`);
    }
    this.removeButton.addEventListener("click", () => this.removeRestrictionInput());
    this.addRestrictionInput();
    this.render();
  }
  getValues() {
    const values = [];
    this.restrictionsInputs.map((restriction) => {
      const restrictionValues = [];
      restriction.map((input) => {
        if (input.value) {
          restrictionValues.push(Number(input.value));
        } else {
          restrictionValues.push(0);
        }
      });
      values.push(restrictionValues);
    });
    return values;
  }
  createVariableInput() {
    const input = document.createElement("input");
    input.placeholder = "0";
    input.type = "number";
    return input;
  }
  addRestrictionInput() {
    const inputs = [];
    for (let i = 0; i < this.numberOfVariables; i++) {
      inputs.push(this.createVariableInput());
    }
    this.restrictionsInputs.push(inputs);
    this.numberOfRestrictions++;
    this.render();
  }
  removeRestrictionInput() {
    if (this.numberOfRestrictions <= 1) {
      return;
    }
    this.restrictionsInputs.pop();
    this.numberOfRestrictions--;
    this.render();
  }
  addVariable() {
    this.numberOfVariables++;
    this.restrictionsInputs.map((restriction) => {
      restriction.push(this.createVariableInput());
    });
    this.render();
  }
  removeVariable() {
    if (this.numberOfVariables <= 2) {
      return;
    }
    this.numberOfVariables--;
    this.restrictionsInputs.map((restriction) => {
      restriction.pop();
    });
    this.render();
  }
  render() {
    this.restrictionsElement.innerHTML = "";
    this.restrictionsInputs.map((restriction) => {
      const restrictionDiv = document.createElement("div");
      restrictionDiv.classList.add("form__expression");
      restriction.map((input, index) => {
        restrictionDiv.append(input);
        if (index < this.numberOfVariables - 2) {
          restrictionDiv.append(` X${index + 1} `);
          restrictionDiv.append("+ ");
        } else if (index < this.numberOfVariables - 1) {
          restrictionDiv.append(` X${index + 1} `);
          restrictionDiv.append("≤ ");
        }
      });
      this.restrictionsElement.append(restrictionDiv);
    });
  }
};

// build/dist/InputsManager.js
var InputsManager = class {
  constructor(objectiveFunctionInputId, restrictionsInputId) {
    this.objectiveFunctionInput = new ObjectiveFunctionInput(objectiveFunctionInputId, this);
    this.restrictionsInput = new RestrictionsInputs(restrictionsInputId);
  }
  getValues() {
    const values = [];
    const inversedObjectiveFunctionValues = this.objectiveFunctionInput.getValues().map((value) => -value);
    values.push([1, ...inversedObjectiveFunctionValues, 0]);
    this.restrictionsInput.getValues().map((value) => {
      values.push([0, ...value]);
    });
    return values;
  }
  addVariable() {
    this.restrictionsInput.addVariable();
  }
  decreaseVariable() {
    this.restrictionsInput.removeVariable();
  }
};

// build/dist/SimpexCalculator.js
var SimplexCalculator = class {
  constructor(table) {
    this.simplexTable = table;
  }
  getSimplexTable() {
    return this.simplexTable;
  }
  isSolved() {
    let line = this.simplexTable.getLine(0);
    let isSolved = true;
    line.map((value) => {
      if (value < 0) {
        isSolved = false;
      }
    });
    return isSolved;
  }
  iterate() {
    let pivoLineIndex = this.simplexTable.getPivoLineIndex();
    let baseVariableCollumnIndex = this.simplexTable.getBaseVariableCollumnIndex();
    let pivoElement = this.simplexTable.getElement(pivoLineIndex, baseVariableCollumnIndex);
    let newPivoLine = this.simplexTable.getLine(pivoLineIndex).map((value) => {
      return value / pivoElement;
    });
    this.simplexTable.setLine(pivoLineIndex, newPivoLine);
    this.simplexTable.getTable().forEach((line, index) => {
      if (index === pivoLineIndex)
        return;
      let normalize = -line[baseVariableCollumnIndex] / newPivoLine[baseVariableCollumnIndex];
      let newLine = line.map((value, index2) => {
        return newPivoLine[index2] * normalize + value;
      });
      this.simplexTable.setLine(index, newLine);
    });
  }
  solve() {
    while (!this.isSolved()) {
      this.iterate();
    }
  }
  getSolution() {
    const table = this.simplexTable.getTable();
    const solution = {
      basic: [],
      notBasic: []
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
          value: this.simplexTable.getBValue(index)
        });
      } else {
        solution.notBasic.push({
          variable: this.simplexTable.getHeader()[j],
          value: 0
        });
      }
    }
    return solution;
  }
};

// build/dist/SimplexTable.js
var SimplexTable = class {
  constructor(matrix) {
    this.header = [];
    this.table = [];
    this.numberOfVariables = 0;
    this.numberOfLooseness = 0;
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
  getNumberOfVariables() {
    return this.numberOfVariables;
  }
  getNumberOfLooseness() {
    return this.numberOfLooseness;
  }
  getHeader() {
    return this.header;
  }
  getLine(index) {
    return this.table[index];
  }
  setLine(index, line) {
    this.table[index] = line;
  }
  getCollumn(index) {
    let collumn = [];
    this.table.map((line) => {
      collumn.push(line[index]);
    });
    return collumn;
  }
  getElement(line, collumn) {
    return this.table[line][collumn];
  }
  getBValue(line) {
    return this.table[line][this.table[line].length - 1];
  }
  getTable() {
    return this.table;
  }
  getStringTable() {
    const table = [];
    table.push(this.header);
    const convertedTable = [];
    this.table.map((line) => {
      const convertedLine = [];
      line.map((value) => {
        convertedLine.push((Math.round(value * 100) / 100).toString());
      });
      convertedTable.push(convertedLine);
    });
    table.push(...convertedTable);
    return table;
  }
  getBaseVariableCollumnIndex() {
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
  getPivoLineIndex() {
    let baseVariableCollumn = this.getBaseVariableCollumnIndex();
    let lowerPositiveValueIndex = 1;
    let lowerPositiveValue = this.getBValue(lowerPositiveValueIndex) / this.table[lowerPositiveValueIndex][baseVariableCollumn];
    for (let i = 2; i < this.table.length; i++) {
      let calculation = this.getBValue(i) / this.table[i][baseVariableCollumn];
      if (calculation < lowerPositiveValue && calculation > 0 || lowerPositiveValue <= 0) {
        lowerPositiveValue = calculation;
        lowerPositiveValueIndex = i;
      }
    }
    return lowerPositiveValueIndex;
  }
};

// build/dist/SolutionList.js
var SolutionList = class {
  constructor(id, solution) {
    this.solution = null;
    this.element = document.getElementById(id);
    if (!this.element) {
      throw new Error(`Table: no element was found with id '${id}'`);
    }
    this.list = document.createElement("div");
    this.list.classList.add("solution");
    this.element.append(this.list);
    this.setSolution(solution);
  }
  createH4(text) {
    let h4 = document.createElement("h4");
    let textElement = document.createTextNode(text);
    h4.append(textElement);
    return h4;
  }
  createList(content) {
    let ul = document.createElement("ul");
    content.map((value) => {
      let li = document.createElement("li");
      let text = document.createTextNode(`${value.variable}: ${value.value}`);
      li.append(text);
      ul.append(li);
    });
    return ul;
  }
  setSolution(solution) {
    this.solution = solution;
    if (this.solution) {
      this.render();
    }
  }
  render() {
    this.list.innerText = "";
    this.list.append(this.createH4("Variáveis Básicas"));
    this.list.append(this.createList(this.solution.basic));
    this.list.append(this.createH4("Variáveis Não Básicas"));
    this.list.append(this.createList(this.solution.notBasic));
  }
};

// build/dist/Table.js
var Table = class {
  constructor(id, content) {
    this.element = document.getElementById(id);
    if (!this.element) {
      throw new Error(`Table: no element was found with id '${id}'`);
    }
    this.content = content;
    this.table = document.createElement("table");
    const div = document.createElement("div");
    div.classList.add("table");
    div.append(this.table);
    this.element.append(div);
    this.render();
  }
  setContent(content) {
    this.content = content;
    this.render();
  }
  render() {
    this.table.innerHTML = "";
    const header = document.createElement("tr");
    this.content.shift()?.map((value) => {
      const cell = document.createElement("th");
      cell.innerText = value;
      header.append(cell);
    });
    this.table.append(header);
    this.content.map((line) => {
      const lineElement = document.createElement("tr");
      line.map((value) => {
        const cell = document.createElement("td");
        cell.innerText = value;
        lineElement.append(cell);
      });
      this.table.append(lineElement);
    });
  }
};

// build/dist/index.js
var inputsManager = new InputsManager("objective-function-input", "restrictions-input");
var tableElement = new Table("result", []);
var solutionListElement = new SolutionList("result", null);
var solveButton = document.getElementById("solve");
solveButton?.addEventListener("click", (event) => {
  const result = document.getElementById("result");
  const simplexTable = new SimplexTable(inputsManager.getValues());
  const simpexCalculator = new SimplexCalculator(simplexTable);
  simpexCalculator.solve();
  tableElement.setContent(simpexCalculator.getSimplexTable().getStringTable());
  solutionListElement.setSolution(simpexCalculator.getSolution());
  result?.classList.remove("none");
});
//# sourceMappingURL=index.js.map

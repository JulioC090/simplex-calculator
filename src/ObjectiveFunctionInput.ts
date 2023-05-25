import { InputsManager } from './InputsManager';

export class ObjectiveFunctionInput {
  private element: HTMLElement | null;
  private expressionElement: HTMLElement | null;
  private addButton: HTMLElement | null;
  private removeButton: HTMLElement | null;

  private inputsManager: InputsManager;

  private variableInputs: Array<HTMLInputElement> = [];
  private numberOfVariables: number = 0;

  constructor(inputId: string, inputsManager: InputsManager) {
    this.element = document.getElementById(inputId);
    if (!this.element) {
      throw new Error(
        `ObjectiveFunctionInput: no element was found with id '${inputId}'`,
      );
    }

    this.expressionElement = this.element.querySelector('.form__expression');
    if (!this.expressionElement) {
      throw new Error(`ObjectiveFunctionInput: expression element not found'`);
    }

    this.addButton = this.element.querySelector(
      '.form__input__controls .controls__add',
    );
    if (!this.addButton) {
      throw new Error(`ObjectiveFunctionInput: add button not found'`);
    }
    this.addButton.addEventListener('click', () => this.addVariableInput());

    this.removeButton = this.element.querySelector(
      '.form__input__controls .controls__remove',
    );
    if (!this.removeButton) {
      throw new Error(`ObjectiveFunctionInput: remove button not found'`);
    }
    this.removeButton.addEventListener('click', () =>
      this.removeVariableInput(),
    );

    this.inputsManager = inputsManager;

    this.variableInputs.push(this.createVariableInput());
    this.numberOfVariables++;
    this.render();
  }

  public getValues(): Array<number> {
    const values: Array<number> = [];
    this.variableInputs.map((input) => {
      if (input.value) {
        values.push(Number(input.value));
      } else {
        values.push(0);
      }
    });
    return values;
  }

  private createVariableInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.placeholder = '0';
    input.type = 'number';
    return input;
  }

  private addVariableInput() {
    this.variableInputs.push(this.createVariableInput());
    this.numberOfVariables++;
    this.inputsManager.addVariable();
    this.render();
  }

  private removeVariableInput() {
    if (this.numberOfVariables <= 1) {
      return;
    }

    this.variableInputs.pop();
    this.numberOfVariables--;
    this.inputsManager.decreaseVariable();
    this.render();
  }

  private render() {
    this.expressionElement!.innerHTML = 'Z = ';

    this.variableInputs.map((value, index) => {
      this.expressionElement!.append(value);
      this.expressionElement!.append(` X${index + 1} `);
      if (index != this.numberOfVariables - 1) {
        this.expressionElement!.append('+ ');
      }
    });
  }
}

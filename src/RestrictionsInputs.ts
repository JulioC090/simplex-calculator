export class RestrictionsInputs {
  private element: HTMLElement | null;
  private restrictionsElement: HTMLElement | null;
  private addButton: HTMLElement | null;
  private removeButton: HTMLElement | null;

  private restrictionsInputs: Array<Array<HTMLInputElement>> = [];
  private numberOfRestrictions: number = 0;
  private numberOfVariables: number = 2;

  constructor(restrictionsInputId: string) {
    this.element = document.getElementById(restrictionsInputId);
    if (!this.element) {
      throw new Error(
        `RestrictionsInputs: no element was found with id '${restrictionsInputId}'`,
      );
    }

    this.restrictionsElement = this.element.querySelector(
      '.form__restrictions',
    );
    if (!this.restrictionsElement) {
      throw new Error(`RestrictionsInputs: restrictions element not found'`);
    }

    this.addButton = this.element.querySelector(
      '.form__input__controls .controls__add',
    );
    if (!this.addButton) {
      throw new Error(`RestrictionsInputs: add button not found'`);
    }
    this.addButton.addEventListener('click', () => this.addRestrictionInput());

    this.removeButton = this.element.querySelector(
      '.form__input__controls .controls__remove',
    );
    if (!this.removeButton) {
      throw new Error(`RestrictionsInputs: remove button not found'`);
    }
    this.removeButton.addEventListener('click', () =>
      this.removeRestrictionInput(),
    );

    this.addRestrictionInput();
    this.render();
  }

  public getValues(): Array<Array<number>> {
    const values: Array<Array<number>> = [];
    this.restrictionsInputs.map((restriction) => {
      const restrictionValues: Array<number> = [];
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

  private createVariableInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.placeholder = '0';
    input.type = 'number';
    return input;
  }

  private addRestrictionInput() {
    const inputs: Array<HTMLInputElement> = [];
    for (let i = 0; i < this.numberOfVariables; i++) {
      inputs.push(this.createVariableInput());
    }
    this.restrictionsInputs.push(inputs);
    this.numberOfRestrictions++;
    this.render();
  }

  private removeRestrictionInput() {
    if (this.numberOfRestrictions <= 1) {
      return;
    }

    this.restrictionsInputs.pop();
    this.numberOfRestrictions--;
    this.render();
  }

  public addVariable() {
    this.numberOfVariables++;
    this.restrictionsInputs.map((restriction) => {
      restriction.push(this.createVariableInput());
    });
    this.render();
  }

  public removeVariable() {
    if (this.numberOfVariables <= 2) {
      return;
    }

    this.numberOfVariables--;
    this.restrictionsInputs.map((restriction) => {
      restriction.pop();
    });
    this.render();
  }

  private render() {
    this.restrictionsElement!.innerHTML = '';

    this.restrictionsInputs.map((restriction) => {
      const restrictionDiv = document.createElement('div');
      restrictionDiv.classList.add('form__expression');

      restriction.map((input, index) => {
        restrictionDiv.append(input);
        if (index < this.numberOfVariables - 2) {
          restrictionDiv.append(` X${index + 1} `);
          restrictionDiv.append('+ ');
        } else if (index < this.numberOfVariables - 1) {
          restrictionDiv.append(` X${index + 1} `);
          restrictionDiv.append('≤ ');
        }
      });

      this.restrictionsElement!.append(restrictionDiv);
    });
  }
}

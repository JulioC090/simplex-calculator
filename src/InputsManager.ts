import { ObjectiveFunctionInput } from './ObjectiveFunctionInput';
import { RestrictionsInputs } from './RestrictionsInputs';

export class InputsManager {
  private objectiveFunctionInput: ObjectiveFunctionInput;
  private restrictionsInput: RestrictionsInputs;

  constructor(objectiveFunctionInputId: string, restrictionsInputId: string) {
    this.objectiveFunctionInput = new ObjectiveFunctionInput(
      objectiveFunctionInputId,
      this,
    );

    this.restrictionsInput = new RestrictionsInputs(restrictionsInputId);
  }

  public getValues(): Array<Array<number>> {
    const values: Array<Array<number>> = [];
    const inversedObjectiveFunctionValues = this.objectiveFunctionInput
      .getValues()
      .map((value) => -value);
    values.push([1, ...inversedObjectiveFunctionValues, 0]);
    this.restrictionsInput.getValues().map((value) => {
      values.push([0, ...value]);
    });
    return values;
  }

  public addVariable() {
    this.restrictionsInput.addVariable();
  }

  public decreaseVariable() {
    this.restrictionsInput.removeVariable();
  }
}

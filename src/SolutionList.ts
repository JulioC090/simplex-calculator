import { Solution } from './SimpexCalculator';

export class SolutionList {
  private element: HTMLElement | null;
  private solution: Solution | null = null;
  private list: HTMLElement;

  constructor(id: string, solution: Solution | null) {
    this.element = document.getElementById(id);
    if (!this.element) {
      throw new Error(`Table: no element was found with id '${id}'`);
    }

    this.list = document.createElement('div');
    this.list.classList.add('solution');
    this.element.append(this.list);
    this.setSolution(solution);
  }

  private createH4(text: string): HTMLElement {
    let h4 = document.createElement('h4');
    let textElement = document.createTextNode(text);
    h4.append(textElement);
    return h4;
  }

  private createList(content: Array<{ variable: string; value: number }>) {
    let ul = document.createElement('ul');
    content.map((value) => {
      let li = document.createElement('li');
      let text = document.createTextNode(`${value.variable}: ${value.value}`);
      li.append(text);
      ul.append(li);
    });
    return ul;
  }

  public setSolution(solution: Solution | null) {
    this.solution = solution;
    if (this.solution) {
      this.render();
    }
  }

  private render() {
    this.list.innerText = '';
    this.list.append(this.createH4('Variáveis Básicas'));
    this.list.append(this.createList(this.solution!.basic));
    this.list.append(this.createH4('Variáveis Não Básicas'));
    this.list.append(this.createList(this.solution!.notBasic));
  }
}

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
    this.element.append(this.list);
    this.setSolution(solution);
  }

  private createParagraph(text: string): HTMLElement {
    let p = document.createElement('p');
    let textElement = document.createTextNode(text);
    p.append(textElement);
    return p;
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
    this.list.append(this.createParagraph('Solução'));
    this.list.append(this.createParagraph('Variáveis Básicas'));
    this.list.append(this.createList(this.solution!.basic));
    this.list.append(this.createParagraph('Variáveis Não Básicas'));
    this.list.append(this.createList(this.solution!.notBasic));
  }
}
